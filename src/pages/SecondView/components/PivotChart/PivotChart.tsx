import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PivotChartProps {
  data: { period: string; count: number }[];
}

const PivotChart: React.FC<PivotChartProps> = ({ data }) => {

  return (
    <BarChart width={1100} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="period" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default PivotChart;
