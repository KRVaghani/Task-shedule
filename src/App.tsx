import { useState, useEffect } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import WeekView from './components/WeekView';
import MonthView from './components/MonthView';
import YearView from './components/YearView';
import StatusView from './components/StatusView';
import ThemeSwitcher from './components/ThemeSwitcher';
import ViewSwitcher from './components/ViewSwitcher';
import { Task } from './types/task';
import axios from 'axios';

type ViewType = 'week' | 'month' | 'year';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('week');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Error loading tasks. Please try again later.');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const renderCurrentView = () => {
    if (loading) return <div className="loading">Loading tasks...</div>;

    switch (currentView) {
      case 'week':
        return <WeekView tasks={tasks} onTaskUpdated={fetchTasks} />;
      case 'month':
        return <MonthView tasks={tasks} onTaskUpdated={fetchTasks} />;
      case 'year':
        return <YearView tasks={tasks} onTaskUpdated={fetchTasks} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ThemeSwitcher />
      <div className="app-container">
        <div className="form-section">
          <h1 className="page-title">Task Scheduler</h1>
          {error && <div className="error">{error}</div>}
          <TaskForm onTaskAdded={fetchTasks} />
        </div>
        <div className="content-section">
          <div className="view-controls">
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
          <div className="calendar-view-container">
            {renderCurrentView()}
          </div>
          <div className="status-view-section">
            <StatusView tasks={tasks} onTaskUpdated={fetchTasks} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
