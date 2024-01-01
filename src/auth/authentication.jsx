//https://auth-db707.hstgr.io/index.php?db=u217768772_
import  { createContext, useContext, useEffect, useState } from "react";
import { null_uuid } from "../constants/uuidConstants";
import App from "../index";
import Nav from "../components/nav";
import { useNavigate } from "react-router-dom";
import { base_url, socket_url } from "../constants/urlConstants";
export const AuthContext = createContext();

export const AuthData = () => useContext(AuthContext);

function Authenticaiton(){
    const [user, setUser] = useState({id:null, first_name : null, email : null, password : null, community_id : null, is_logged_in :false});
    const [mode, setMode] = useState("dark");
    const [messages, setMessages] = useState([]);
    //Active socket connection
    const [active_socket, setAcitveSocket] = useState(null);
    const [active_conns, setActiveConns] = useState([]);

    useEffect(()=>{
        const ws = new WebSocket(socket_url+"active");
        ws.onopen = () =>{
            console.log("Connected to active socket");
        }
        ws.onclose = () =>{
            console.log("Disconnected from active socket");
        }
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            setActiveConns(message);
        }
        setAcitveSocket(ws)
        return () => {
            ws.close();
        }
    }, [])

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
                const data = {
                    "id": user_obj['id'],
                    "type": "add"
                }
                active_socket.send(JSON.stringify(data))
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

    const post_book = async (name, author, isbn, files, types) => {
        console.log(files)
        const url = base_url + "books";
        const data = {
            "owner_id" : user.id, 
            "isbn": isbn, 
            "name": name,
            "author": author
        }
        const result = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const response = await result.json();
        console.log(response)
        if (response.ID == null_uuid){
            console.log("Failure in posting the book")
        }
        else{
            console.log("Successfully posted book")
            try{
                await post_images(files, response.ID, types)
            }
            catch (error){
                console.log(error)
            }
        }
        return new Promise((resolve, reject) => {
            resolve("Success")
        })
    }

    const post_images = async (files, object_id, types) => {
        const url = base_url + "images"
        const formdata = new FormData();
        console.log(files)
        formdata.append("no", files.length.toString())
        for(let x = 1; x <= files.length; x++){
            formdata.append("image" + x.toString(), files[x-1])
            formdata.append("type" + x.toString(), types[x-1])
        }
        formdata.append("id", object_id);
        const result = await fetch(url, {
            method: "POST", 
            headers: {
                'Accept': 'application/json',
            },
            body: formdata
        });
        const response = await result.json();
        return new Promise((resolve, reject) => {
            resolve("success")
        })
    }

        // const post_image = async (file, objcet_id) =>{
    //     const url = base_url + "images"
    //     const formdata = new FormData();
    //     formdata.append("image", file);
    //     formdata.append("id", objcet_id);
    //     const result = await fetch(url, {
    //         method: "POST", 
    //         headers: {
    //             'Accept': 'application/json',
    //         },
    //         body: formdata
    //     });
    //     const response = await result.json();
    //     return new Promise((resolve, reject) => {
    //         resolve("success")
    //     })
    // }

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
        const data = {
            "id": user.id,
            "type": "remove"
        }
        useEffect(()=>{
            navigate("/")
        }, [])
    }

    return (
        <AuthContext.Provider value={{user, login, logout, mode, change_dark, create_comm, update_comm_id, update_messages, messages, setMessages, active_conns, post_book, post_images}}>
            <>
                <Nav/>
                <App/>
            </>
        </AuthContext.Provider>
    )

}

export default Authenticaiton;