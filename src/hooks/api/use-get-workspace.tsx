/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getWorkspaceByIdQueryFn } from "@/lib/api";
import { CustomError } from "@/types/custom-error.type";

const useGetWorkspaceQuery = (
  workspaceId: string,
  options?: Omit<UseQueryOptions<any, CustomError>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<any, CustomError>({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: false, // Don't refetch on mount if we have data
    refetchOnWindowFocus: false, // Don't refetch on window focus
    enabled: !!workspaceId,
    ...options,
  });

  return query;
};

export default useGetWorkspaceQuery;
