import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../data/products';

export function useProducts({ category = 'All', search = '', filter = '' } = {}) {
  const [sortBy, setSortBy] = useState('featured');

  const {
    data: productsList = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['products', category, search, filter, sortBy],
    queryFn: () => {
      const params = {
        category,
        search,
        sortBy
      };
      if (filter) {
        params.filter = filter;
      }
      return api.getProducts(params);
    }
  });

  return {
    productsList,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    sortBy,
    setSortBy
  };
}
