import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useListingContract from "../hooks/useListingContract";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import Papa from "papaparse";
import { Listing } from "../types/listing";

const DatasetPage = () => {
  const { id } = useParams();
  const { listingData } = useListingContract();

  const [loading, setLoading] = useState<boolean>(true);
  const [dataset, setDataset] = useState<Listing | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      const foundDataset = listingData.find((listing) => listing.id === numericId);
      if (foundDataset) {
        setDataset(foundDataset);
      }
      setLoading(false);
    }
  }, [id, listingData]);

  useEffect(() => {
    if (dataset && dataset.previewIpfsLink) {
      const fetchCsvData = async () => {
        try {
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${dataset.previewIpfsLink}`);
          const text = await response.text();
          
          const parsedData = Papa.parse(text, { header: true });
          setCsvData(parsedData.data);
        } catch (error) {
          console.error("Error fetching CSV file:", error);
        }
      };
      fetchCsvData();
    }
  }, [dataset]);

  if (loading) {
    return <Spinner />;
  }

  if (!dataset) {
    return <div>Dataset not found.</div>;
  }

  return (
    <div>
      <div className="w-full flex justify-center bg-background drop-shadow-2xl">
        <Header />
      </div>
      <div className="min-h-screen bg-background text-primary_text p-8">
        <div className="bg-background p-8 max-w-6xl mx-auto">
          <div className="flex justify-between">
            <h1 className="text-4xl font-extrabold text-primary_text mb-4">
              {`Dataset #${dataset.id + 1}`}
            </h1>

            {/* Created on Date */}
            <div className="text-lg text-primary/80">
              <p>{formatCreationTime(dataset.creationTime)}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-primary_text">Description</h4>
            <p className="text-primary/80 text-lg mt-2">{'No description available for this dataset.'}</p>
          </div>

          {/* Preview Section - CSV Table */}
          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-primary_text">Preview</h4>
            {csvData.length > 0 ? (
              <div className="mt-4 overflow-x-auto max-h-[500px]">  {/* Set a max height here */}
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-primary/10">
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} className="px-4 py-2">{String(value)}</td>  
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-primary/60">No preview available for this dataset.</p>
            )}
          </div>

          {/* Tags Section */}
          <div className="mt-6">
            <h4 className="text-2xl font-semibold text-primary_text">Tags</h4>
            {dataset.tags.length > 0 ? (
              <div className="flex flex-wrap mt-2">
                {dataset.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary_text/70 px-3 py-1 rounded-lg mr-3 mb-3 text-base"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-primary/60">No tags available for this dataset.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper function to format creation timestamp
const formatCreationTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

export default DatasetPage;
