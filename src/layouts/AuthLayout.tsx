import { ChangeEvent } from 'react'
import { UserType } from '../types'
import LoginFormComponent from "../components/LoginFormComponent";
import { Toaster } from 'react-hot-toast';
type IndexViewProps = {
    user: UserType,
    handleChange:(e:  ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>)=>void,    
}

export default function AuthLayout() {
  return (
    <>
        <section className="bg-gray-50 dark:bg-gray-900">
            <Toaster/>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src="./public/images/logo.png" alt="logo" />
                    LuisMiChat    
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Inicia sesión para empezar.
                    </h1>
                    <LoginFormComponent
                        user={user}
                        handleChange={handleChange}
                    />
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}
