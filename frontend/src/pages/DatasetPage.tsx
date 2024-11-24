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
import { FaRobot } from "react-icons/fa";
import useGeminiQuery from "../hooks/useGeminiQuery";

const DatasetPage = () => {
  const { id } = useParams();
  const { listingData } = useListingContract();
  const { promptTemplate, loading: promptLoading, error: promptError } = usePromptTemplate();
  const [dataset, setDataset] = useState<Listing | null>(null);
  const { csvData, loading: csvLoading, error: csvError } = useCsvData(dataset?.previewIpfsLink || "");
  const { generatedDescription, descriptionLoading } = useDatasetDescription(dataset?.id || 0, promptTemplate || "", csvData);

  
  const { response, loading: queryLoading, askQuery } = useGeminiQuery();
  const [userQuery, setUserQuery] = useState<string>("");
  const [, setIsQuerySubmitted] = useState<boolean>(false);
  const [responses, setResponses] = useState<string[]>([]);  

  useEffect(() => {
    if (id) {
      const numericId = parseInt(id, 10);
      const foundDataset = listingData.find((listing) => listing.id === numericId);
      setDataset(foundDataset || null);
    }
  }, [id, listingData]);

  useEffect(() => {
    if (csvError) {
      toast.error(`Error loading CSV data: ${csvError || "Unknown error"}`);
    }
  }, [csvError]);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) {
      toast.error("Please enter a valid query.");
      return;
    }
    setIsQuerySubmitted(true);
    askQuery(userQuery, csvData);  
    setUserQuery(""); 
  };

  
  useEffect(() => {
    if (response) {
      setResponses((prevResponses) => [...prevResponses, response]);  
    }
  }, [response]);

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

  if (promptLoading || descriptionLoading || csvLoading) {
    return (
      <div>
        <Header />
        <Spinner />
      </div>
    );
  }

  if (promptError) {
    return <div>Error loading prompt template: {promptError || "Unknown error"}</div>;
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
            <h1 className="text-4xl font-extrabold text-primary_text mb-4">{`Dataset #${dataset.id + 1}`}</h1>
            <div className="text-lg text-primary/80">
              <p>{formatCreationTime(dataset.creationTime)}</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-primary_text">Description</h4>
            {descriptionLoading ? (
              <Spinner />
            ) : (
              <div className="text-lg mt-2">
                {generatedDescription ? formatDescription(generatedDescription) : "No description available for this dataset."}
              </div>
            )}
          </div>

          <div className="mt-8">
            <h4 className="text-2xl font-semibold text-primary_text">Preview</h4>
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
              <p className="text-primary/60">No preview available for this dataset.</p>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <h4 className="text-2xl font-semibold text-primary_text">Ask AI</h4>
              <FaRobot className="w-10" />
            </div>

            <div className="mt-4">
              {responses.map((resp, index) => (
                <div key={index} className="p-4 mb-2 border rounded-lg bg-background text-primary_text">
                  <h5 className="font-semibold">AI Response {index + 1}:</h5>
                  <p>{resp}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleQuerySubmit} className="mt-4">
              <input
                autoFocus
                id="askAI"
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Write your query about the dataset here."
                required
              />
              <button type="submit" className="mt-2 p-2 bg-primary text-white rounded-lg">
                {queryLoading ? "Asking..." : "Ask"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetPage;
