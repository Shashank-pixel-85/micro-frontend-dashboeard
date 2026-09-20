import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@mfd/ui';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function createGrowthData() {
  return months.map((month, index) => ({
    month,
    users: 35 + index * 7 + (index % 3) * 8,
    activity: 22 + index * 5 + (index % 4) * 7,
  }));
}

export default function AnalyticsCharts({ completed, total }) {
  const growthData = createGrowthData();
  const taskData = [
    { name: 'Completed', value: completed },
    { name: 'Open', value: total - completed },
  ];

  return (
    <div className="charts-grid">
      <Card>
        <div className="chart-header">
          <div>
            <h2>Workspace growth</h2>
            <p>Demonstration trend data</p>
          </div>
          <span>12 months</span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="activity" stroke="#94a3b8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div className="chart-header">
          <div>
            <h2>Task health</h2>
            <p>Based on Shashank API todos</p>
          </div>
          <span>API data</span>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
