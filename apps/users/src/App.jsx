import React, { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, ErrorState, Skeleton } from '@mfd/ui';
import { getUsers, updateUser } from './services/usersApi';
import UserTable from './components/UserTable';
import './styles.css';

function UsersContent() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const users = usersQuery.data || [];
  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return users;

    return users.filter((user) => {
      const searchableText = `${user.name} ${user.email} ${user.company.name}`;
      return searchableText.toLowerCase().includes(term);
    });
  }, [users, search]);

  if (usersQuery.isLoading) {
    return <Skeleton rows={8} />;
  }

  if (usersQuery.isError) {
    return <ErrorState onRetry={usersQuery.refetch} />;
  }

  return (
    <div className="users-page">
      <div className="users-toolbar">
        <div>
          <h2>Team members</h2>
          <p>Manage workspace users and roles.</p>
        </div>

        <div className="user-tools">
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search users"
          />
          <Button>+ Invite user</Button>
        </div>
      </div>

      {updateMutation.isError && (
        <div className="mutation-error">Unable to update this user. Please try again.</div>
      )}

      <Card className="table-card">
        <UserTable
          users={filteredUsers}
          isUpdating={updateMutation.isPending}
          onUpdate={updateMutation.mutate}
        />
      </Card>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 2 },
  },
});

export default function Users() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsersContent />
    </QueryClientProvider>
  );
}
