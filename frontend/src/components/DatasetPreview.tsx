// src/components/DatasetPreview.tsx

import React from 'react';
import { FaBook } from 'react-icons/fa';
import Spinner from './Spinner'; // Assuming Spinner component is already available

interface DatasetPreviewProps {
  csvData: any[];
  loading: boolean;
}

const DatasetPreview: React.FC<DatasetPreviewProps> = ({ csvData, loading }) => {
  if (loading) {
    return <Spinner />;
  }

  if (csvData.length === 0) {
    return <p className="text-primary/60">No preview available for this dataset.</p>;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center">
        <h4 className="text-2xl font-semibold text-primary_text">Preview</h4>
        <FaBook className="w-10" />
      </div>
      <div className="mt-4 overflow-x-auto max-h-[500px] border-2 rounded-sm border-primary/20">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-primary/10">
              {Object.keys(csvData[0]).map((key) => (
                <th key={key} className="px-4 py-2 text-left">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index} className="border-b">
                {Object.values(row).map((value, idx) => (
                  <td key={idx} className="px-4 py-2">
                    {String(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatasetPreview;
