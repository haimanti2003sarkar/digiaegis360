-- Create institutions table
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificate records table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  course TEXT NOT NULL,
  marks TEXT,
  grade TEXT,
  issue_date DATE NOT NULL,
  institution_id UUID REFERENCES public.institutions(id),
  certificate_type TEXT DEFAULT 'degree',
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create verification requests table
CREATE TABLE public.verification_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT,
  extracted_data JSONB,
  verification_result JSONB,
  status TEXT DEFAULT 'pending', -- pending, verified, invalid, needs_review
  confidence_score INTEGER,
  verified_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blacklisted certificates table
CREATE TABLE public.blacklisted_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  reported_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklisted_certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for verification purposes)
CREATE POLICY "Institutions are viewable by everyone" 
ON public.institutions FOR SELECT USING (true);

CREATE POLICY "Certificates are viewable by everyone" 
ON public.certificates FOR SELECT USING (true);

CREATE POLICY "Verification requests are viewable by everyone" 
ON public.verification_requests FOR SELECT USING (true);

CREATE POLICY "Blacklisted certificates are viewable by everyone" 
ON public.blacklisted_certificates FOR SELECT USING (true);

-- Create policies for insert (allow everyone to create verification requests)
CREATE POLICY "Anyone can create verification requests" 
ON public.verification_requests FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_certificates_certificate_id ON public.certificates(certificate_id);
CREATE INDEX idx_certificates_roll_number ON public.certificates(roll_number);
CREATE INDEX idx_certificates_student_name ON public.certificates(student_name);
CREATE INDEX idx_verification_requests_status ON public.verification_requests(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON public.verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample institutions
INSERT INTO public.institutions (name, code, contact_email, is_verified) VALUES
('ABC University', 'ABC001', 'admin@abcuniversity.edu', true),
('XYZ College of Engineering', 'XYZ002', 'registrar@xyzengineering.edu', true),
('State Technical Institute', 'STI003', 'office@statetech.edu', true);

-- Insert sample certificate records with fixed institution references
INSERT INTO public.certificates (certificate_id, student_name, roll_number, course, marks, grade, issue_date, institution_id, certificate_type) VALUES
('CERT001234', 'John Doe', '2020CSE123', 'Computer Science Engineering', '85%', 'A', '2024-06-15', (SELECT id FROM public.institutions WHERE code = 'ABC001'), 'degree'),
('CERT005678', 'Jane Smith', '2019ECE456', 'Electronics Engineering', '78%', 'B', '2023-05-20', (SELECT id FROM public.institutions WHERE code = 'XYZ002'), 'degree'),
('CERT009876', 'Alice Johnson', '2021ME789', 'Mechanical Engineering', '92%', 'A', '2024-07-10', (SELECT id FROM public.institutions WHERE code = 'STI003'), 'degree'),
('CERT001111', 'Bob Wilson', '2020CSE456', 'Computer Science Engineering', '73%', 'B', '2024-06-18', (SELECT id FROM public.institutions WHERE code = 'ABC001'), 'degree'),
('CERT002222', 'Sarah Davis', '2019ECE789', 'Electronics Engineering', '88%', 'A', '2023-05-25', (SELECT id FROM public.institutions WHERE code = 'XYZ002'), 'degree');