import { useEffect } from "react";

/**
 * Custom hook to set favicon and document title
 * @param {string} url - URL of the favicon
 * @param {string} title - Title of the document
 */
function useFavicon(url, title) {
  useEffect(() => {
    // Set document title
    if (title) {
      document.title = title;
    }

    // Remove old favicons
    const oldIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    oldIcons.forEach(el => el.remove());

    // Add new favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = url;
    document.head.appendChild(link);

    // Cleanup
    return () => {
      link.remove();
    };
  }, [url, title]);
}

export default useFavicon;
