import React, { useEffect, useState } from "react";
import { FaPlus, FaPaperPlane } from "react-icons/fa";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";

const DashboardPage = () => {
  const [sortMethod, setSortMethod] = useState("recent");
  const [page, setPage] = useState(1);
  const [loadingFirstTime, setLoadingFirstTime] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setLoadingFirstTime(false);
  }, []);

  
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
    setTags((prevTags) => prevTags.filter((_, i) => i !== index)); 
  };

  if (loadingFirstTime) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="w-full flex justify-center bg-background drop-shadow-2xl">
        <Header />
      </div>
      <div className="min-h-screen bg-background text-primary_text p-4 flex flex-col items-start">
        <div className="w-full bg-background p-4 rounded-lg shadow-lg">
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 lg:mb-0">All Dataset</h1>
            <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <select
                className="select select-bordered w-full lg:w-auto"
                value={sortMethod}
                onChange={(e) => setSortMethod(e.target.value)}
              >
                <option value="recent">Recent</option>
                <option value="oldest">Oldest</option>
                <option value="popularity">Popularity</option>
                <option value="views">Most Viewed</option>
              </select>
              <div className="flex items-center">
                <input
                  id="tags"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="input input-bordered w-full lg:w-auto p-2"
                  placeholder="Search tags"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-3 p-3 rounded-lg bg-primary text-primary_text hover:bg-border hover:text-primary"
                >
                  <FaPaperPlane />
                </button>
              </div>

              <Link to="add-dataset">
                <button className="bg-primary text-primary_text hover:bg-border hover:text-primary px-4 py-2 rounded-lg flex items-center">
                  <FaPlus className="mr-2" /> Add Dataset
                </button>
              </Link>
            </div>
          </header>
          <div className="flex flex-wrap mt-4 lg:mt-0">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary_text/70 px-2 py-1 rounded-full mr-2 mb-2 text-base"
              >
                {tag}
                <button
                  onClick={() => handleTagRemove(index)}
                  className="ml-1 text-primary hover:text-tertiary"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 mx-1 bg-primary text-primary_text rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 mx-1 bg-primary text-primary_text rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
