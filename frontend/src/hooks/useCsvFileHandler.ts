import { useState } from "react";
import Papa from "papaparse"; 
import axios from "axios";

export const useCsvFileHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [previewCsv, setPreviewCsv] = useState<string | null>(null);
  const [fullCsv, setFullCsv] = useState<string | null>(null);

  const parseCsvFile = (file: File) => {
    setError(null);
    setPreviewCsv(null);
    setFullCsv(null);

    Papa.parse(file, {
      complete: (result) => {
        const rows = result.data;
        const previewRows = rows.slice(0, 15);
        const fullCsvString = Papa.unparse(rows);
        const previewCsvString = Papa.unparse(previewRows);

        setFullCsv(fullCsvString); 
        setPreviewCsv(previewCsvString); 
      },
      error: (err) => {
        setError(`Error parsing CSV file: ${err.message}`);
      },
      header: true, 
    });
  };

  const uploadToIpfs = async (file: File, _isPreview: boolean = false) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const apiUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
      const headers = {
        "pinata_api_key": import.meta.env.VITE_PINATA_API_KEY,
        "pinata_secret_api_key": import.meta.env.VITE_PINATA_API_SECRET,
      };

      const response = await axios.post(apiUrl, formData, { headers });
      const ipfsHash = response.data.IpfsHash;

      console.log("File uploaded to IPFS with hash:", ipfsHash);
      return ipfsHash;
    } catch (err) {
      console.error("Error uploading file to IPFS:", err);
      throw new Error("Error uploading to IPFS");
    }
  };

  return {
    error,
    previewCsv,
    fullCsv,
    parseCsvFile,
    uploadToIpfs,
  };
};
