import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function useCopyText(): { ref: React.RefObject<HTMLDivElement>, isCopied: boolean, copyText: () => void } {
  const ref = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const copyText = () => {
    if (ref.current) {
      const textToCopy = ref.current.innerText;
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setIsCopied(true);
          toast.success("Copied successfully.")
        })
        .catch((error) => {
          setIsCopied(false);
          toast.success("Action failed.")
          console.error(error)
          
        });
    }
  };
  
  useEffect(() => {
    const timeout = setTimeout(() => setIsCopied(false), 3000);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return { ref, isCopied, copyText };
}

export default useCopyText;

