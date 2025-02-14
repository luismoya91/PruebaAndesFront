import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  return localStorage.getItem('token-user') ? <Outlet /> : <Navigate to="/" />;
};

export default Protected;