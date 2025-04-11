import { useState, FormEvent } from 'react';
import { Task } from '../types/task';
import axios from 'axios';

interface TaskFormProps {
  onTaskAdded: () => void;
  editingTask?: Task | null;
}

export default function TaskForm({ onTaskAdded, editingTask }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: editingTask?.title || '',
    description: editingTask?.description || '',
    date: editingTask?.date || new Date().toISOString().split('T')[0],
    startTime: editingTask?.startTime || '09:00',
    endTime: editingTask?.endTime || '10:00',
    status: editingTask?.status || 'pending',
    priority: editingTask?.priority || 'medium'
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`http://localhost:3001/tasks/${editingTask.id}`, formData);
      } else {
        await axios.post('http://localhost:3001/tasks', formData);
      }
      onTaskAdded();
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        status: 'pending',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            type="time"
            id="startTime"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            type="time"
            id="endTime"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button type="submit" className="btn-primary">
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}