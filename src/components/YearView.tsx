import { useState } from 'react';
import { format, addYears, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Task } from '../types/task';
import TaskDetailPopup from './TaskDetailPopup';
import MonthView from './MonthView';
import axios from 'axios';

interface YearViewProps {
  tasks: Task[];
  onTaskUpdated: () => void;
  onViewChange: (view: string, date: Date) => void;
}

export default function YearView({ tasks, onTaskUpdated, onViewChange }: YearViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<Date | null>(null);

  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const handlePrevYear = () => setCurrentDate(addYears(currentDate, -1));
  const handleNextYear = () => setCurrentDate(addYears(currentDate, 1));

  const getTasksForMonth = (month: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return isSameMonth(taskDate, month);
    });
  };

  const handleMonthClick = (month: Date) => {
    onViewChange('month', month);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceMonth = monthsInYear[parseInt(result.source.droppableId)];
    const destMonth = monthsInYear[parseInt(result.destination.droppableId)];
    
    if (!isSameMonth(sourceMonth, destMonth)) {
      const task = tasks.find(t => t.id === result.draggableId);
      if (!task) return;

      // Set the expanded month view when dragging to a different month
      setExpandedMonth(destMonth);

      try {
        // Keep the same day of month if possible, just change the month and year
        const originalDate = new Date(task.date);
        const newDate = new Date(destMonth);
        newDate.setDate(originalDate.getDate());
        
        await axios.put(`http://localhost:3001/tasks/${task.id}`, {
          ...task,
          date: format(newDate, 'yyyy-MM-dd')
        });
        onTaskUpdated();
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  // If a month is expanded, show the MonthView instead
  if (expandedMonth) {
    return (
      <div>
        <button 
          className="back-to-year"
          onClick={() => setExpandedMonth(null)}
        >
          Back to Year View
        </button>
        <MonthView 
          tasks={tasks} 
          onTaskUpdated={onTaskUpdated} 
          selectedDate={expandedMonth}
        />
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="year-view">
        <div className="year-header">
          <button className="year-nav-button" onClick={handlePrevYear}>
            Previous Year
          </button>
          <h2>{format(currentDate, 'yyyy')}</h2>
          <button className="year-nav-button" onClick={handleNextYear}>
            Next Year
          </button>
        </div>

        <div className="year-grid">
          {monthsInYear.map((month, monthIndex) => (
            <Droppable key={month.toISOString()} droppableId={`${monthIndex}`}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="year-month"
                  onClick={() => handleMonthClick(month)}
                >
                  <div className="month-header">
                    {format(month, 'MMMM')}
                  </div>
                  <div className="month-tasks">
                    {getTasksForMonth(month).map((task, taskIndex) => (
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
                            className={`year-task-card priority-${task.priority} ${
                              snapshot.isDragging ? 'dragging' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                          >
                            <div className="task-title">{task.title}</div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
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