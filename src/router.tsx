import { BrowserRouter ,Routes, Route } from "react-router-dom"
import Protected from "./routes/PrivateRoute";
import IndexView from "./views/IndexView"
import RegisterView from "./views/RegisterView"
import useUser from './hooks/useUser'
import HomeView from "./views/HomeView"

export default function Router(){

    const {user,task,tasks,handleChange,handleSubmit,setTasks, setTask,handleLogut,setUserLogged,handleChangeTask} = useUser()

    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={
              <IndexView
              user={user}
              handleChange = { handleChange }
              setUserLogged = { setUserLogged}
              
              />
            }/>
            <Route path="/registro" element={
              <RegisterView
                user={user}
                handleChange = { handleChange }
                handleSubmit = { handleSubmit }
              />
              }
            />
            <Route element={
              <Protected/>
            }>        
              <Route path="/home" element={
                <HomeView 
                  task={task}
                  tasks={tasks} 
                  setTasks = {setTasks}
                  handleLogut = {handleLogut}
                  handleChangeTask = {handleChangeTask}
                  setTasks = {setTasks}
                  setTask = {setTask}
                />
              } />
            </Route>
            </Routes>
        </BrowserRouter>
    )
}