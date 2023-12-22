import Dashboard from "../pages/dashboard";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Create_Community from "../pages/create-community";
import { useNavigate } from "react-router-dom";

export const nav = [
    {path: "/", name:"Home", element: <Home/>, isMenu: true, isPrivate: false},
    {path: "/login", name:"Login", element: <Login/>, isMenu: false, isPrivate: false},
    {path: "/register", name:"Register", element: <Register/>, isMenu: true, isPrivate: false},
    {path: "/dashboard", name:"Dashboard", element: <Dashboard/>, isMenu: true, isPrivate: true},
  {path: "/create-community", name:"Create-Community", element: <Create_Community/>, isMenu: false, isPrivate: true },
]