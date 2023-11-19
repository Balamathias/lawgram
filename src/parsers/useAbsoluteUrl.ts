import { useLocation } from 'react-router-dom';

function useAbsoluteUrl() {
  const location = useLocation();

  // The absolute URL can be obtained from location.pathname
  const absoluteURL = window.location.origin + location.pathname;

  return absoluteURL
}

export default useAbsoluteUrl;
