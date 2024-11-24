import { useState } from 'react';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const useGeminiDescription = () => {
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateDescription = async (descriptionText: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: descriptionText,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching from Gemini API: ${response.statusText}`);
      }

      const data = await response.json();
      if (data?.candidates && data.candidates.length > 0) {
        const description = data.candidates[0]?.content?.parts[0]?.text;
        setGeneratedDescription(description || 'No description generated.');
      } else {
        throw new Error('Unexpected response structure from Gemini API');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { generatedDescription, loading, error, generateDescription };
};

export default useGeminiDescription;
