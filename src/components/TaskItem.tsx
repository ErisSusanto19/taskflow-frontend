import React from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { toggleTaskCompletion, deleteTask } from '@/redux/features/tasks/taskSlice';

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
    const dispatch = useAppDispatch();

    const handleToggleCompletion = () => {
        dispatch(toggleTaskCompletion(task.id));
    };

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            dispatch(deleteTask(task.id));
        }
    }

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

        <div className="absolute bottom-4 right-4 z-20 flex space-x-2">
            <button
            onClick={handleToggleCompletion}
            className={`p-2 rounded-full ${task.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'} text-white transition-colors`}
            title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
            >
            {/* Anda bisa menggunakan ikon di sini, misalnya dari Heroicons */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            </button>
            <button
            onClick={handleDelete}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
            title="Hapus tugas"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            </button>
        </div>

    </div>
  );
};

export default TaskItem;