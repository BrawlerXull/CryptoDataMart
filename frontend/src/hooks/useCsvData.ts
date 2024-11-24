import { useEffect, useState } from 'react';
import Papa from 'papaparse';

const useCsvData = (previewIpfsLink: string | null) => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  console.log("preview link" ,previewIpfsLink)

  useEffect(() => {
    if (previewIpfsLink) {
      const fetchCsvData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${previewIpfsLink}`);
          if (!response.ok) {
            throw new Error('Failed to fetch CSV data');
          }
          const text = await response.text();
          const parsedData = Papa.parse(text, { header: true });
          setCsvData(parsedData.data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchCsvData();
    }
  }, [previewIpfsLink]);

  return { csvData, loading, error };
};

export default useCsvData;
