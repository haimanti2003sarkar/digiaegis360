const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));


// Sample in-memory database of valid certificates
const validCertificates = [
  {
    certificateId: 'CERT001234',
    name: 'John Doe',
    rollNo: '2020CSE123',
    institution: 'ABC University',
    course: 'Computer Science Engineering',
    marks: '85%'
  },
  {
    certificateId: 'CERT005678',
    name: 'Jane Smith',
    rollNo: '2019ECE456',
    institution: 'XYZ College',
    course: 'Electronics Engineering',
    marks: '78%'
  }
];

// In-memory storage for institutions and blacklisted certificates
let institutions = [];
let blacklistedCertificates = [];


// GET endpoints for admin dashboard
app.get('/institutions', (req, res) => {
  res.json(institutions);
});
app.get('/blacklisted-certificates', (req, res) => {
  res.json(blacklistedCertificates);
});

// POST endpoints for admin dashboard
app.post('/institutions', (req, res) => {
  const inst = req.body;
  inst.id = 'INST' + (institutions.length + 1).toString().padStart(3, '0');
  // Provide default values if not present
  inst.certificatesIssued = inst.certificatesIssued ?? 0;
  inst.verificationRate = inst.verificationRate ?? 100;
  institutions.push(inst);
  res.json({ message: 'Institution added', institution: inst });
});
app.post('/blacklisted-certificates', (req, res) => {
  const cert = req.body;
  cert.id = 'BL' + (blacklistedCertificates.length + 1).toString().padStart(3, '0');
  blacklistedCertificates.push(cert);
  res.json({ message: 'Blacklisted certificate added', certificate: cert });
});

// Helper: parse fields from OCR text (very basic, for demo)
function parseCertificateFields(text) {
  // Try to extract fields using regex or simple string search
  const nameMatch = text.match(/Name[:\s]+([A-Za-z ]+)/i);
  const rollNoMatch = text.match(/Roll[\s-]?No[:\s]+([A-Za-z0-9]+)/i);
  const certIdMatch = text.match(/Certificate[\s-]?ID[:\s]+([A-Za-z0-9]+)/i);
  const institutionMatch = text.match(/Institution[:\s]+([A-Za-z ]+)/i);
  const courseMatch = text.match(/Course[:\s]+([A-Za-z ]+)/i);
  const marksMatch = text.match(/Marks[:\s]+([0-9]+%)/i);

  return {
    name: nameMatch ? nameMatch[1].trim() : undefined,
    rollNo: rollNoMatch ? rollNoMatch[1].trim() : undefined,
    certificateId: certIdMatch ? certIdMatch[1].trim() : undefined,
    institution: institutionMatch ? institutionMatch[1].trim() : undefined,
    course: courseMatch ? courseMatch[1].trim() : undefined,
    marks: marksMatch ? marksMatch[1].trim() : undefined
  };
}

app.post('/verify-certificate', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ status: 'error', message: 'No text provided.' });
  }
  // Check for government/official authorization (robust)
  const lowerText = text.toLowerCase();
  let authorized = false;
  let authMessage = '';
  const govKeywords = [
    'govt', 'government', 'official', 'ministry', 'department', 'public sector', 'municipal', 'state', 'central', 'authority', 'board', 'commission'
  ];
  for (const keyword of govKeywords) {
    if (lowerText.includes(keyword)) {
      authorized = true;
      break;
    }
  }
  if (authorized) {
    authMessage = 'This document is authorized by a government or official body.';
  }
  const extracted = parseCertificateFields(text);
  // Check if all required fields are present
  if (!extracted.certificateId || !extracted.name || !extracted.rollNo) {
    return res.status(200).json({
      status: 'invalid',
      authorized,
      message: (authorized ? authMessage + ' ' : '') + 'Could not extract all required fields from certificate.',
      details: extracted
    });
  }
  // Check against valid certificates
  const match = validCertificates.find(
    cert =>
      cert.certificateId === extracted.certificateId &&
      cert.name.toLowerCase() === extracted.name.toLowerCase() &&
      cert.rollNo === extracted.rollNo
  );
  if (match) {
    return res.status(200).json({
      status: 'valid',
      authorized,
      message: (authorized ? authMessage + ' ' : '') + 'Certificate is genuine and matches database records.',
      details: match
    });
  } else {
    return res.status(200).json({
      status: 'invalid',
      authorized,
      message: (authorized ? authMessage + ' ' : '') + 'Certificate does not match any records in the database.',
      details: extracted
    });
  }
});

app.listen(PORT, () => {
  console.log(`Certificate verification backend running on port ${PORT}`);
});
