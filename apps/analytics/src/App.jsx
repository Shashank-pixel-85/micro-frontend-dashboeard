import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ErrorState, Skeleton, StatCard } from '@mfd/ui';
import { getTodos } from './services/analyticsApi';
import AnalyticsCharts from './components/AnalyticsCharts';
import './styles.css';

function AnalyticsContent() {
  const todosQuery = useQuery({
    queryKey: ['analytics-todos'],
    queryFn: getTodos,
  });

  if (todosQuery.isLoading) {
    return <Skeleton rows={8} />;
  }

  if (todosQuery.isError) {
    return <ErrorState onRetry={todosQuery.refetch} />;
  }

  const todos = todosQuery.data || [];
  const completed = todos.filter((todo) => todo.completed).length;
  const completionRate = todos.length ? Math.round((completed / todos.length) * 100) : 0;

  return (
    <div className="analytics-page">
      <div className="analytics-stats">
        <StatCard label="Completion rate" value={`${completionRate}%`} delta="+5.2%" icon="✓" />
        <StatCard label="Total events" value={todos.length} delta="+11.8%" icon="◒" />
        <StatCard label="Avg. response" value="1.8s" delta="-14%" icon="◷" />
      </div>

      {todos.length === 0 ? (
        <div className="analytics-empty">No analytics data was returned by the API.</div>
      ) : (
        <AnalyticsCharts completed={completed} total={todos.length} />
      )}
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 2 },
  },
});

export default function Analytics() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsContent />
    </QueryClientProvider>
  );
}
