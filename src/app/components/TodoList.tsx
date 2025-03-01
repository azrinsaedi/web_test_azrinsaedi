'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Todo {
  id: string;
  activity: string;
  price: number;
  type: string;
  booking: boolean;
  accessibility: number;
}

const typeOptions = [
  { value: 'education', label: 'Education' },
  { value: 'recreational', label: 'Recreational' },
  { value: 'social', label: 'Social' },
  { value: 'diy', label: 'DIY' },
  { value: 'charity', label: 'Charity' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'relaxation', label: 'Relaxation' },
  { value: 'music', label: 'Music' },
  { value: 'busywork', label: 'Busywork' },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activity, setActivity] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [type, setType] = useState('');
  const [booking, setBooking] = useState(false);
  const [accessibility, setAccessibility] = useState(0.5);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
    setIsMounted(true);
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const addTodo = () => {
    if (activity.trim() === '') return;
    const newTodos = [...todos, { id: uuidv4(), activity, price: price ?? 0, type, booking, accessibility }];
    setTodos(newTodos);
    setActivity('');
    setPrice(null);
    setType('');
    setBooking(false);
    setAccessibility(0.5);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>To-Do List</h2>
      <div className='space-y-4'>
        <input
          type='text'
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded text-gray-700 placeholder-gray-400'
          placeholder='Enter activity'
        />
        <input
          type='number'
          value={price ?? ''}
          onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : null)}
          className='w-full p-2 border border-gray-300 rounded text-gray-700 placeholder-gray-400'
          placeholder='Enter price'
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded text-gray-700 placeholder-gray-400'
        >
          <option value='' disabled selected>
            Select an option
          </option>
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className='flex items-center space-x-2'>
          <input type='checkbox' checked={booking} onChange={(e) => setBooking(e.target.checked)} />
          <span>Booking Required</span>
        </label>
        <label className='block'>
          Accessibility: {accessibility.toFixed(1)}
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={accessibility}
            onChange={(e) => setAccessibility(Number(e.target.value))}
            className='w-full'
          />
        </label>
        <button onClick={addTodo} className='w-full bg-blue-500 p-2 rounded hover:bg-blue-600'>
          Add
        </button>
      </div>

      {/* Show loading for the list */}
      {!isMounted ? (
        <div className='flex justify-center pt-4'>
          <div className='w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
        </div>
      ) : (
        <>
          <h2 className='text-xl font-bold mb-4 pt-5 text-center'>
            {todos.length} {todos.length === 1 ? 'item' : 'items'}
          </h2>
          <ul className='mt-4 space-y-2'>
            {todos.map((todo) => (
              <li key={todo.id} className='p-4 border rounded flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <span className='font-bold'>{todo.activity}</span>
                  <button onClick={() => deleteTodo(todo.id)} className='text-red-500 hover:text-red-700 p-1'>
                    <Trash2 size={20} />
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  <span>
                    <strong>Price:</strong> ${todo.price.toFixed(2)}
                  </span>
                  <span>
                    <strong>Type:</strong> {typeOptions.find((opt) => opt.value === todo.type)?.label || 'Unknown'}
                  </span>
                  <span>
                    <strong>Booking:</strong> {todo.booking ? 'Yes' : 'No'}
                  </span>
                  <span>
                    <strong>Accessibility:</strong> {todo.accessibility.toFixed(1)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
