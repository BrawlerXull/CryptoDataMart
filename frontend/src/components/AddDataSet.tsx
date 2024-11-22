import { useRef, useState } from "react";
import Header from "./Header";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddDatasetPage = () => {
    const [title, setTitle] = useState("");
    const [description, setdescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [fileName, setFileName] = useState<string>("");
    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    const descriptionTextareaRef = useRef(null);
    const navigate = useNavigate();

    const adjustTextareaHeight = (event: React.FormEvent<HTMLTextAreaElement>): void => {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
            setFileUploaded(true);
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
                    <form className="space-y-4">
                        <div>
                            <label
                                className="block text-primary_text font-bold mb-2"
                                htmlFor="title"
                            >
                                Title
                            </label>
                            <input
                                autoFocus
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="Write the title of dataset here."
                                required
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    className="block text-primary_text font-bold"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                            </div>
                            <textarea
                                id="description"
                                ref={descriptionTextareaRef}
                                value={description}
                                onChange={(e) => setdescription(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm"
                                rows={10}
                                onInput={adjustTextareaHeight}
                                placeholder="Write your description here."
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="block text-primary_text font-bold mb-2"
                                htmlFor="file-upload"
                            >
                                Dataset File
                            </label>

                            {!fileUploaded && (
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

                            {fileUploaded && (
                                <div className="mt-4 text-green-500 font-semibold">
                                    File "{fileName}" uploaded successfully!
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                className="block text-primary_text font-bold mb-2"
                                htmlFor="tags"
                            >
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary/10 text-primary_text/70 px-2 py-1 rounded-full flex items-center"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            className="ml-2 text-primary hover:text-tertiary"
                                            onClick={() => handleTagRemove(index)}
                                        >
                                            &times;
                                        </button>
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


                        <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="bg-primary text-primary_text hover:bg-border hover:text-primary px-4 py-2 rounded-lg"
                                >
                                    Upload Dataset
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
