'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ADD_TASK_WITH_API_REQUEST, LOAD_TASKS_FROM_LOCAL_STORAGE } from '@/redux/features/tasks/taskSaga';
import { reorderTasks } from '@/redux/features/tasks/taskSlice';
import TaskItem from '@/components/TaskItem';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { LoaderCircle, ClipboardList } from 'lucide-react';

export default function HomePage() {
  const [taskInput, setTaskInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('umum');
  const [priorityInput, setPriorityInput] = useState('medium');
  const [dueDateInput, setDueDateInput] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch({ type: LOAD_TASKS_FROM_LOCAL_STORAGE });
  }, [dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.trim()) {
      dispatch({
        type: ADD_TASK_WITH_API_REQUEST,
        payload: {
          title: taskInput,
          description: descriptionInput,
          category: categoryInput,
          priority: priorityInput,
          dueDate: dueDateInput,
          completed: false,
        },
      });
      setTaskInput('');
      setDescriptionInput('');
      setPriorityInput('medium');
      setDueDateInput('');
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    dispatch(reorderTasks({ startIndex: result.source.index, endIndex: result.destination.index }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'completed' && task.completed) || (filterStatus === 'incomplete' && !task.completed);
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearchTerm = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || (task.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesCategory && matchesPriority && matchesSearchTerm;
  });

  const showPlaceholder = !loading && tasks.length === 0 && searchTerm === '' && filterStatus === 'all' && filterCategory === 'all';

  return (
    <main className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Taskflow
        </h1>

        <form onSubmit={handleAddTask} className="flex flex-col space-y-3 mb-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex flex-col w-full">
              <label htmlFor="taskTitle" className="text-sm font-semibold text-gray-600 mb-1">Judul Tugas</label>
              <input
                id="taskTitle"
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Contoh: Beli bahan makanan"
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="taskDescription" className="text-sm font-semibold text-gray-600 mb-1">Deskripsi (Opsional)</label>
            <textarea
              id="taskDescription"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
              placeholder="Contoh: Rencana menu untuk seminggu"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex flex-col">
              <label htmlFor="taskCategory" className="text-sm font-semibold text-gray-600 mb-1">Kategori</label>
              <select
                id="taskCategory"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="umum">Umum</option>
                <option value="belanja">Belanja</option>
                <option value="pekerjaan">Pekerjaan</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="taskPriority" className="text-sm font-semibold text-gray-600 mb-1">Prioritas</label>
              <select
                id="taskPriority"
                value={priorityInput}
                onChange={(e) => setPriorityInput(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="taskDueDate" className="text-sm font-semibold text-gray-600 mb-1">Tanggal Jatuh Tempo</label>
              <input
                id="taskDueDate"
                type="date"
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-600 mb-1 opacity-0">Tambah</label>
              <button type="submit" className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center" disabled={loading}>
                {loading ? <><LoaderCircle size={20} className="animate-spin mr-2" /> Menambahkan...</> : 'Tambah'}
              </button>
            </div>
          </div>
        </form>

        <hr className="my-6 border-gray-200" />
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Pencarian & Filter Tugas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label htmlFor="filterSearch" className="text-sm font-semibold text-gray-600 mb-1">Cari Tugas</label>
              <input
                id="filterSearch"
                type="text"
                placeholder="Judul atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="filterStatus" className="text-sm font-semibold text-gray-600 mb-1">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Status</option>
                <option value="completed">Selesai</option>
                <option value="incomplete">Belum Selesai</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="filterCategory" className="text-sm font-semibold text-gray-600 mb-1">Kategori</label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Kategori</option>
                <option value="umum">Umum</option>
                <option value="belanja">Belanja</option>
                <option value="pekerjaan">Pekerjaan</option>
                <option value="lain-lain">Lain-lain</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="filterPriority" className="text-sm font-semibold text-gray-600 mb-1">Prioritas</label>
              <select
                id="filterPriority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Prioritas</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="space-y-4">
          {showPlaceholder && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
              <ClipboardList size={64} className="mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Belum ada tugas!</h2>
              <p className="text-center">Mulai rencanakan hari Anda dengan menambahkan tugas baru di atas.</p>
            </div>
          )}

          {filteredTasks.length === 0 && !loading && !showPlaceholder && (
            <p className="text-center text-gray-500">Tidak ada tugas yang sesuai dengan kriteria Anda.</p>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="task-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <AnimatePresence>
                    {filteredTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              ...(snapshot.isDragging ? { opacity: 0.7 } : {})
                            }}
                            className="mb-4"
                          >
                            <motion.div
                              layout
                              initial={{ opacity: 0, y: 50 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, transition: { duration: 0.2 } }}
                            >
                              <TaskItem key={task.id} task={task}/>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </AnimatePresence>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </main>
  );
}