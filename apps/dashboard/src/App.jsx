import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Badge, Card, EmptyState, ErrorState, Skeleton, StatCard } from '@mfd/ui';
import { formatNumber } from '@mfd/utils';
import { getPosts, getUsers } from './services/dashboardApi';
import ActivityList from './components/ActivityList';
import HealthCard from './components/HealthCard';
import './styles.css';

function DashboardContent() {
  const usersQuery = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: getUsers,
  });

  const postsQuery = useQuery({
    queryKey: ['dashboard-posts'],
    queryFn: getPosts,
  });

  if (usersQuery.isLoading || postsQuery.isLoading) {
    return <Skeleton rows={7} />;
  }

  if (usersQuery.isError || postsQuery.isError) {
    return (
      <ErrorState
        onRetry={() => {
          usersQuery.refetch();
          postsQuery.refetch();
        }}
      />
    );
  }

  const users = usersQuery.data || [];
  const posts = postsQuery.data || [];

  if (users.length === 0) {
    return <EmptyState title="No workspace data" text="The API returned no users." />;
  }

  const activeSessions = Math.round(users.length * 0.72);

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard label="Total users" value={formatNumber(users.length)} delta="+12.4%" icon="◉" />
        <StatCard label="Published posts" value={formatNumber(posts.length)} delta="+8.1%" icon="▤" />
        <StatCard label="Active sessions" value={formatNumber(activeSessions)} delta="+4.6%" icon="◒" />
        <StatCard label="Conversion" value="24.8%" delta="+2.3%" icon="↗" />
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="section-head">
            <div>
              <h2>Recent activity</h2>
              <p>Latest records from the Shashank workspace API</p>
            </div>
            <Badge tone="success">API data</Badge>
          </div>
          <ActivityList users={users} />
        </Card>

        <HealthCard />
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 2 },
  },
});

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}
