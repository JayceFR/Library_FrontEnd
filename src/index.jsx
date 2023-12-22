import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import { Route, Routes } from 'react-router-dom'
import "./style.css"
import Authenticaiton, { AuthData } from './auth/authentication.jsx'
import { nav } from './constants/navConstants.jsx'

function App(){
  const {user} = AuthData();
  return (
    <Routes>
      {
        nav.map((curr_route, index) => {
          if (curr_route.isPrivate && user.is_logged_in){
            return <Route key={index} path={curr_route.path} element={curr_route.element}/>
          }
          else if (!curr_route.isPrivate){
            return <Route key={index} path={curr_route.path} element={curr_route.element}/>
          }
          else{
            return false
          }
        })
      }
    </Routes>
  )
}

export default App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticaiton />
    </BrowserRouter>
  </React.StrictMode>,
)
