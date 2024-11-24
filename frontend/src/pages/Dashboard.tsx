import React, { useEffect, useState } from "react";
import { FaPlus, FaPaperPlane, FaHeart } from "react-icons/fa";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import useListingContract from "../hooks/useListingContract";
import { Listing } from "../types/listing";

const DashboardPage = () => {
  const [sortMethod, setSortMethod] = useState("recent");
  const [page, setPage] = useState(1);
  const [loadingFirstTime, setLoadingFirstTime] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const { listingData } = useListingContract();

  const listingsPerPage = 10;

  const filteredListings = listingData.filter((listing) => {
    if (tags.length === 0) return true; 
    return tags.every(tag =>
      listing.tags.some(listingTag => listingTag.toLowerCase().includes(tag.toLowerCase()))
    );
  });

  const sortedListings = filteredListings.sort((a, b) => {
    switch (sortMethod) {
      case "recent":
        return b.creationTime - a.creationTime;
      case "oldest":
        return a.creationTime - b.creationTime;
      case "popularity":
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  const formatCreationTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); 
  
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, 
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  

  const startIdx = (page - 1) * listingsPerPage;
  const endIdx = page * listingsPerPage;
  const paginatedListings = sortedListings.slice(startIdx, endIdx);

  const totalPages = Math.ceil(sortedListings.length / listingsPerPage);

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
          <section className="space-y-8 mt-8">
            {paginatedListings.map((listing: Listing, index: number) => (
              <div
                key={index}
                className="bg-background p-4 rounded-lg shadow-xl border border-secondary/80"
              >
                <Link to={`/dashboard/dataset/${listing.id}`}>
                  <h3 className="font-bold text-lg text-primary_text line-clamp-1 hover:underline">
                    Title Placeholder: {`Dataset #${listing.id + 1}`}
                  </h3>
                </Link>

                <div className="mb-2">
                  <p className="text-primary/80">Price: {listing.price.toString()} Wei</p>
                  <p className="text-primary/80">Rent per Hour: {listing.rentPricePerHour.toString()} Wei/hr</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-secondary_text mt-4">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <p className="text-secondary_text text-sm">Creator: {listing.creator}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="flex items-center mr-4">
                      <FaHeart className="mr-2" /> {listing.likes}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center">
                    <h4 className="text-lg font-semibold text-primary_text mr-5">Tags</h4>
                    {listing.tags.length > 0 ? (
                      <div className="flex flex-wrap mt-2">
                        {listing.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary_text/70 px-2 py-1 rounded-sm mr-2 text-base"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-primary/60">No tags available for this dataset.</p>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-primary/80">
                    <p>
                      {formatCreationTime(listing.creationTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>


          <div className="flex justify-center mt-8 items-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 mx-1 bg-primary text-primary_text rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <h2 className="mx-5">Page {page} of {totalPages}</h2>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
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
