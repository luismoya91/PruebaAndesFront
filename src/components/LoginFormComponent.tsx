import { UserType,UserLoggedType } from '../types'
import { ChangeEvent,FormEvent } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import $ from 'jquery';

type LoginFormComponentProps = {
    user: UserType,
    handleChange: (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=> void,
    setUserLogged:  (user:UserLoggedType)=>void,
}


export default function LoginFormComponent({user, handleChange,setUserLogged }:LoginFormComponentProps) {

    const history = useNavigate()
    const submit = async (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        $('#btnSubLog').attr('disabled',1)
        axios({
            url: import.meta.env.VITE_API_URL_LOGIN,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
            data: JSON.stringify(user),
        }).then((res) => {
            localStorage.setItem('token-user',res.data.data.access_token)  
            $('#btnSubLog').removeAttr('disabled')
            toast.success(`Bienvenido ${user.name}`)
            setTimeout(() => {
                setUserLogged({
                    name:user.name,
                    email:user.email,
                    password:"",
                    c_password:"",
                    id:res.data.data.user_id,
                    auth:true,
                })
                history("/home",{state:{
                    name:res.data.data.name,
                    email:user.email,
                    password:"",
                    c_password:"",
                    id:res.data.data.user_id,
                    auth:true,
                }})
            }, 1000);
        }).catch((err) => {
            toast.error(err.response.data.message)
            $('#btnSubLog').removeAttr('disabled')
        })
    }

  return (
    <form className="space-y-4 md:space-y-6" action="#" onSubmit={submit}>
        <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="alguien@algo.com" 
            value={user.email}
            onChange={handleChange}
            required />
        </div>
        <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
            <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            value={user.password}
            onChange={handleChange}
            required />
        </div>
        
        <button id='btnSubLog' type="submit" className="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Ingresar</button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            No tienes una cuenta aún? <a href="/registro" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrar</a>
        </p>
    </form>
         
  )
}
