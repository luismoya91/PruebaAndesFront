import { useState,ChangeEvent,FormEvent } from "react";
import axios from "axios";
import { TaskType, UserLoggedType, UserType,TaskObjectType } from "../types";
import toast from 'react-hot-toast';
import $ from 'jquery';

export default function useUser(){
    const token = localStorage.getItem('token-user')

    const [user, setUser] = useState<UserType>({
        name:"",
        email:"",
        password:"",
        c_password:"",
    })
    
    const [task,setTask] = useState<TaskType>({
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
    const [userLogged, setUserLogged] = useState<UserLoggedType>()

    const [tasks, setTasks] = useState([])



    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=>{
        setUser({
            ...user,
            [e.currentTarget.id]: e.currentTarget.value
        })
    }

    const handleChangeTask = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=>{
        setTask({
            ...task,
            [e.currentTarget.id]: e.currentTarget.value
        })
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if (validateData()) {
            $('#btnSubReg').attr('disabled',1)
            const form_data = new FormData(e.currentTarget)
            axios({
                url: import.meta.env.VITE_API_URL_REGISTER,
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                    },
                data: form_data,
            }).then((res) => {
                if(res.status==200){
                    toast.success(res.data.message)
                }
                $('#btnSubReg').removeAttr('disabled')
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                setUser({
                    name:"",
                    email:"",
                    password:"",
                    c_password:"",
                })
            }).catch((err) => {
                handleErrors(err.response.data.details)
            })
        }            
    }

    const validateData=()=>{
        let validated = true
        if( user.password.length <= 6){
            toast.error('La contraseña debe tener mimímo 7 caracteres')
            validated = false
        }
        
        if(user.password !== user.c_password){
            toast.error('La contraseña no coincide')
            validated = false
        }
        return validated
    }

    const handleErrors = (details:object)=>{
        let errorText = 'Ha ocurrido uno o más errores: \n\n'
        for (const [key, value] of Object.entries(details)) {
            errorText += `${key.toUpperCase()}: ${value} \n`
            }
        errorText += `\n`
        toast.error(errorText)
        $('#btnSubReg').removeAttr('disabled')
    }

    const handleLogut = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        axios({
            url: import.meta.env.VITE_API_URL_LOGOUT,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
                }
        }).then((res) => {
            toast.success(`Salida exitosa`)
            localStorage.setItem('token-user', "")
            setTimeout(() => {
                window.location.replace("/")
            },1000)
        }).catch((err) => {
            toast.error(err.response.data.message)
            
        })
    }


    return{
        user,
        userLogged,
        task,
        tasks,
        handleChange,
        handleSubmit,
        setUserLogged,
        setTasks,
        setTask,
        handleLogut,
        handleChangeTask,
    }

}
