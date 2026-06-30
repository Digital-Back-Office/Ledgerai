import { useEffect, useState } from "react";

/**
 * Programmatically navigates to a new URL and triggers a state update
 * for any components listening via useCurrentPath.
 */
export const navigateTo = (url: string) => {
  window.history.pushState(null, "", url);
  // Dispatch a popstate event so all hooks update
  window.dispatchEvent(new Event("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * React hook that returns the current window path, updating whenever
 * the user navigates back/forward or programmatically.
 */
export const useCurrentPath = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return path;
};
