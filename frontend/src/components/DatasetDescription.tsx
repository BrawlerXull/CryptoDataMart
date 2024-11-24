import React from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import Spinner from './Spinner';

interface DatasetDescriptionProps {
  description: string | null;
  loading: boolean;
}

const DatasetDescription: React.FC<DatasetDescriptionProps> = ({ description, loading }) => {
  const formatDescription = (description: string) => {
    const sentences = description
      .split(".")
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    return (
      <ul className="list-disc pl-5">
        {sentences.map((sentence, index) => (
          <li key={index}>{sentence}.</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mt-8">
      <div className="flex items-center">
        <h4 className="text-2xl font-semibold text-primary_text">Description</h4>
        <FaEnvelopeOpenText className="w-10" />
      </div>
      {loading ? (
        <Spinner />
      ) : description ? (
        <div className="text-lg mt-2">{formatDescription(description)}</div>
      ) : (
        <div className="text-lg mt-2 text-primary/60">No description available for this dataset.</div>
      )}
    </div>
  );
};

export default DatasetDescription;
