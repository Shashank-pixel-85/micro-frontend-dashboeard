import React from 'react';
import { Card } from '@mfd/ui';

const healthMetrics = [
  { label: 'API availability', value: '99.98%', progress: '99%' },
  { label: 'Module load', value: '182 ms', progress: '88%' },
  { label: 'Tasks completed', value: '87%', progress: '87%' },
];

export default function HealthCard() {
  return (
    <Card>
      <div className="section-head">
        <div>
          <h2>Quick health</h2>
          <p>Demonstration platform signals</p>
        </div>
      </div>

      <div className="health-list">
        {healthMetrics.map((metric) => (
          <div className="health-item" key={metric.label}>
            <div className="health-labels">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
            <div className="progress" aria-hidden="true">
              <i style={{ width: metric.progress }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
