import { useState } from 'react';
import { Task } from '../types/task';
import TaskDetailPopup from './TaskDetailPopup';

interface StatusViewProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export default function StatusView({ tasks, onTaskUpdated }: StatusViewProps) {
  const [activeTab, setActiveTab] = useState<Task['status']>('pending');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="status-view-container">
      <div className="status-tabs">
        <button
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({getTasksByStatus('pending').length})
        </button>
        <button
          className={`tab-button ${activeTab === 'in-progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          In Progress ({getTasksByStatus('in-progress').length})
        </button>
        <button
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({getTasksByStatus('completed').length})
        </button>
      </div>

      <div className="status-content">
        <div className="tasks-horizontal-scroll">
          {getTasksByStatus(activeTab).map((task) => (
            <div
              key={task.id}
              className={`task-card priority-${task.priority}`}
              onClick={() => handleTaskClick(task)}
            >
              <h4>{task.title}</h4>
              <div className="task-date">
                {new Date(task.date).toLocaleDateString()}
              </div>
              <div className="task-time">
                {task.startTime} - {task.endTime}
              </div>
              <div className={`task-status status-${task.status}`}>
                {task.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </div>
  );
}