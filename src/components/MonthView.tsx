import { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isTomorrow } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from '../types/task';
import TaskDetailPopup from './TaskDetailPopup';
import axios from 'axios';

interface MonthViewProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  selectedDate?: Date;
}

export default function MonthView({ tasks, onTaskUpdated, selectedDate }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => setCurrentDate(addMonths(currentDate, -1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => 
      new Date(task.date).toDateString() === date.toDateString()
    );
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'd');
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceDay = daysInMonth[parseInt(result.source.droppableId)];
    const destDay = daysInMonth[parseInt(result.destination.droppableId)];
    
    if (sourceDay.toDateString() !== destDay.toDateString()) {
      const task = tasks.find(t => t.id === result.draggableId);
      if (!task) return;

      try {
        const newDate = format(destDay, 'yyyy-MM-dd');
        await axios.put(`http://localhost:3001/tasks/${task.id}`, {
          ...task,
          date: newDate
        });
        onTaskUpdated();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="month-view">
        <div className="month-header">
          <button className="month-nav-button" onClick={handlePrevMonth}>
            Previous
          </button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button className="month-nav-button" onClick={handleNextMonth}>
            Next
          </button>
        </div>

        <div className="month-weekdays">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="weekday-header">
              {day}
            </div>
          ))}
        </div>

        <div className="month-grid">
          {daysInMonth.map((day, dayIndex) => (
            <Droppable key={day.toISOString()} droppableId={`${dayIndex}`}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`month-day ${isToday(day) ? 'today' : ''} ${
                    isTomorrow(day) ? 'tomorrow' : ''
                  }`}
                >
                  <div className="month-date">{formatDate(day)}</div>
                  <div className="month-tasks">
                    {getTasksForDay(day).map((task, taskIndex) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={taskIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`month-task-card priority-${task.priority} ${
                              snapshot.isDragging ? 'dragging' : ''
                            }`}
                            onClick={() => setSelectedTask(task)}
                          >
                            <div className="task-title">{task.title}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>

        {selectedTask && (
          <TaskDetailPopup
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onTaskUpdated={onTaskUpdated}
          />
        )}
      </div>
    </DragDropContext>
  );
}