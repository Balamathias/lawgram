import React from 'react';
import { Link } from 'react-router-dom';

const processPostContent = (content: string): React.ReactElement => {
  // Split the content by "\n\n" to identify paragraphs
  const paragraphs = content?.split('\n\n');
  // const hashtagRegex = /#[^\s#]+/g; // Regex to match hashtags
  // const mentionRegex = /@[^\s@]+/g;
  // Map each paragraph
  const processedContent = paragraphs?.map((paragraph, index) => {
    // Split the paragraph by spaces to identify hashtags and user mentions
    const words = paragraph?.split(' ');

    // Map each word in the paragraph to determine if it's a hashtag, user mention, or plain text
    const processedParagraph = words?.map((word, wordIndex) => {
      if (word.startsWith('#')) {
        // Extract the hashtag without the '#' character
        const hashTag = word?.slice(1);

        // Create a Link to the /posts/tags route with the hashtag as a parameter
        return (
          <Link to={`/posts/tags?tag=${hashTag}`} className='text-primary-500' key={wordIndex + hashTag}>
            {word}{' '}
          </Link>
        );
      } else if (word?.startsWith('@')) {
        // Extract the username without the '@' character
        const username = word?.slice(1);

        // Create a Link to the /user/@username route
        return (
          <Link to={`/profile/${username}`} className='text-fuchsia-400' key={wordIndex + username}>
            {word}{' '}
          </Link>
        );
      } else {
        // Return the word as it is if it's not a hashtag or user mention
        return <span key={wordIndex}>{word}{' '}</span>;
      }
    });

    // Flatten the processedParagraph array to avoid nested arrays in JSX
    const flattenedProcessedParagraph = processedParagraph?.flat();

    // Create a <p> tag for the processed paragraph
    return (
      <p key={index} className='py-2'>
        {flattenedProcessedParagraph}
      </p>
    );
  });

  return <>{processedContent}</>;
};

export default processPostContent;
