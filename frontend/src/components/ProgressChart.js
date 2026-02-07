import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

export const ProgressRadialChart = ({ progress = 75 }) => {
  const data = [
    { name: 'Progress', value: progress, fill: '#667eea' },
    { name: 'Remaining', value: 100 - progress, fill: '#e2e8f0' }
  ];

  return (
    <ChartContainer>
      <ChartTitle>Learning Progress</ChartTitle>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="30%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise={true}
              dataKey="value"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: '2rem', fontWeight: 'bold', fill: '#667eea' }}
            >
              {progress}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export const CourseDistributionChart = ({ data }) => {
  const COLORS = ['#667eea', '#764ba2', '#ff7e5f', '#feb47b', '#2ed573'];

  return (
    <ChartContainer>
      <ChartTitle>Course Distribution</ChartTitle>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export const LearningTrendChart = ({ data }) => {
  return (
    <ChartContainer>
      <ChartTitle>Learning Trends</ChartTitle>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#718096" />
            <YAxis stroke="#718096" />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '10px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hours"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#2ed573"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};