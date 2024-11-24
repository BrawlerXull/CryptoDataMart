import { useEffect, useState } from 'react';

const usePromptTemplate = () => {
  const [promptTemplate, setPromptTemplate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromptTemplate = async () => {
      try {
        const response = await fetch("/prompt.txt");
        
        if (!response.ok) {
          throw new Error('Failed to fetch prompt template');
        }

        const data = await response.text();
        setPromptTemplate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPromptTemplate();
  }, []);

  return { promptTemplate, loading, error };
};

export default usePromptTemplate;
