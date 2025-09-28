import { useState } from "react";
import QRCode from "react-qr-code";

export default function BlockchainCertificatePage() {
  const [rawText, setRawText] = useState("");
  const [qrData, setQrData] = useState("");
  const [fields, setFields] = useState<any>(null);

  // Extraction logic (same as backend)
  function parseCertificateFields(text: string) {
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

  function handleGenerate() {
    const extracted = parseCertificateFields(rawText);
    setFields(extracted);
    setQrData(JSON.stringify(extracted));
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Blockchain Certificate QR Generator</h1>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={8}
        placeholder="Paste extracted certificate text here..."
        value={rawText}
        onChange={e => setRawText(e.target.value)}
      />
      <button
        className="bg-primary text-white px-4 py-2 rounded"
        onClick={handleGenerate}
        disabled={!rawText.trim()}
      >
        Generate QR
      </button>
      {qrData && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <QRCode value={qrData} size={256} />
          <div className="bg-muted p-4 rounded w-full">
            <pre className="text-xs whitespace-pre-wrap">{qrData}</pre>
          </div>
        </div>
      )}
      {fields && (
        <div className="mt-4 text-sm">
          <div><b>Name:</b> {fields.name}</div>
          <div><b>Roll No:</b> {fields.rollNo}</div>
          <div><b>Certificate ID:</b> {fields.certificateId}</div>
          <div><b>Institution:</b> {fields.institution}</div>
          <div><b>Course:</b> {fields.course}</div>
          <div><b>Marks:</b> {fields.marks}</div>
        </div>
      )}
    </div>
  );
}
