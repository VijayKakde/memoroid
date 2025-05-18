import React, { useEffect, useState } from 'react';
import { useFlashcardStore } from '../stores/flashcardStore';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Stats: React.FC = () => {
  const { getReviewStats, loading, error } = useFlashcardStore();
  const [stats, setStats] = useState<{
    known: number;
    unknown: number;
    dailyStats: { date: string; known: number; unknown: number }[];
  }>({
    known: 0,
    unknown: 0,
    dailyStats: [],
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      const data = await getReviewStats();
      setStats(data);
    };
    
    loadStats();
  }, [getReviewStats]);

  const pieData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [stats.known, stats.unknown],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#047857', '#B91C1C'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: stats.dailyStats.map(day => 
      new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Correct',
        data: stats.dailyStats.map(day => day.known),
        backgroundColor: '#10B981',
      },
      {
        label: 'Incorrect',
        data: stats.dailyStats.map(day => day.unknown),
        backgroundColor: '#EF4444',
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Daily Review History',
      },
    },
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        beginAtZero: true,
      },
    },
  };

  const totalReviews = stats.known + stats.unknown;

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Your Statistics</h1>
        <p className="text-gray-600 mt-1">Track your progress and performance</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading statistics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <h3 className="font-medium text-gray-500 mb-1">Total Reviews</h3>
              <p className="text-3xl font-bold text-indigo-600">{totalReviews}</p>
            </div>
            <div className="card">
              <h3 className="font-medium text-gray-500 mb-1">Correct Answers</h3>
              <p className="text-3xl font-bold text-emerald-600">{stats.known}</p>
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews > 0 ? `${Math.round((stats.known / totalReviews) * 100)}%` : '0%'}
              </p>
            </div>
            <div className="card">
              <h3 className="font-medium text-gray-500 mb-1">Incorrect Answers</h3>
              <p className="text-3xl font-bold text-red-600">{stats.unknown}</p>
              <p className="text-sm text-gray-500 mt-1">
                {totalReviews > 0 ? `${Math.round((stats.unknown / totalReviews) * 100)}%` : '0%'}
              </p>
            </div>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Knowledge Distribution</h2>
              {totalReviews > 0 ? (
                <div className="h-64">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">No review data available yet</p>
                </div>
              )}
            </div>
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Review History</h2>
              {stats.dailyStats.some(day => day.known > 0 || day.unknown > 0) ? (
                <div className="h-64">
                  <Bar data={barData} options={barOptions} />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">No review history data available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;