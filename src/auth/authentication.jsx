//https://auth-db707.hstgr.io/index.php?db=u217768772_
import  { createContext, useContext, useEffect, useState } from "react";
import { null_uuid } from "../constants/uuidConstants";
import App from "../index";
import Nav from "../components/nav";
import { useNavigate } from "react-router-dom";
import { base_url } from "../constants/urlConstants";
export const AuthContext = createContext();

export const AuthData = () => useContext(AuthContext);

function Authenticaiton(){
    const [user, setUser] = useState({id:null, first_name : null, email : null, password : null, community_id : null, is_logged_in :false});
    const [mode, setMode] = useState("dark");
    const [messages, setMessages] = useState([]);

    function change_dark(){
        var r = document.querySelector(':root');
        if (mode == "dark"){
            r.style.setProperty('--bgcolor', '#E2E2E2')
            r.style.setProperty('--txtcolor', '#1B1B1B')
            r.style.setProperty('--empcolor', 'black')
            setMode("light");
        }
        else{
            r.style.setProperty('--txtcolor', '#E2E2E2')
            r.style.setProperty('--bgcolor', '#1B1B1B')
            r.style.setProperty('--empcolor', 'white')
            setMode("dark");
        }
    }

    const navigate = useNavigate();

    const login = async (email, password) => {
        const url = base_url + "login";
        const user_data = {
            "email": email,
            "password": password
        }
        const result = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user_data)
        });
        const user_obj = await result.json();
        return new Promise((resolve, reject) => {
            if (user_obj['id'] == null_uuid){
                console.log("Failed in logging in ")
                setUser({...user_obj, is_logged_in: false})
                reject("Incorrect email or password")
            }
            else{
                console.log("Successfully logged in ")
                setUser({...user_obj, is_logged_in: true})
                resolve("Success")
            }
        })
        
    }

    const update_messages = async (sender_id, receiver_id) => {
        const url = base_url + "messages"
        const message_data = {
        "senderid": sender_id,
        "receiverid" : receiver_id
        }
        const result = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(message_data)
        });
        const response = await result.json();
        console.log(response);
        setMessages(response);
        return new Promise((resolve, reject) => {
            resolve("success")
        })
    }

    const update_comm_id = async (id, comm_id) => {
      const url = base_url + "account/" + id;
      const comm_data = {
        "community_id" : comm_id,
      }
      const result = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(comm_data)
      });
      const response = await result.json();
      return new Promise((resolve, reject) => {
          if (response['community_id'] == null_uuid && comm_id != null_uuid){
              console.log("Failed in updating the db's account with community id")
              reject("Internal error idk why?")
          }
          else{
              console.log("Successfully updated the db's account with community id ")
              setUser({...user, community_id: response['community_id'], is_logged_in: true })
              resolve("Success")
          }
      })
    }

    const create_comm = async (name, id) => {
      const url = base_url + "community";
      const comm_data = {
          "community_name": name
      }
      const result = await fetch(url, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify(comm_data)
      });
      const response = await result.json();
      console.log("response")
      console.log(response)
      const account_data = {
        "community_id": response['id'],
      }
      if (response['id'] != null_uuid && response != "Found another community with the same name"){
        const result2 = await fetch( base_url +"account/" + id, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(account_data)
        });
        const response2 = await result2.json();
        if (response2['community_id'] != null_uuid){
          console.log("Successfully updated account with the id")
        }
        else{
          console.log("Failed in updating account with the id")
        }
      }
      return new Promise((resolve, reject) => {
          if (response['id'] == null_uuid || response == "Found another community with the same name"){
              console.log("Failed in creating the community")
              reject("Internal error idk why?")
          }
          else{
              console.log("Successfully created community")
              setUser({...user, community_id: response['id'], is_logged_in: true})
              //Update the db with it
              resolve("Success")
          }
      })
    }

    const logout = () => {
        setUser({...user_data, is_logged_in: false})
        useEffect(()=>{
            navigate("/")
        }, [])
    }

    return (
        <AuthContext.Provider value={{user, login, logout, mode, change_dark, create_comm, update_comm_id, update_messages, messages, setMessages}}>
            <>
                <Nav/>
                <App/>
            </>
        </AuthContext.Provider>
    )

}

export default Authenticaiton;