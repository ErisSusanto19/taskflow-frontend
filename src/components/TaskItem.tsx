import React from 'react';

interface Task {
  id: string;
  title: string;
  category: string;
  quote?: string;
  completed: boolean;
  unsplashImage?: string;
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  return (
    <div
      className="relative p-4 rounded-md shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01]"
      style={{
        backgroundImage: task.unsplashImage
          ? `url(${task.unsplashImage})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0" />

      <div
        className={`z-10 relative flex flex-col items-start ${
          task.completed ? 'opacity-50' : ''
        }`}
      >
        <span
          className={`text-xl font-bold break-words block ${
            task.completed
              ? 'line-through text-gray-500'
              : 'text-white drop-shadow'
          }`}
        >
          {task.title}
        </span>
        <span className="text-sm font-semibold text-white bg-blue-500 px-2 py-1 rounded-full mt-2 inline-block">
          {task.category}
        </span>
        {task.quote && (
          <p className="italic text-sm text-white drop-shadow mt-2">
            "{task.quote}"
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskItem;