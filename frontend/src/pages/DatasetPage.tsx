import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useListingContract from "../hooks/useListingContract";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import usePromptTemplate from "../hooks/usePromptTemplate";
import useCsvData from "../hooks/useCsvData";
import { useDatasetDescription } from "../hooks/useDatasetDescription";
import { Listing } from "../types/listing";
import toast from "react-hot-toast";
import DatasetDescription from "../components/DatasetDescription";
import AskAISection from "../components/AskAISection";
import DatasetPreview from "../components/DatasetPreview";
import BuyDatasetSection from "../components/BuyDatasetSection";
import DatasetTitle from "../components/DatasetTitle";

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

  return (
    <div>
      <div className="w-full flex justify-center bg-background drop-shadow-2xl">
        <Header />
      </div>
      <div className="min-h-screen bg-background text-primary_text p-8">
        <div className="bg-background p-8 max-w-6xl mx-auto">
          <DatasetTitle
            datasetId={dataset.id}
            creationTime={dataset.creationTime}
            tags={dataset.tags}
          />
          <DatasetDescription
            description={generatedDescription}
            loading={descriptionLoading}
          />
          <DatasetPreview csvData={csvData} loading={csvLoading} />
          <AskAISection csvData={csvData} />
          <BuyDatasetSection
            dataset={dataset}
          />
        </div>
      </div>
    </div>
  );
};

export default DatasetPage;
