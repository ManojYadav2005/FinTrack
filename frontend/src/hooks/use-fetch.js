import { useState } from "react";
import { toast } from "sonner";

/**
 * Generic async fetch hook.
 * Pass any async function (API call) as `cb`.
 * Call `fn(...args)` to trigger it.
 */
const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response;
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || "Something went wrong";
      setError({ message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;
