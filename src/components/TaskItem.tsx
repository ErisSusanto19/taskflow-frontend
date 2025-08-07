import React, { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { toggleTaskCompletion, deleteTask, editTask } from '@/redux/features/tasks/taskSlice';
import { Pencil, Check, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  category: string;
  quote?: string;
  completed: boolean;
  unsplashImage?: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(task.title);
    const [newDescription, setNewDescription] = useState(task.description || '');
    const [newPriority, setNewPriority] = useState(task.priority);
    const [newDueDate, setNewDueDate] = useState(task.dueDate || '');

    const dispatch = useAppDispatch();

    const handleToggleCompletion = () => {
        dispatch(toggleTaskCompletion(task.id));
    };

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            dispatch(deleteTask(task.id));
        }
    }

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (newTitle.trim()) {
        dispatch(editTask({ 
          id: task.id, 
          updates: { 
            title: newTitle, 
            description: newDescription,
            priority: newPriority,
            dueDate: newDueDate
          } 
        }));
        setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setNewTitle(task.title);
        setNewDescription(task.description || '');
        setNewPriority(task.priority);
        setNewDueDate(task.dueDate || '');
        setIsEditing(false);
    };
    
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };
    
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
      <div className="absolute inset-0 bg-black/40 z-0" />

      {!isEditing && (
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
            <button onClick={handleEdit} className="p-1 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white transition-colors" title="Edit tugas">
                <Pencil size={20} />
            </button>
            <button onClick={handleToggleCompletion} className={`p-1 rounded-full ${task.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'} text-white transition-colors`} title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}>
                <Check size={20} />
            </button>
            <button onClick={handleDelete} className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors" title="Hapus tugas">
                <Trash2 size={20} />
            </button>
        </div>
      )}

      <div className={`z-10 relative flex flex-col items-start ${ task.completed && !isEditing ? 'opacity-50' : '' }`}>
            <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col w-full items-start space-y-2"
              >
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="p-2 rounded bg-white/90 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-xl font-bold w-full" onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') handleCancelEdit(); }} />
                  <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="p-2 rounded bg-white/90 text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm w-full" onKeyDown={(e) => { if (e.key === 'Escape') handleCancelEdit(); }} rows={3} placeholder="Deskripsi tugas..."/>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')} className="p-2 rounded bg-white/90 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none w-full">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                  </select>
                  <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="p-2 rounded bg-white/90 text-gray-800 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none w-full"/>
                  <div className="flex justify-end w-full space-x-2 mt-2">
                      <button onClick={handleSaveEdit} className="p-1 text-green-300 hover:text-green-500 transition-colors" title="Simpan perubahan"><Check size={28} strokeWidth={2.5} /></button>
                      <button onClick={handleCancelEdit} className="p-1 text-red-300 hover:text-red-500 transition-colors" title="Batal edit"><X size={28} strokeWidth={2.5} /></button>
                  </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                  <span className={`text-xl font-bold break-words block ${ task.completed ? 'line-through text-gray-400' : 'text-white drop-shadow' }`}>{task.title}</span>
                  {task.description && ( <p className="text-sm text-gray-200 drop-shadow mt-2"> {task.description} </p> )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getPriorityColor(task.priority)}`}>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                      <span className="text-xs font-semibold text-white bg-blue-500 px-2 py-1 rounded-full">{task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                      {task.dueDate && ( <span className="text-sm text-gray-300"> Jatuh Tempo: {task.dueDate} </span> )}
                  </div>
                  {task.quote && ( <p className="italic text-sm text-gray-300 drop-shadow mt-4"> "{task.quote}" </p> )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskItem;