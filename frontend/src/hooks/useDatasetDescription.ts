import { useState, useEffect, useCallback } from 'react';
import { getDescriptionFromLocalStorage, storeDescriptionInLocalStorage } from '../utils/helphers';
import useGeminiDescription from './useGeminiDescription';

export const useDatasetDescription = (datasetId: number, promptTemplate: string, csvData: any[]) => {
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const { generatedDescription: apiDescription, loading: descriptionLoading, generateDescription } = useGeminiDescription();

  const generateDescriptionText = useCallback(() => {
    if (!csvData || !csvData.length || !promptTemplate) {
      console.log("Missing data or template. Skipping description generation.");
      return;
    }

    const numRows = csvData.length;
    const numCols = csvData[0] ? Object.keys(csvData[0]).length : 0;
    const columnNames = Object.keys(csvData[0]).join(', ');
    const sampleRows = csvData.slice(0, 3).map((row: any, index: number) => `Row ${index + 1}: ${JSON.stringify(row)}`).join('\n');

    const descriptionText = promptTemplate
      .replace("{{numRows}}", numRows.toString())
      .replace("{{numCols}}", numCols.toString())
      .replace("{{columnNames}}", columnNames)
      .replace("{{sampleRows}}", sampleRows);

    console.log("Triggering description generation with:", descriptionText);
    generateDescription(descriptionText);
  }, [csvData, promptTemplate, generateDescription]);

  useEffect(() => {
    const cachedDescription = getDescriptionFromLocalStorage(datasetId);

    if (cachedDescription) {
      console.log("Description loaded from localStorage");
      setGeneratedDescription(cachedDescription);
    } else if (!descriptionLoading && !generatedDescription) {
      console.log("Description not found in localStorage, calling API...");
      generateDescriptionText();
    }
  }, [datasetId, promptTemplate, descriptionLoading, generatedDescription, generateDescriptionText]);

  useEffect(() => {
    if (apiDescription && datasetId) {
      const cleanedDescription = apiDescription.replace(/<<NEWLINE>>/g, '\n');
      console.log("Description generated, storing in localStorage.");
      storeDescriptionInLocalStorage(datasetId, cleanedDescription);
      setGeneratedDescription(cleanedDescription);
    }
  }, [apiDescription, datasetId]);

  return { generatedDescription, descriptionLoading };
};
