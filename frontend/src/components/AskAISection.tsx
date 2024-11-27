import React, { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown'; 
import useGeminiQuery from '../hooks/useGeminiQuery';

interface AskAISectionProps {
  csvData: any[];
}

const AskAISection: React.FC<AskAISectionProps> = ({ csvData }) => {
  const { response, loading: queryLoading, askQuery } = useGeminiQuery();
  const [userQuery, setUserQuery] = useState<string>('');
  const [, setIsQuerySubmitted] = useState<boolean>(false);
  const [responses, setResponses] = useState<string[]>([]);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) {
      toast.error('Please enter a valid query.');
      return;
    }
    setIsQuerySubmitted(true);
    askQuery(userQuery, csvData);
    setUserQuery('');
  };

  useEffect(() => {
    if (response) {
      setResponses((prevResponses) => [...prevResponses, response]);
    }
  }, [response]);

  return (
    <div className="mt-6">
      <div className="flex items-center">
        <h4 className="text-2xl font-semibold text-primary_text">Ask AI</h4>
        <FaRobot className="w-10" />
      </div>

      <div className="mt-4 space-y-4">
        {responses.map((resp, index) => (
          <div
            key={index}
            className="p-4 mb-4 border rounded-lg bg-background text-primary_text shadow-lg"
          >
            <h5 className="font-semibold text-xl">AI Response {index + 1}:</h5>
            <ReactMarkdown className="prose dark:prose-invert">{resp}</ReactMarkdown>
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
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          placeholder="Write your query about the dataset here."
          required
        />
        <button
          type="submit"
          className="mt-2 p-3 bg-primary text-white rounded-lg min-w-20 hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {queryLoading ? 'Asking...' : 'Ask'}
        </button>
      </form>
    </div>
  );
};

export default AskAISection;
