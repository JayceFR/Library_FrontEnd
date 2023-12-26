import { useEffect, useState } from "react"
import { AuthData } from "../auth/authentication";
import Message from "../components/message";
import Input from "../components/input";
import User from "../components/user";
//Sample message sent to the socket
/*
{"content":"hello", 
"sender_id" : "02a42340-2b9b-4acd-b788-12dfb56c368d", 
"receiver_id" : "e653a529-b3d5-4775-8939-409aaa6e151a"}
*/
//Sample message being returned both by the socket and the db
/*
{ID: 'f6fcc64c-8ecc-40de-86f2-36db2f0f1e29', 
Content: 'hello', 
SenderID: 'e653a529-b3d5-4775-8939-409aaa6e151a', 
ReceiverID: '02a42340-2b9b-4acd-b788-12dfb56c368d', 
SentAt: '2023-12-26T11:19:24.35101199Z'}
*/
function Messages(){
  const [messages, setMessages] = useState([]);
  //Message socket connection 
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [receivers, setReceivers] = useState([]) // Used to hold the left pane members
  const [curr_receiver, setCurrReceiver] = useState(null) //Used to hold a member of the receivers
  const {user} = AuthData();
  //Search socket connection
  const [search_socket, setSearchSocket] = useState(null);
  const [search, setSearch] = useState("");
  const [search_users, setSearchUsers] = useState([]);
  useEffect(()=>{
    //On mount
    const ws = new WebSocket("ws://localhost:8080/ws?id=" +user.id);
    ws.onopen = () => {
      console.log("Websocket connected to successfully");
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message.Content);
      setMessages((prev_message)=>[...prev_message, message]);
    }
    ws.onclose = () => {
      console.log("Websocket disconnected");
      //Reconnection
    };
    setSocket(ws)
    //Get the messages from the database for the specific recepient

    //Connecting to the search socket
    const sws = new WebSocket("ws://localhost:8080/search");
    sws.onopen = () => {
      console.log("Search Websocket connected to successfully");
    };
    sws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      setSearchUsers(message);
    }
    sws.onclose = () => {
      console.log("Search Websocket disconnected");
      //Reconnection
    };
    setSearchSocket(sws);

    //Close the websocket connection
    return () => {
      ws.close();
      sws.close();
    }
    
  }, []);

  function update(val){
    setSearch(val);
    search_socket.send(val);
  }

  //used to update the message tab i.e. right pane
  function update_receiver(user){
    if (curr_receiver != user){
      //Now update the pane
      setCurrReceiver(user);
      console.log("Updated the user")
      console.log(user)
      //Refetch the messages
      //Check if present in the left pane
    }
  }

  return(
    <>
    <br></br>
    <br></br>
    <div className="row">
      <div className="chat">
        <p className="chat_title">Chats</p>
        <datalist id="search_list">
          {search_users.map((curr_user, index) => (
            <option key={index} value={curr_user.first_name} />
          ))}
        </datalist>
        <input list="search_list" type="text" value={search} placeholder="Search" onChange={e => {update(e.target.value)}}/>
        <User name="Jayce" onclick_func = {setCurrReceiver} id = {"8383"}/>
      </div>
      <div className="dash">
        <div className="messages">
          <Message content = "Helllo " left = {true}></Message>
          <br></br>
          <Message content = "Hi" left = {false}></Message>
        </div>
        <input type="text" value={input} placeholder="Type a message..." onChange={e => {setInput(e.target.value)}}/>
      </div>
    </div>
    
    </>
  )

}

export default Messages