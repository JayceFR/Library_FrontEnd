import React, { useEffect, useRef, useState } from "react"
import { AuthData } from "../auth/authentication";
import Message from "../components/message";
import User from "../components/user";
import { base_url, socket_url } from "../constants/urlConstants";
import Books from "../components/book";
import Request from "../components/request";
import { null_uuid } from "../constants/uuidConstants";
import { isTemplateLiteralTypeNode } from "typescript";
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

//User object should have a unseen_message member varaible as well 
//Message should even have a member variable of seen/ unseen 
function Messages() {
  //Message socket connection 
  const [socket, setSocket] = useState(null);
  //Input
  const [input, setInput] = useState("");
  const [receivers, setReceivers] = useState([]) // Used to hold the left pane members
  const [curr_receiver, setCurrReceiver] = useState(null) //Used to hold a member of the receivers
  const { user, update_messages, messages, setMessages, active_conns, notify } = AuthData();
  //Search socket connection
  const [search_socket, setSearchSocket] = useState(null);
  const [search, setSearch] = useState("");
  const [search_users, setSearchUsers] = useState([]);
  //Auto scroll
  const bottomOfRef = useRef(null);
  //Fetching books 
  const [books, setBooks] = useState([]);
  const [request_book, setRequestBook] = useState(null);
  useEffect(() => {
    //On mount
    const ws = new WebSocket(socket_url + "ws?id=" + user.id);
    ws.onopen = () => {
      console.log("Websocket connected to successfully");
    };

    ws.onclose = () => {
      console.log("Websocket disconnected");
      //Reconnection
    };
    setSocket(ws)
    //Get the messages from the database for the specific recepient
    //Connecting to the search socket
    const sws = new WebSocket(socket_url + "search?id=" + user.id);
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
    fetch_chat(user.id);
    //Close the websocket connection
    return () => {
      ws.close();
      sws.close();
    }

  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Inside the on message")
        console.log(message);
        //Need to perform a check whether the message is from the current receiver
        console.log(curr_receiver)
        let current_message_list = false
        if (curr_receiver) {
          if (message.SenderID == curr_receiver.id || message.ReceiverID == curr_receiver.id) {
            //The message belongs in the current list of messages
            setMessages((prev_message) => [...prev_message, message]);
            current_message_list = true
          }
        }
        if (!current_message_list) {
          let present = false;
          for (let x = 0; x < receivers.length; x++) {
            if (message.SenderID == receivers[x].id) {
              console.log("I am here")
              let curr_rec = receivers[x]
              curr_rec.bubble += 1
              setReceivers((prev_receivers) => [curr_rec, ...prev_receivers.slice(0, x).concat(...prev_receivers.slice(x + 1))])
              present = true;
            }
          }
        }
      }
    }
  }, [socket, curr_receiver, receivers]) //curr_receiver is added so the function has access to the latest value

  useEffect(() => {
    if (bottomOfRef.current) {
      bottomOfRef.current.scrollIntoView({});
    }
  }, [messages]);

  useEffect(() => {
    for (let y = 0; y < receivers.length; y++) {
      let present = false;
      for (let x = 0; x < active_conns.length; x++) {
        if (receivers[y].id == active_conns[x].id) {
          let rec = receivers[y];
          present = true;
          rec.active = true;
          setReceivers((prev_receivers) => [...prev_receivers.slice(0, y).concat(rec).concat(...prev_receivers.slice(y + 1))])
        }
      }
      if (!present) {
        if (receivers[y].active) {
          //user is no longer active
          console.log("i am here");
          let rec = receivers[y];
          rec.active = false;
          setReceivers((prev_receivers) => [...prev_receivers.slice(0, y).concat(rec).concat(...prev_receivers.slice(y + 1))])
        }
      }
    }

  }, [active_conns])

  const get_curr_book = async (id, from_date, to_date) => {
    const url = base_url + "book/" + id
    const result = await fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const respone = await result.json();
    console.log(respone)
    const obj = {
      book: respone,
      from: from_date,
      to: to_date,
    }
    return new Promise((resolve, reject) => {
      if (respone.ID == null_uuid) {
        reject("book fetching failed");
      }
      else {
        const data = {
          "content": JSON.stringify(obj), //book's id
          "sender_id": user.id,
          "receiver_id": curr_receiver.id,
          "request": true,
        }
        socket.send(JSON.stringify(data))
        //Post the notification
        notify("New Request received for book '" + respone.name + "' from " + user.first_name, curr_receiver.id);
        resolve("success")
      }
    })
  }

  function update(val) {
    setSearch(val);
    search_socket.send(val);
  }

  const fetch_chat = async (id) => {
    try {
      await get_chat(id);
    }
    catch (error) {
      console.log(error)
    }
  }

  const get_chat = async (id) => {
    const url = base_url + "chat/" + id;
    const result = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const response = await result.json();
    console.log("chat history fetched");
    console.log(response);
    setReceivers(response);
    return new Promise((resolve, reject) => {
      resolve("success");
    })
  }

  const get_book = async (id) => {
    const url = base_url + "bookuser/" + id
    const result = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    const response = await result.json();
    console.log(response);
    setBooks(response);
  }

  //used to update the message tab i.e. right pane
  function update_receiver(receiver) {
    setCurrReceiver(receiver);
    if (curr_receiver) {
      if (curr_receiver.id != receiver.id) {
        //Refetch the messages
        do_update_messages(user.id, receiver.id);
        try {
          get_book(receiver.id);
        } catch (error) {
          console.log(error);
        }
      }
    }
    else {
      do_update_messages(user.id, receiver.id);
      try {
        get_book(receiver.id);
      }
      catch (error) {
        console.log(error);
      }
    }
    if (receiver.bubble > 0) {
      for (let x = 0; x < receivers.length; x++) {
        if (receivers[x].id == receiver.id) {
          let curr_rec = receivers[x];
          curr_rec.bubble = 0;
          setReceivers((prev_receivers) => [...prev_receivers.slice(0, x).concat(curr_rec).concat(...prev_receivers.slice(x + 1))])
        }
      }
    }
  }

  const do_update_messages = async (sid, rid) => {
    try {
      await update_messages(sid, rid);
    }
    catch (error) {
      console.log(error);
    }
  }

  function post_message(e) {
    e.preventDefault();
    const data = {
      "content": input,
      "sender_id": user.id,
      "receiver_id": curr_receiver.id,
      "request": false,
    }
    setInput("")
    //sort it in the order
    console.log("Current receiver inside the post_message")
    console.log(curr_receiver)
    let pos = -1
    let present = false;
    for (let x = 0; x < receivers.length; x++) {
      if (receivers[x].id == curr_receiver.id) {
        present = true;
        pos = x;
      }
    }
    let cloned_curr_receiver = JSON.parse(JSON.stringify(curr_receiver));
    if (!present) {
      setReceivers((prev_receivers) => [cloned_curr_receiver, ...prev_receivers])
    }
    else {
      setReceivers((prev_receivers) => [cloned_curr_receiver, ...prev_receivers.slice(0, pos).concat(...prev_receivers.slice(pos + 1))])
    }
    socket.send(JSON.stringify(data))
  }

  const update_message = async (id, content, pos) => {
    const url = base_url + "chat/" + id;
    console.log(content);
    const data = {
      "content": content,
    }
    const result = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const response = await result.json()
    console.log(response);
    return new Promise((resolve, reject) => {
      console.log(pos);
      setMessages((prev) => [...prev.slice(0, pos).concat(response).concat(...prev.slice(pos + 1))])
      resolve("success");
    })
  }

  const accept_request = async (book_id, from, to, user_id, message_id, pos) => {
    const data = {
      "state": "borrow",
      "from": from,
      "to": to,
      "userid": user_id,
    }
    const url = base_url + "book/" + book_id;
    const result = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const response = await result.json();
    console.log(response)
    if (response.Error) {
      alert(response.Error);
    }
    else {
      //update the messages table with the new request
      const obj = {
        book: response,
        from: from,
        to: to,
      }
      try {
        update_message(message_id, JSON.stringify(obj), pos)
      }
      catch (error) {
        console.log(error)
      }
    }
    return new Promise((resolve, reject) => {
      resolve("success");
    })
  }

  const delete_message = async (id, pos) => {
    const url = base_url + "chat/" + id;
    const result = await fetch(url, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    const response = await result.json();
    console.log(response);
    setMessages((prev) => [...prev.slice(0, pos).concat(...prev.slice(pos + 1))]);
    return new Promise((resolve, reject) => {
      resolve("success");
    })
  }

  const remove_request = async (book_id, from, to, message_id, pos) => {
    const url = base_url + "book/" + book_id;
    const data = {
      "state": "return",
      "from": from,
      "to": to,
      "userid": user.id
    }
    const result = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    })
    const response = await result.json()
    console.log(response)
    try {
      delete_message(message_id, pos);
    }
    catch (error) {
      console.log(error);
    }
    return new Promise((resolve, reject) => {
      resolve("success");
    })
  }

  function do_remove_request(book_id, from, to, id, pos) {
    try {
      remove_request(book_id, from, to, id, pos);
    }
    catch (error) {
      console.log(error);
    }
  }

  function do_accept_request(book_id, from, to, id, pos) {
    try {
      accept_request(book_id, from, to, curr_receiver.id, id, pos);
    }
    catch (error) {
      console.log(error);
    }
  }


  function post_request(id, from_date, to_date) {
    try {
      get_curr_book(id, from_date, to_date);
      console.log("Request book", request_book);
    }
    catch (error) {
      console.log(error)
    }
    //sort it in the order
    console.log("Current receiver inside the post_message")
    console.log(curr_receiver)
    let pos = -1
    let present = false;
    for (let x = 0; x < receivers.length; x++) {
      if (receivers[x].id == curr_receiver.id) {
        present = true;
        pos = x;
      }
    }
    let cloned_curr_receiver = JSON.parse(JSON.stringify(curr_receiver));
    if (!present) {
      setReceivers((prev_receivers) => [cloned_curr_receiver, ...prev_receivers])
    }
    else {
      setReceivers((prev_receivers) => [cloned_curr_receiver, ...prev_receivers.slice(0, pos).concat(...prev_receivers.slice(pos + 1))])
    }
  }


  return (
    <>
      <br></br>
      <br></br>
      <div className="row">
        <div className="chat">
          <p className="chat_title">Chats</p>
          <input type="text" value={search} placeholder="Search" onChange={e => { update(e.target.value) }} />
          {search.trim().length != 0 && search_users.map((curr_user, index) => {
            return <User active={curr_user.active} key={index} name={curr_user.first_name} bubble={curr_user.bubble} user={curr_user} func={update_receiver} />
          })}
          {search.trim().length == 0 && receivers.map((curr_user, index) => (
            <User active={curr_user.active} key={index} name={curr_user.first_name} bubble={curr_user.bubble} user={curr_user} func={update_receiver} />
          ))}
        </div>
        <div className="dash">
          <div className="messages">
            {messages.map((curr_message, index) => {
              if (curr_message.Request) {
                if (curr_message.SenderID == user.id) {
                  return <Request
                    pos={index}
                    id={curr_message.ID}
                    key={index}
                    remfunc={do_remove_request}
                    func={do_accept_request}
                    content={curr_message.Content}
                    left={false}></Request>
                }
                if (curr_message.SenderID != user.id) {
                  return <Request
                    pos={index}
                    id={curr_message.ID}
                    key={index}
                    remfunc={do_remove_request}
                    func={do_accept_request}
                    content={curr_message.Content}
                    left={true}></Request>
                }
              }
              else {
                if (curr_message.SenderID == user.id) {
                  return <Message key={index} content={curr_message.Content} left={false}></Message>
                }
                if (curr_message.SenderID != user.id) {
                  return <Message key={index} content={curr_message.Content} left={true}></Message>
                }
              }
            })}
            <br></br>
            <div className="message empty" ref={bottomOfRef}></div>
          </div>

          <form onSubmit={post_message}>
            <input className="input_bx" type="text" value={input} placeholder="Type a message..." onChange={e => { setInput(e.target.value) }} />
            <input className="send" type="image" src="../../Assets/send_icon.png" />
          </form>
        </div>
        <div className="chatbooks">
          {curr_receiver &&
            <>
              <div className="user_info">
                <img src="../../Assets/user_white.png" alt="Avatar"></img>
                <p>{curr_receiver.first_name}</p>
              </div>
              <div className="book_menu">
                <ul className="bookss">
                  {books.map((curr_book, index) => {
                    return <Books
                      borrowed={curr_book.book.borrowed}
                      menu={true} func={post_request}
                      id={curr_book.book.ID}
                      key={index}
                      name={curr_book.book.name}
                      author={curr_book.book.author}
                      data={curr_book.image.data} />
                  })}
                </ul>
              </div>
            </>
          }
        </div>
      </div>

    </>
  )

}

export default Messages