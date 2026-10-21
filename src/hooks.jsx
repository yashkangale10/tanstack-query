import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, deleteUser } from './api';

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            // Invalidate to refresh the list automatically
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUser,
        // Optimistic Update Implementation
        onMutate: async (deletedUserId) => {
            // 1. Cancel in-flight queries
            await queryClient.cancelQueries({ queryKey: ['users'] });

            // 2. Snapshot the previous value
            const previousUsers = queryClient.getQueryData(['users']);

            // 3. Optimistically update the cache
            queryClient.setQueryData(['users'], (old) =>
                old ? old.filter((user) => user.id !== deletedUserId) : []
            );

            // 4. Return context containing the snapshot
            return { previousUsers };
        },
        onError: (err, deletedUserId, context) => {
            // 5. Rollback on failure
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }
        },
        onSettled: () => {
            // 6. Always sync with the server once finished
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};