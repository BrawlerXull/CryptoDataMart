import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import Header from "../components/Header";

const Community = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loadingFirstTime, setLoadingFirstTime] = useState(true);

    useEffect(() => {
        setLoadingFirstTime(false);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    if (loadingFirstTime) {
        return <Spinner />;
    }

    return (
        <>
            <div className="w-full flex justify-center bg-background drop-shadow-2xl">
                <Header />
            </div>
            <div className="min-h-screen bg-background text-primary_text p-4 flex flex-col items-center">
                <div className="w-full bg-background p-4 rounded-lg shadow-lg">
                    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                        <h1 className="text-3xl font-bold mb-4 lg:mb-0">Community</h1>
                        <form
                            onSubmit={handleSubmit} 
                            className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 w-full lg:w-auto"
                        >
                            <input
                                type="text"
                                className="input input-bordered w-full lg:w-auto"
                                placeholder="Search users"
                                value={search}
                                onChange={handleSearch} 
                            />
                        </form>
                    </header>

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
        </>
    );
};

export default Community;