'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ADD_TASK_WITH_API_REQUEST, LOAD_TASKS_FROM_LOCAL_STORAGE } from '@/redux/features/tasks/taskSaga';

import TaskItem from '@/components/TaskItem';

export default function HomePage() {
  const [taskInput, setTaskInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('umum');
  const dispatch = useAppDispatch();
  const { tasks, loading, error }  = useAppSelector((state) => state.tasks);

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
          category: categoryInput,
          completed: false,
        },
      });
      setTaskInput('');
    }
  };

  return (
    <main className="bg-gray-100 min-h-screen p-8">
      <div className="container mx-auto max-w-2xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Taskflow
        </h1>

        <form onSubmit={handleAddTask} className="flex mb-6">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Tambahkan tugas baru..."
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />

          <select
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className="p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="umum">Umum</option>
            <option value="belanja">Belanja</option>
            <option value="pekerjaan">Pekerjaan</option>
            <option value="lain-lain">Lain-lain</option>
          </select>

          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            {loading ? 'Menambahkan...' : 'Tambah'}
          </button>
        </form>

        {loading && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <div className="w-4 h-4 rounded-full animate-pulse bg-blue-500"></div>
            <p className="text-blue-500">Menambahkan tugas baru...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {tasks.length === 0 && !loading && (
            <p className="text-center text-gray-500">Belum ada tugas. Tambahkan yang baru!</p>
          )}

          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>
    </main>
  );
}