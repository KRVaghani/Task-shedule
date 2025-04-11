import { Task } from '../types/task';
import axios from 'axios';

interface TaskDetailPopupProps {
  task: Task;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export default function TaskDetailPopup({ task, onClose, onTaskUpdated }: TaskDetailPopupProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      await axios.put(`http://localhost:3001/tasks/${task.id}`, {
        ...task,
        title: formData.get('title'),
        description: formData.get('description'),
        date: formData.get('date'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        priority: formData.get('priority'),
        status: formData.get('status')
      });
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2 className="popup-title">Task Details</h2>
        
        <form onSubmit={handleSubmit} className="task-detail-form">
          <div className="form-group">
            <label htmlFor="popup-title">Title</label>
            <input
              type="text"
              id="popup-title"
              name="title"
              defaultValue={task.title}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="popup-description">Description</label>
            <textarea
              id="popup-description"
              name="description"
              defaultValue={task.description}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="popup-date">Date</label>
              <input
                type="date"
                id="popup-date"
                name="date"
                defaultValue={task.date}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="popup-startTime">Start Time</label>
              <input
                type="time"
                id="popup-startTime"
                name="startTime"
                defaultValue={task.startTime}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="popup-endTime">End Time</label>
              <input
                type="time"
                id="popup-endTime"
                name="endTime"
                defaultValue={task.endTime}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="popup-priority">Priority</label>
              <select
                id="popup-priority"
                name="priority"
                defaultValue={task.priority}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="popup-status">Status</label>
              <select
                id="popup-status"
                name="status"
                defaultValue={task.status}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}