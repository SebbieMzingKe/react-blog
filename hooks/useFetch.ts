import { useEffect, useState } from "react";

interface UseFetchResult<T> {
  data: T | null;
  isPending: boolean;
  error: string | null;
}

const useFetch = <T>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortCont = new AbortController();
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          signal: abortCont.signal
        });

        if (!response.ok) {
          throw new Error('Could not fetch the data for that resource');
        }

        const jsonData = await response.json();
        setData(jsonData);
        setIsPending(false);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setIsPending(false);
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      }
    };

    fetchData();

    return () => abortCont.abort();
  }, [url]);

  return { data, isPending, error };
};

export default useFetch;