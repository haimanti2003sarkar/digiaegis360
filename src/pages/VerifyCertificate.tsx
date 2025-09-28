import { useState } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
// Gemini API integration
const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Scan,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VerifyCertificate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [geminiResult, setGeminiResult] = useState<string>("");
  const { toast } = useToast();


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVerificationResult(null);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for verification`
      });
    }
  };

  // OCR and verification logic
  const handleVerification = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a certificate file first",
        variant: "destructive"
      });
      return;
    }
    setIsVerifying(true);
    setVerificationResult(null);
    setOcrText("");
    try {
      // Only support image files for now (jpg, jpeg, png)
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          title: "Unsupported file type",
          description: "Only image files (JPG, PNG) are supported for OCR.",
          variant: "destructive"
        });
        setIsVerifying(false);
        return;
      }
      // OCR extraction
      const { data } = await Tesseract.recognize(selectedFile, "eng");
      setOcrText(data.text);
      toast({
        title: "OCR Complete",
        description: "Text extracted from certificate. Verifying...",
      });
      // Send extracted text to backend for verification
      // Use local backend endpoint
      const apiUrl = "http://localhost:5001/verify-certificate";
      let verificationResponse;
      try {
        verificationResponse = await axios.post(apiUrl, { text: data.text });
        setVerificationResult({
          status: verificationResponse.data.status,
          details: verificationResponse.data.details,
          message: verificationResponse.data.message || "Verification complete.",
          authorized: verificationResponse.data.authorized
        });
        toast({
          title: "Verification Complete",
          description: verificationResponse.data.message || "Verification complete.",
          variant: verificationResponse.data.status === "valid" ? "default" : "destructive"
        });
      } catch (apiErr) {
        setVerificationResult({
          status: "error",
          details: null,
          message: "Verification failed. Could not reach backend or invalid response."
        });
        toast({
          title: "Verification Failed",
          description: "Could not verify certificate with backend.",
          variant: "destructive"
        });
      }

      // Always send extracted text to Gemini, even if backend fails or fields are missing
      setGeminiResult("");
      if (GEMINI_API_KEY && data.text) {
        try {
          const geminiRes = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `This text was extracted from a document. Was it likely written on a certificate or official paper? Search the web and check if something like this exists and whether it's genuine or not.\n\nText: ${data.text}`
                  }]
                }]
              })
            }
          );
          const geminiJson = await geminiRes.json();
          const geminiText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text || "No answer from Gemini.";
          setGeminiResult(geminiText);
        } catch (err) {
          setGeminiResult("Gemini API error or no response.");
        }
      }
    } catch (err) {
      toast({
        title: "OCR Failed",
        description: "Could not extract text from the certificate.",
        variant: "destructive"
      });
    }
    setIsVerifying(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "invalid":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-success text-success-foreground">Valid Certificate</Badge>;
      case "invalid":
        return <Badge variant="destructive">Invalid/Forged Certificate</Badge>;
      default:
        return <Badge variant="secondary">Under Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verify Certificate</h1>
        <p className="text-muted-foreground mt-2">
          Upload a certificate to verify its authenticity using our OCR and database matching system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Certificate
            </CardTitle>
            <CardDescription>
              Support for PDF, JPG, PNG files up to 10MB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificate">Certificate File</Label>
              <Input
                id="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            
            {selectedFile && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            )}

            <Button 
              onClick={handleVerification}
              disabled={!selectedFile || isVerifying}
              className="w-full gap-2"
            >
              {isVerifying ? (
                <>
                  <Scan className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4" />
                  Start Verification
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Verification Results
            </CardTitle>
            <CardDescription>
              OCR extraction and database matching results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!verificationResult ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No verification results yet</p>
                <p className="text-sm">Upload and verify a certificate to see results</p>
              </div>
            ) : verificationResult.status === "error" ? (
              <div className="text-center py-8 text-destructive">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">{verificationResult.message}</p>
                {ocrText && (
                  <div className="mt-4 bg-muted p-4 rounded text-sm whitespace-pre-wrap max-h-64 overflow-auto">
                    <span className="font-bold">Extracted Text:</span>
                    <br />
                    {ocrText}
                  </div>
                )}
                {geminiResult && (
                  <div className="mt-4 bg-blue-50 p-4 rounded text-sm whitespace-pre-wrap max-h-64 overflow-auto border border-blue-200">
                    <span className="font-bold">Gemini Web Check:</span>
                    <br />
                    {geminiResult}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {verificationResult.status === "valid" ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium">Verification Result</span>
                </div>
                <Separator />
                <div className="bg-muted p-4 rounded text-sm whitespace-pre-wrap max-h-64 overflow-auto">
                  <span className="font-bold">Extracted Text:</span>
                  <br />
                  {ocrText}
                </div>
                <Separator />
                <div className="text-sm">
                  <span className="font-bold">Status:</span> {verificationResult.status}
                  <br />
                  <span className="font-bold">Message:</span> {verificationResult.message}
                  {verificationResult.details && (
                    <>
                      <br />
                      <span className="font-bold">Details:</span> {JSON.stringify(verificationResult.details, null, 2)}
                    </>
                  )}
                  {typeof verificationResult.authorized !== 'undefined' && (
                    <>
                      <br />
                      <span className="font-bold">Authorized by Govt/Official:</span> {verificationResult.authorized ? 'Yes' : 'No'}
                    </>
                  )}
                </div>
                {geminiResult && (
                  <div className="mt-4 bg-blue-50 p-4 rounded text-sm whitespace-pre-wrap max-h-64 overflow-auto border border-blue-200">
                    <span className="font-bold">Gemini Web Check:</span>
                    <br />
                    {geminiResult}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyCertificate;