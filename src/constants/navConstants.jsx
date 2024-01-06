import Dashboard from "../pages/dashboard";
import Home from "../pages/home";
import Login from "../pages/login";
import Register from "../pages/register";
import Create_Community from "../pages/create-community";
import { useNavigate } from "react-router-dom";
import Messages from "../pages/messages";
import Create_Books from "../pages/create-books";
import Notifications from "../pages/notifications";

export const nav = [
    {path: "/", name:"Home", hide:true, element:<Home/>, isMenu:true, isPrivate:false},
    {path: "/login", name:"Login", hide:false, element: <Login/>, isMenu: false, isPrivate: false},
    {path: "/register", name:"Register", hide:true, element: <Register/>, isMenu: true, isPrivate: false},
    {path: "/dashboard", name:"🏠", hide:false, element: <Dashboard/>, isMenu: true, isPrivate: true},
    {path: "/create-community", name:"Create-Community", hide:false, element: <Create_Community/>, isMenu: false, isPrivate: true },
    {path: "/messages", name: "✉️", hide:false, element: <Messages/> , isMenu : true, isPrivate: true},
    {path: "/post-book", name: "Create-Books", hide:false, element: <Create_Books/>, isMenu: false, isPrivate: true},
    {path: "/notification", name:"🔔", hide:false, element: <Notifications/>, isMenu: true, isPrivate:true}
]