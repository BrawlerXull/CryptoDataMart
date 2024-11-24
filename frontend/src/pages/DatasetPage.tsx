import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useListingContract from "../hooks/useListingContract";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import usePromptTemplate from "../hooks/usePromptTemplate";
import useCsvData from "../hooks/useCsvData";
import { useDatasetDescription } from "../hooks/useDatasetDescription";
import { Listing } from "../types/listing";
import { formatCreationTime } from "../utils/helphers";
import toast from "react-hot-toast";

const DatasetPage = () => {
  const { id } = useParams();
  const { listingData } = useListingContract();
  const {
    promptTemplate,
    loading: promptLoading,
    error: promptError,
  } = usePromptTemplate();
  const [dataset, setDataset] = useState<Listing | null>(null);
  const {
    csvData,
    loading: csvLoading,
    error: csvError,
  } = useCsvData(dataset?.previewIpfsLink || "");  

  const { generatedDescription, descriptionLoading } = useDatasetDescription(
    dataset?.id || 0,
    promptTemplate || "",
    csvData
  );

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      const foundDataset = listingData.find(
        (listing) => listing.id === numericId
      );
      setDataset(foundDataset || null);
    }
  }, [id, listingData]);

  useEffect(() => {
    if (csvError) {
      toast.error(`Error loading CSV data: ${csvError || "Unknown error"}`);
    }
  }, [csvError]);

  if (promptLoading || descriptionLoading || csvLoading) {
    return (
      <div>
        <Header />
        <Spinner />
      </div>
    );
  }

  if (promptError) {
    return (
      <div>Error loading prompt template: {promptError || "Unknown error"}</div>
    );
  }

  if (!dataset) {
    return <div>Dataset not found.</div>;
  }

  const formatDescription = (description: string) => {
    const sentences = description.split(".").map((sentence) => sentence.trim()).filter(Boolean);
    return (
      <ul className="list-disc pl-5">
        {sentences.map((sentence, index) => (
          <li key={index}>{sentence}.</li> 
        ))}
      </ul>
    );
  };

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
            <div className="text-lg text-primary/80">
              <p>{formatCreationTime(dataset.creationTime)}</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-primary_text">
              Description
            </h4>
            {descriptionLoading ? (
              <Spinner />
            ) : (
              <div className="text-lg mt-2">
                {generatedDescription ? formatDescription(generatedDescription) : "No description available for this dataset."}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-primary_text">
              Preview
            </h4>
            {csvLoading ? (
              <Spinner />
            ) : csvData.length > 0 ? (
              <div className="mt-4 overflow-x-auto max-h-[500px] border-2 rounded-sm border-primary/20">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-primary/10">
                      {Object.keys(csvData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.map((row, index) => (
                      <tr key={index} className="border-b">
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} className="px-4 py-2">
                            {String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-primary/60">
                No preview available for this dataset.
              </p>
            )}
          </div>

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
              <p className="text-primary/60">
                No tags available for this dataset.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetPage;
