import React from "react";
import { formatCreationTime } from "../utils/helphers";

interface DatasetTitleProps {
  datasetId: number;
  creationTime: number;
  tags: string[];
}

const DatasetTitle: React.FC<DatasetTitleProps> = ({
  datasetId,
  creationTime,
  tags,
}) => {
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold text-primary_text mb-1">{`Dataset #${
          datasetId + 1
        }`}</h1>
        <div className="text-lg text-primary/80">
          <p>{formatCreationTime(creationTime)}</p>
        </div>
      </div>
      {tags.length > 0 ? (
        <div className="flex flex-wrap">
          {tags.map((tag, index) => (
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
    </>
  );
};

export default DatasetTitle;
