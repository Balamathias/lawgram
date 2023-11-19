import { useEffect, useState } from "react";
import useAbsoluteUrl from './useAbsoluteUrl'
import toast from "react-hot-toast";

function useCopyLink() {
    const [isCopied, setIsCopied] = useState(false);
  
    const textToCopy = useAbsoluteUrl();

    const copyLink = () => {
        navigator.clipboard.writeText(textToCopy)
        .then(() => {
        setIsCopied(true);
        toast.success("Link copied successfully.")
        })
        .catch((error) => {
        setIsCopied(false);
        toast.success("Link could not be copied.")
        console.error(error)
        
        });
    }

    useEffect(() => {
        const timeout = setTimeout(() => setIsCopied(false), 3000);
    
        return () => clearTimeout(timeout);
      }, [isCopied]);

    return {copyLink, isCopied}
}

export default useCopyLink