
import processPostContent from '@/_root/processPostContent';
import React from 'react';

interface ProcessedPostProps {
  content: string;
}

const ProcessedPost: React.FC<ProcessedPostProps> = ({ content }) => {
  const processedContent = processPostContent(content);

  return <>{processedContent}</>;
};

export default ProcessedPost;
