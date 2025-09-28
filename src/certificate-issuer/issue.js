const QRCode = require('qrcode');
const crypto = require('crypto');
const fs = require('fs');

// Example: Issue a certificate with digital signature and QR code


// Helper: parse fields from OCR text (same as backend)
function parseCertificateFields(text) {
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

// Accepts a raw text input and image path, extracts fields, and issues certificate
async function issueCertificate({
  rawText,
  imagePath
}) {
  // Extract fields from text
  const certData = parseCertificateFields(rawText);
  certData.imagePath = imagePath ? imagePath : null;

  // Generate a digital signature (hash)
  const certString = JSON.stringify(certData);
  const signature = crypto.createHash('sha256').update(certString).digest('hex');

  // Use certificateId or rollNo for file naming, fallback to timestamp
  const fileId = certData.certificateId || certData.rollNo || Date.now();
  const qrData = JSON.stringify({ ...certData, signature });
  const qrPath = `qr_${fileId}.png`;
  await QRCode.toFile(qrPath, qrData);

  // Save certificate data and signature
  const certRecord = { ...certData, signature };
  fs.writeFileSync(`cert_${fileId}.json`, JSON.stringify(certRecord, null, 2));

  return { certRecord, qrPath };
}

// Example usage (remove in production, use via API or admin panel)


// Example usage (remove in production, use via API or admin panel)
(async () => {
  // Simulate extracted OCR text (should match the format expected by parseCertificateFields)
  const rawText = `Name: Alice Example\nRoll No: 2025CSE001\nCertificate ID: CERT2025A001\nInstitution: Sample University\nCourse: Computer Science\nMarks: 91%\nIssue Date: 2025-09-29`;
  const imagePath = 'sample_certificate_image.jpg'; // Change to your uploaded image filename
  const result = await issueCertificate({
    rawText,
    imagePath
  });
  console.log('Certificate issued:', result);
})();

module.exports = { issueCertificate };
