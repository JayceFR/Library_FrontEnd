import React, { useEffect, useState } from "react"
import { AuthData } from "../auth/authentication";
import Message from "../components/message";
import Input from "../components/input";
import User from "../components/user";
import { base_url } from "../constants/urlConstants";
//Sample message sent to the socket
/*
{"content":"hello", 
"senderid" : "02a42340-2b9b-4acd-b788-12dfb56c368d", 
"receiverid" : "e653a529-b3d5-4775-8939-409aaa6e151a"}
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
  //Message socket connection 
  const [socket, setSocket] = useState(null);
  //Input
  const [input, setInput] = useState("");
  const [receivers, setReceivers] = useState([]) // Used to hold the left pane members
  const [curr_receiver, setCurrReceiver] = useState(null) //Used to hold a member of the receivers
  const {user, update_messages, messages, setMessages} = AuthData();
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
      console.log(message);
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
  function update_receiver(receiver){
    if (curr_receiver != receiver){
      //Now update the pane
      setCurrReceiver(receiver);
      console.log("Updated the receiver")
      console.log(receiver)
      //Refetch the messages
      do_update_messages(user.id, receiver.id)
      //Check if present in the left pane
    }
  }

  const do_update_messages = async (sid, rid) => {
    try{
      await update_messages(sid, rid);
    }
    catch(error){
      console.log(error);
    }
  }

  function post_message(e){
    e.preventDefault();
    const data = {
      "content": input,
      "sender_id": user.id,
      "receiver_id": curr_receiver.id
    }
    setInput("")
    socket.send(JSON.stringify(data))
  }

  return(
    <>
    <br></br>
    <br></br>
    <div className="row">
      <div className="chat">
        <p className="chat_title">Chats</p>
        <input type="text" value={search} placeholder="Search" onChange={e => {update(e.target.value)}}/>
        {search.trim().length != 0 && search_users.map((curr_user, index) => (
          <User key={index} name={curr_user.first_name} user = {curr_user} func={update_receiver}/>
        ))}
      </div>
      <div className="dash">
        <div className="messages">
          {messages.map((curr_message, index) => (
            curr_message.SenderID == user.id ? <React.Fragment key={index}> <Message key={index} content={curr_message.Content} left = {false}></Message> <br></br> </React.Fragment>: <React.Fragment key={index}><Message key={index} content={curr_message.Content} left = {true}></Message> <br></br> </React.Fragment>
          ))}
        </div>
        <form onSubmit={post_message}>
          <input className="input_bx" type="text" value={input} placeholder="Type a message..." onChange={e => {setInput(e.target.value)}}/>
          <input className="send" type="image" src="../../Assets/send_icon.png"/>
        </form>
      </div>
    </div>
    
    </>
  )

}

export default Messages