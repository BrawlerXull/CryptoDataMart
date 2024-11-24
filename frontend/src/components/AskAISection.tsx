import React, { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import toast from 'react-hot-toast';
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

      <div className="mt-4">
        {responses.map((resp, index) => (
          <div
            key={index}
            className="p-4 mb-2 border rounded-lg bg-background text-primary_text"
          >
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
        <button
          type="submit"
          className="mt-2 p-2 bg-primary text-white rounded-lg min-w-20"
        >
          {queryLoading ? 'Asking...' : 'Ask'}
        </button>
      </form>
    </div>
  );
};

export default AskAISection;
