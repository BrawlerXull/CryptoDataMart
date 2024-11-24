import { useState, useEffect } from "react";
import Header from "../components/Header";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCsvFileHandler } from "../hooks/useCsvFileHandler";
import useListingContract from "../hooks/useListingContract";
import useGeminiQuery from "../hooks/useGeminiQuery";

const AddDatasetPage = () => {
  const [price, setPrice] = useState(0);
  const [rent, setRent] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [createListingError, setCreateListingError] = useState<string | null>(null);
  const [previewCid, setPreviewCid] = useState("");
  const [fullCid, setFullCid] = useState("");

  const navigate = useNavigate();

  const {
    previewCsv,
    fullCsv,
    parseCsvFile,
    uploadToIpfs,
  } = useCsvFileHandler();

  const { createNewListing } = useListingContract();

  const { askQuery, response } = useGeminiQuery();

  const handleAddTag = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e instanceof KeyboardEvent && e.key === "Enter") {
      e.preventDefault();
    }
    if (
      newTag.trim() &&
      !tags
        .map((tag) => tag.toLowerCase())
        .includes(newTag.trim().toLowerCase())
    ) {
      setTags((prevTags) => [...prevTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleTagRemove = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileUploaded(false);
      setIsUploading(true); 
      parseCsvFile(file);
    }
  };

  useEffect(() => {
    if (previewCsv && fullCsv) {
      console.log(fullCsv);
      console.log(previewCsv);

      try {
        const previewFile = new File([previewCsv], "preview.csv", { type: "text/csv" });
        const fullFile = new File([fullCsv], "full.csv", { type: "text/csv" });

        uploadToIpfs(previewFile, true).then((cidPreview) => {
          console.log("Preview CID:", previewCid);
          setPreviewCid(cidPreview);

          uploadToIpfs(fullFile, false).then((cidFull) => {
            console.log("Full Dataset CID:", fullCid);
            setFullCid(cidFull);
            setFileUploaded(true);
            setIsUploading(false);

            
            generateTagsFromDataset(previewCsv);
          });
        });
      } catch (err) {
        console.error("Error uploading CSVs to IPFS:", err);
        setIsUploading(false); 
      }
    }
  }, [previewCsv, fullCsv]);

  const generateTagsFromDataset = async (csvData: string) => {
    try {
      const prompt = await fetch("/tags_prompt.txt").then((res) => res.text());
      const query = prompt + "\n\n" + "Here is the dataset preview in CSV format:\n" + csvData;

      
      await askQuery(query, []);
    } catch (error) {
      console.error("Error generating tags:", error);
    }
  };

  
  useEffect(() => {
    if (response) {
      const newTags = response.split("\n").filter((line) => line.trim().length > 0);

      setTags((prevTags) => [...prevTags, ...newTags]);
    }
  }, [response]);

  const createListing = async () => {
    setIsCreatingListing(true);
    setCreateListingError(null);

    try {
      await createNewListing(previewCid, fullCid, price, rent, tags);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      setCreateListingError("Failed to create the listing. Please try again.");
    } finally {
      setIsCreatingListing(false);
    }
  };

  return (
    <>
      <div className="w-full flex justify-center bg-background drop-shadow-2xl">
        <Header />
      </div>
      <div className="min-h-screen bg-background text-primary_text p-4 flex flex-col items-center">
        <div className="w-full lg:w-2/3 bg-background p-4 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Add New Dataset</h1>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                className="block text-primary_text font-bold mb-2"
                htmlFor="file-upload"
              >
                Dataset File
              </label>

              {!fileUploaded && !isUploading && (
                <div className="flex items-center justify-center w-full border rounded-lg flex-grow">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">CSV (MAX. 1 MB)</p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}

              {isUploading && (
                <div className="mt-4 text-yellow-500 font-semibold">
                  <span>Uploading file...</span>
                  <div className="animate-spin mx-auto my-4 w-8 h-8 border-4 border-t-4 border-primary rounded-full"></div>
                </div>
              )}

              {fileUploaded && !isUploading && (
                <div className="mt-4 text-green-500 font-semibold">
                  File "{fileName}" uploaded successfully!
                </div>
              )}
            </div>

            {/* Price, Rent and Tags sections remain the same */}
            <div>
              <label className="block text-primary_text font-bold mb-2" htmlFor="price">Price</label>
              <input
                autoFocus
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.valueAsNumber)}
                className="w-full p-2 border rounded-lg"
                placeholder="Write the price of dataset here."
                required
              />
            </div>

            <div>
              <label className="block text-primary_text font-bold mb-2" htmlFor="rent">Rent (Wei / hr)</label>
              <input
                autoFocus
                id="rent"
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.valueAsNumber)}
                className="w-full p-2 border rounded-lg"
                placeholder="Write the rent of dataset here."
                required
              />
            </div>

            <div>
              <label className="block text-primary_text font-bold mb-2" htmlFor="tags">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-primary/10 text-primary_text/70 px-2 py-1 rounded-full flex items-center">
                    {tag}
                    <button type="button" className="ml-2 text-primary hover:text-tertiary" onClick={() => handleTagRemove(index)}>&times;</button>
                  </span>
                ))}
                <div className="flex-grow items-center">
                  <input
                    id="tags"
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-10/12 p-2 border rounded-lg flex-grow"
                    placeholder="Type and press enter to add tags"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="ml-2 p-2 rounded-lg bg-primary text-primary_text hover:bg-border hover:text-primary"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>

            {createListingError && (
              <div className="text-red-500 mt-2">
                {createListingError}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => createListing()}
                  className="bg-primary text-primary_text hover:bg-border hover:text-primary px-4 py-2 rounded-lg"
                  disabled={isCreatingListing}
                >
                  {isCreatingListing ? "Creating..." : "Upload Dataset"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="bg-primary/10 text-primary_text hover:bg-border hover:text-primary px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddDatasetPage;
