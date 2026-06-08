import { useState, useCallback } from 'react';

/**
 * Custom hook to execute an async action and manage its loading, error, and response states.
 * 
 * @param {Function} asyncFn - The async function to wrap.
 * @returns {Object} An object containing the execute function and the states (isLoading, error, data).
 */
export function useAsyncAction(asyncFn) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn]);

  return {
    execute,
    isLoading,
    error,
    data,
    setError,
    setData
  };
}
