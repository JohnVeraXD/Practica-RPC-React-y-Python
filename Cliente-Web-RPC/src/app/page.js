"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon } from "@heroicons/react/24/solid";
import { IoMdCloseCircle } from "react-icons/io";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
  Dialog,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "ID",
  "Titulo",
  "Descripción",
  "Encargado",
  "Estado",
  "Editar",
  "Eliminar",
];

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    encargado: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  // estado para almacenar los datos de la actividad seleccionada para editar
  const [selectedTask, setSelectedTask] = useState(null);

  // estado para controlar si el diálogo de edición está abierto o cerrado
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // función para abrir y cerrar el diálogo de edición
  const handleEditDialogOpen = (task) => {
    setSelectedTask(task);
    setNewTask({
      title: task[1],
      description: task[2],
      encargado: task[3],
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setSelectedTask(null);
    setEditDialogOpen(false);
  };

  // función para listar los datos de las actividades
  const fetchTasks = async () => {
    try {
      const response = await axios.post("http://localhost:4099/jsonrpc", {
        jsonrpc: "2.0",
        method: "leer_actividades",
        params: [],
        id: 1,
      });
      // La respuesta puede venir en forma de un objeto, por lo que debes extraer el valor correspondiente.
      if (response.data.result) {
        console.log(response.data.result);
        setTasks(response.data.result);
      } else {
        console.error("Error in server response:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // función para crear un actividad
  const handleFormSubmit = async (e) => {
    //e.preventDefault();
    try {
      //alert([newTask.title, newTask.description, newTask.encargado]);
      await axios.post("http://localhost:4099/jsonrpc", {
        jsonrpc: "2.0",
        method: "crear_actividad",
        params: [newTask.title, newTask.description, newTask.encargado],
        id: 2,
      });
      setNewTask({ title: "", description: "", encargado: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // función para eliminar una actividad
  const handleDeleteTask = async (id) => {
    try {
      await axios.post("http://localhost:4099/jsonrpc", {
        jsonrpc: "2.0",
        method: "eliminar_actividades",
        params: [id],
        id: 3,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // función para editar los datos
  const handleEditFormSubmit = async (taskId) => {
    try {
      const updatedTitle = newTask.title || selectedTask[1];
      const updatedDescription = newTask.description || selectedTask[2];
      const updatedEncargado = newTask.encargado || selectedTask[3];

      await axios.post("http://localhost:4099/jsonrpc", {
        jsonrpc: "2.0",
        method: "modificar_actividad",
        params: [taskId, updatedTitle, updatedDescription, updatedEncargado],
        id: 4,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <Card className="h-full w-full p-10">
        <Dialog
          size="xs"
          open={editDialogOpen}
          handler={handleEditDialogClose}
          className="bg-transparent shadow-none"
        >
          <Card className="mx-auto w-full max-w-[24rem]">
            <CardBody className="flex flex-col gap-4">
              <Typography
                variant="h4"
                color="blue-gray"
                className=" text-center"
              >
                Editar actividad
              </Typography>
              <Typography
                className="mb-3 font-normal"
                variant="paragraph"
                color="gray"
              >
                Edite los datos de la actividad seleccionada
              </Typography>

              <Input
                label="Titulo"
                size="md"
                type="text"
                name="title"
                value={
                  newTask.title ||
                  (selectedTask ? selectedTask[1] : "")
                }
                onChange={handleInputChange}
              />
              <Input
                label="Descripción"
                size="md"
                type="text"
                name="description"
                value={
                  newTask.description ||
                  (selectedTask ? selectedTask[2] : "")
                }
                onChange={handleInputChange}
              />
              <Input
                label="Encargado"
                size="md"
                type="text"
                name="encargado"
                value={
                  newTask.encargado ||
                  (selectedTask ? selectedTask[3] : "")
                }
                onChange={handleInputChange}
              />
            </CardBody>
            <CardFooter className="pt-0">
              <Button
                variant="gradient"
                onClick={() => {
                  handleEditFormSubmit(selectedTask[0]);
                  handleEditDialogClose();
                }}
                fullWidth
              >
                Guardar cambios
              </Button>
            </CardFooter>
          </Card>
        </Dialog>
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Lista de actividades
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Informacion sobre la actividades a realizar
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button onClick={handleOpen}>Crear una actividad</Button>
              <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
              >
                <Card className="mx-auto w-full max-w-[24rem]">
                  <CardBody className="flex flex-col gap-4">
                    <Typography
                      variant="h4"
                      color="blue-gray"
                      className=" text-center"
                    >
                      Crear una nueva actividad
                    </Typography>
                    <Typography
                      className="mb-3 font-normal"
                      variant="paragraph"
                      color="gray"
                    >
                      Ingresa los datos para registrar una nueva actividad
                    </Typography>

                    <Input
                      label="Titulo"
                      size="md"
                      type="text"
                      name="title"
                      value={newTask.title}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Descripción"
                      size="md"
                      type="text"
                      name="description"
                      value={newTask.description}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Encargado"
                      size="md"
                      type="text"
                      name="encargado"
                      value={newTask.encargado}
                      onChange={handleInputChange}
                    />
                  </CardBody>
                  <CardFooter className="pt-0">
                    <Button
                      variant="gradient"
                      onClick={() => {
                        handleFormSubmit();
                        handleOpen();
                      }}
                      fullWidth
                    >
                      Registrar
                    </Button>
                  </CardFooter>
                </Card>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          {tasks.length === 0 ? (
            <div className=" items-center text-center">
              <Typography variant="h5">
                No hay actividades registradas.
              </Typography>
              <Typography variant="h5">Cree actividades</Typography>
            </div>
          ) : (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task[0]}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {task[0]}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {task[1]}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {task[2]}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {task[3]}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={task[4] ? "Completada" : "Pendiente"}
                          color={task[4] ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Tooltip content="Editar actividad">
                        <IconButton
                          onClick={() => handleEditDialogOpen(task)}
                          variant="text"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                    <td
                      className="p-4 border-b border-blue-gray-50"
                      onClick={() => handleDeleteTask(task[0])}
                    >
                      <Tooltip content="Eliminar actividad">
                        <IconButton variant="text">
                          <IoMdCloseCircle className="h-6 w-6" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <div></div>
        </CardFooter>
      </Card>
    </div>
  );
}
