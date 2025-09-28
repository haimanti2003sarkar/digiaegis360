import { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

export default function InstitutionUploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<string>("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setCsvFile(file || null);
    setRecords([]);
    setResult("");
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => setRecords(res.data as any[])
      });
    }
  }

  async function handleUpload() {
    if (!records.length) return;
    setUploading(true);
    setResult("");
    try {
      // Replace with your backend endpoint for bulk upload
      const resp = await axios.post("http://localhost:5001/bulk-upload-certificates", { records });
      setResult(resp.data.message || "Upload successful");
    } catch (err: any) {
      setResult("Upload failed: " + (err.response?.data?.message || err.message));
    }
    setUploading(false);
  }

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Institution Certificate Bulk Upload</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2"
      />
      {records.length > 0 && (
        <div className="bg-muted p-4 rounded mb-2 max-h-64 overflow-auto text-xs">
          <b>Preview ({records.length} records):</b>
          <pre>{JSON.stringify(records.slice(0, 5), null, 2)}{records.length > 5 ? "\n..." : ""}</pre>
        </div>
      )}
      <button
        className="bg-primary text-white px-4 py-2 rounded"
        onClick={handleUpload}
        disabled={!records.length || uploading}
      >
        {uploading ? "Uploading..." : "Upload to System"}
      </button>
      {result && <div className="mt-4 text-sm">{result}</div>}
    </div>
  );
}
