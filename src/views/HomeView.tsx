import NavBarComponent from "../components/NavBarComponent";
import { TaskType,TaskObjectType } from "../types"
import { useLocation } from "react-router-dom";
import { useEffect,useState,FormEvent,ChangeEvent } from 'react'
import axios from "axios";
import { Toaster,toast } from "react-hot-toast";
import FormTaskComponent from "../components/FormTaskComponent";
import { CiEdit  } from "react-icons/ci";
import { RiDeleteBin2Line  } from "react-icons/ri";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import $ from 'jquery';


type HomeViewProps = {
    task: TaskType,
    tasks: TaskObjectType[],
    setTasks: (tasks:TaskObjectType[])=>void,
    handleLogut: ()=>void,
    handleChangeTask: (e:  ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=>void,
    setTask: (task:TaskObjectType)=>void,
}


export default function HomeView({
    task,
    tasks,
    setTasks,
    handleLogut,
    handleChangeTask,
    setTask
    
}:HomeViewProps) {
    const location = useLocation()
    const token = localStorage.getItem('token-user')
    const [open, setOpen] = useState(false)
    const [taskEdit,setTaskEdit] = useState<TaskObjectType>({
        id:0,
        name:"",
        description:"",
        created_at:"",
        updated_at:"",
        user:{
            id:0,
            name:"",
            email:"",
            password:"",
            c_password:"",
            auth:false
        }
    })

    const user = location.state

    const handleChangeTaskEdit = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=>{
        setTaskEdit({
            ...taskEdit,
            [e.currentTarget.id]: e.currentTarget.value
        })
    }

    const edit = (id:TaskObjectType['id'])=>{
        setOpen(true)
        const taskToEdit = tasks.find(task =>task.id === id)
        setTaskEdit(taskToEdit)
    }

    const handleSubmitEditTask= (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        $('#btnSubTaskEdit').attr('disabled',1)
        const form_data = new FormData(e.currentTarget)
        axios({
            url: import.meta.env.VITE_API_URL_TASKS+"/"+taskEdit.id,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
                },
            data: form_data,
        }).then((res) => {
            toast.success(res.data.message)
            $('#btnSubTaskEdit').removeAttr('disabled')
            setTaskEdit( {
                id:0,
                name:"",
                description:"",
                created_at:"",
                updated_at:"",
                user:{
                    id:0,
                    name:"",
                    email:"",
                    password:"",
                    c_password:"",
                    auth:false
            }})
            setOpen(false)
        }).catch((err) => {
            toast.error(err.response.data.data.error)  
        })
    }

    const deleteTask = (id:TaskObjectType['id'])=>{
        if(confirm('Desea eliminar la tarea?')){
            axios({
                url: import.meta.env.VITE_API_URL_TASKS+"/"+id,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                    },
            }).then((res) => {
                toast.success(res.data.message)
                setTasks(tasks.filter(function(task){
                    return task.id !== id
                }))
            }).catch((err) => {
                toast.error(err.response.data.data.error)  
            })
        }
    }

    useEffect(()=>{
        axios({
            url: import.meta.env.VITE_API_URL_TASKS,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
                }
        }).then((res) => {
            if(res.data.data.length > 0){
                setTasks(res.data.data)
            }
        }).catch((err) => {
            toast.error(err.response.data.message)
            
        })

    },[setTasks,open])

  return (
    <>
        <section>
            <NavBarComponent
                userLogged={location.state}
                handleLogut = {handleLogut}
            />
            <Toaster/>
            <FormTaskComponent
                task = {task}
                tasks = {tasks} 
                handleChangeTask={handleChangeTask}
                user={location.state}
                setTasks={setTasks}
                setTask = {setTask}
            />
            <div className="relative overflow-x-auto px-30 pb-5 bg-gray-100" >
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <caption className="text-4xl p-2">Listado de tareas</caption>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                #
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nombre tarea
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Descripción
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Usuario
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Fecha creación
                            </th>
                            <th scope="col">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        tasks.map((task:TaskObjectType) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {task.id}
                                </th>
                                <td className="px-6 py-4">
                                    {task.name}
                                </td>
                                <td className="px-6 py-4">
                                    {task.description}
                                </td>
                                <td className="px-6 py-4">
                                    {task.user.name}
                                </td>
                                <td className="px-6 py-4">
                                    {task.created_at}
                                </td>
                                <td>
                                    {(task.user.id === user.id
                                     ? <div><button className="mr-3" onClick={()=>edit(task.id)} title="Editar">
                                            <CiEdit/>
                                        </button>
                                        <button onClick={()=>deleteTask(task.id)} title="Eliminar">
                                            <RiDeleteBin2Line/>
                                        </button>
                                        </div>
                                        :
                                        <div></div>
                                    )}
                                    
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </section>
        <Dialog open={open} onClose={setOpen} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                                    Editar Tarea # {taskEdit.id}
                                </DialogTitle>
                                <div className="mt-2">
                                    <div className="min-h-24 p-6 bg-gray-100 flex items-center justify-center">
                                        <form className="container max-w-screen-lg mx-auto" action="#" onSubmit={handleSubmitEditTask}>
                                            <div>
                                                <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                                                    <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1">
                                                        <div className="lg:col-span-2">
                                                            <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                                            <div className="md:col-span-5">
                                                                <label htmlFor="name">Nombre de la tarea</label>
                                                                <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="Aprobar horas extras" 
                                                                onChange={handleChangeTaskEdit}
                                                                value={taskEdit.name}
                                                                required
                                                                />
                                                            </div>

                                                            <div className="md:col-span-5">
                                                                <label htmlFor="description">Descripción de la tarea</label>
                                                                <textarea name="description" id="description" className="h-30 border mt-1 rounded px-4 w-full bg-gray-50" value={taskEdit.description} placeholder="Revisar cuidadosamente cada una de las planillas..." 
                                                                onChange={handleChangeTaskEdit}
                                                                required
                                                                />
                                                            </div>
                                                            <input type="hidden" name="user_id" value={user.id}/>
                                                    
                                                            <div className="md:col-span-5 text-right">
                                                                <div className="inline-flex items-end">
                                                                <button id="btnSubTaskEdit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Editar</button>
                                                                </div>
                                                            </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                        type="button"
                        data-autofocus
                        onClick={() => setOpen(false)}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                        Cancel
                    </button>
                    </div>
                </DialogPanel>
                </div>
            </div>
        </Dialog>
    </>
  )
}
