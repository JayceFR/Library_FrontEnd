import Dashboard from "../pages/dashboard";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Create_Community from "../pages/create-community";
import { useNavigate } from "react-router-dom";
import Messages from "../pages/messages";

export const nav = [
    {path: "/", name:"Home", element: <Home/>, isMenu: true, isPrivate: false},
    {path: "/login", name:"Login", element: <Login/>, isMenu: false, isPrivate: false},
    {path: "/register", name:"Register", element: <Register/>, isMenu: true, isPrivate: false},
    {path: "/dashboard", name:"Dashboard", element: <Dashboard/>, isMenu: true, isPrivate: true},
    {path: "/create-community", name:"Create-Community", element: <Create_Community/>, isMenu: false, isPrivate: true },
    {path: "/messages", name: "Messages", element: <Messages/> , isMenu : true, isPrivate: true}
]