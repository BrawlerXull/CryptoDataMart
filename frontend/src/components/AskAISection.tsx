import React, { useState, useEffect } from 'react';
import { FaRobot, FaClipboard } from 'react-icons/fa';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown'; 
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  const handleCopyClick = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied to clipboard!');
    }).catch((err) => {
      toast.error('Failed to copy the code');
      console.error(err);
    });
  };

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
            style={{
              whiteSpace: 'nowrap', 
              overflowX: 'auto', 
              maxWidth: '100%', 
            }}
          >
            <h5 className="font-semibold text-xl">AI Response {index + 1}:</h5>
            <ReactMarkdown
              className="prose dark:prose-invert"
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const isInline = inline;
                  const codeString = String(children).replace(/\n$/, '');
                  
                  const copyButton = (
                    <button
                      onClick={() => handleCopyClick(codeString)}
                      className="absolute top-2 right-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                      title="Copy code"
                    >
                      <FaClipboard className="text-gray-600" />
                    </button>
                  );

                  if (isInline) {
                    return (
                      <code
                        className="bg-gray-200 p-1 rounded-sm text-primary_text"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="relative">
                      {copyButton}
                      <SyntaxHighlighter
                        style={a11yDark} 
                        language="javascript" 
                        className="bg-gray-800 rounded-md p-4" 
                        customStyle={{
                          overflowX: 'auto',
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                },


                p({ children, ...props }) {

                  if (children && Array.isArray(children) && children.some((child: any) => child?.type === 'pre' || child?.type === 'code')) {

                    return <div {...props}>{children}</div>;
                  }
                  return <p {...props}>{children}</p>;
                },


                pre({ children, ...props }: any) {

                  const { ref, ...restProps } = props;
                  return <div {...restProps}>{children}</div>;  
                },
              }}
            >
              {resp}
            </ReactMarkdown>
          </div>
        ))}
      </div>

      <form onSubmit={handleQuerySubmit} className="mt-4">
        <input
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
