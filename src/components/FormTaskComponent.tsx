import { TaskObjectType, TaskType, UserType } from "../types"
import axios from "axios";
import { toast } from "react-hot-toast";
import $ from 'jquery';
import { ChangeEvent, FormEvent} from 'react'


type FormTaskComponentProps = {
    task: TaskType,
    tasks: TaskObjectType[],
    handleChangeTask: (e:  ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=>void,
    user: UserType,
    setTasks: (task:TaskObjectType[])=>void,
    setTask: (task:TaskObjectType)=>void
}


export default function FormTaskComponent({ task,tasks, handleChangeTask,user, setTasks, setTask }:FormTaskComponentProps) {

    const token = localStorage.getItem('token-user')
    const handleSubmitTask = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        $('#btnSubTask').attr('disabled',1)
        const form_data = new FormData(e.currentTarget)
        
        axios({
            url: import.meta.env.VITE_API_URL_TASKS,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
                },
            data: form_data,
        }).then((res) => {
            toast.success(res.data.message)
            setTasks([...tasks,res.data.data])
            $('#btnSubTask').removeAttr('disabled')
            setTask({
                name:"",
                description:""
            })
        }).catch((err) => {
            toast.error(err.response.data.message)  
        })
    }

  return (
    <>
        <div className="min-h-24 p-6 bg-gray-100 flex items-center justify-center">
            
            <form className="container max-w-screen-lg mx-auto" action="#" onSubmit={handleSubmitTask}>
                <div>
                    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                            <div className="text-gray-600">
                                <p className="font-medium text-lg">Crear un nueva tarea</p>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                <div className="md:col-span-5">
                                    <label htmlFor="name">Nombre de la tarea</label>
                                    <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="Aprobar horas extras" 
                                    onChange={handleChangeTask}
                                    value={task.name}
                                    required
                                    />
                                </div>

                                <div className="md:col-span-5">
                                    <label htmlFor="description">Descripción de la tarea</label>
                                    <textarea name="description" id="description" className="h-30 border mt-1 rounded px-4 w-full bg-gray-50" value={task.description} placeholder="Revisar cuidadosamente cada una de las planillas..." 
                                    onChange={handleChangeTask}
                                    required
                                    />
                                </div>
                                <input type="hidden" name="user_id" value={user.id}/>
                        
                                <div className="md:col-span-5 text-right">
                                    <div className="inline-flex items-end">
                                    <button id="btnSubTask" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Crear</button>
                                    </div>
                                </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </>
  )
}
