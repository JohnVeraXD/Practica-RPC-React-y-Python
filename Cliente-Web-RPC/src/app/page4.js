'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const TABLE_HEAD = ["ID", "Titulo", "Descripción", ""];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.post('http://localhost:4099/jsonrpc', {
        jsonrpc: '2.0',
        method: 'read_tasks',
        params: [],
        id: 1
      });
      // La respuesta puede venir en forma de un objeto, por lo que debes extraer el valor correspondiente.
      if (response.data.result) {
        setTasks(response.data.result);
      } else {
        console.error('Error in server response:', response.data.error);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4099/jsonrpc', {
        jsonrpc: '2.0',
        method: 'create_task',
        params: [newTask.title, newTask.description],
        id: 2
      });
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.post('http://localhost:4099/jsonrpc', {
        jsonrpc: '2.0',
        method: 'delete_task',
        params: [id],
        id: 3
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className=" w-full h-ful items-center text-center">
      <h1>Task Manager</h1>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <Button type="submit">Add Task</Button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task[0]}>
            <h3>{task[1]}</h3>
            <p>{task[2]}</p>
            <button onClick={() => handleDeleteTask(task[0])}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    
  );
}
