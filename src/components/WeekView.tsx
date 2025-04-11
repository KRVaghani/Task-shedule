import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { format, startOfWeek, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';
import { Task } from '../types/task';
import axios from 'axios';
import TaskDetailPopup from './TaskDetailPopup';

interface WeekViewProps {
  tasks: Task[];
  onTaskUpdated: () => void;
}

export default function WeekView({ tasks, onTaskUpdated }: WeekViewProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const today = new Date();
    const currentWeekDays = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfWeek(today, { weekStartsOn: 1 }), i);
      return day;
    });

    // Move today to the first position if it's in the current week
    const todayIndex = currentWeekDays.findIndex(day => isToday(day));
    if (todayIndex > 0) {
      const beforeToday = currentWeekDays.slice(0, todayIndex);
      const afterToday = currentWeekDays.slice(todayIndex);
      setWeekDays([...afterToday, ...beforeToday]);
    } else {
      setWeekDays(currentWeekDays);
    }
  }, []);

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => 
      isSameDay(new Date(task.date), date)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    const newDate = format(weekDays[parseInt(destination.droppableId)], 'yyyy-MM-dd');
    
    try {
      await axios.put(`http://localhost:3001/tasks/${task.id}`, {
        ...task,
        date: newDate
      });
      onTaskUpdated();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="week-view">
          {weekDays.map((day, index) => (
            <Droppable key={index} droppableId={index.toString()}>
              {(provided) => (
                <div
                  className={`day-column ${isToday(day) ? 'today' : ''} ${
                    isTomorrow(day) ? 'tomorrow' : ''
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <div className="day-header">
                    <h3>{format(day, 'EEEE')}</h3>
                    <span className="date">{formatDate(day)}</span>
                  </div>
                  <div className="tasks-container">
                    {getTasksForDay(day).map((task, taskIndex) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={taskIndex}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`task-card priority-${task.priority} ${
                              snapshot.isDragging ? 'dragging' : ''
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleTaskClick(task)}
                          >
                            <h4>{task.title}</h4>
                            <div className="task-time">
                              {task.startTime} - {task.endTime}
                            </div>
                            <div className={`task-status status-${task.status}`}>
                              {task.status}
                            </div>
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
      </DragDropContext>
      
      {selectedTask && (
        <TaskDetailPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={onTaskUpdated}
        />
      )}
    </>
  );
}