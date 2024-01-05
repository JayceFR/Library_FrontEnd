import { useEffect, useState } from 'react';
import { AuthData } from '../auth/authentication';
import { null_uuid } from '../constants/uuidConstants';
import { useNavigate } from "react-router-dom";
import { base_url } from '../constants/urlConstants';
import Books from '../components/book';
function Dashboard() {
  const { user, update_comm_id } = AuthData();
  const [books, setBooks] = useState([]);
  const [comm, setComm] = useState(null);
  const [class_name, setClass_name] = useState("content hide");
  const [selected_book, setSelectedBook] = useState(null);
  const [timer_pos, setTimerPos] = useState(0);
  const [timer, setTimer] = useState(null);

  const navigate = useNavigate();
  function navigate_to_create_community() {
    navigate("/create-community");
  }
  function leave_comm() {
    update_comm_id(user.id, null_uuid);
  }
  function navigate_to_post_book() {
    navigate("/post-book");
  }
  useEffect(() => {
    //on mount
    if (user.community_id != null_uuid) {
      fetch_comm();
      fetch_books();
    }
  }, []);

  //timer
  useEffect(() => {
    console.log("selected book has changed")
    if (selected_book) {
      if (timer) {
        console.log("cleared timer")
        clearTimeout(timer);
      }
      function update_timer() {
        console.log("Timer ticked by one")
        setTimerPos((prev) => { if (prev >= selected_book.images.length - 1) { return 0; } else { return prev + 1 } });
        setTimer(setTimeout(update_timer, 2000))
      }
      const timeout = setTimeout(update_timer, 2000)
      setTimer(timeout)
    }
  }, [selected_book])

  function fetch_comm() {
    try {
      get_community();
    }
    catch (error) {
      console.log(error);
    }
  }

  function fetch_books() {
    try {
      get_books();
    }
    catch (error) {
      console.log(error);
    }
  }


  function clicked_book(id) {
    setClass_name("content");
    console.log("book with id", id, " is clicked");
    try {
      get_curr_book(id);
    } catch (error) {
      console.log(error)
    }

  }

  const get_curr_book = async (id) => {
    const url = base_url + "book/" + id
    const result = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    const respone = await result.json();
    console.log(respone)
    return new Promise((resolve, reject) => {
      if (respone.book.ID == null_uuid) {
        reject("book fetching failed");
      }
      else {
        setSelectedBook(respone);
        resolve("success")
      }
    })
  }


  const get_books = async () => {
    const url = base_url + "books"
    const result = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    const response = await result.json();
    setBooks(response)
    return new Promise((resolve, reject) => {
      resolve("success");
    })
  }
  const get_community = async () => {
    const url = base_url + "community/" + user.community_id;
    const result = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    const responet = await result.json();
    return new Promise((resolve, reject) => {
      if (responet.id == null_uuid) {
        reject("internal error while fetching comms")
      }
      else {
        setComm(responet);
        resolve("success")
      }
    })
  }
  if (user.community_id == null_uuid) {
    return (
      <>
        <p>Not part of a community?</p>
        <button onClick={navigate_to_create_community}>Create One</button>
      </>
    )
  }

  return (
    <>
      <br></br>
      <br></br>
      <div className='wrapper'>
        <div className='main'>
          {comm && <p>{comm.community_name}</p>}
          <button onClick={leave_comm}>Leave Community</button>
          <button onClick={navigate_to_post_book}>Post a book</button>
          <br></br>
          <ul className='books'>
            {books.map((curr_book, index) => {
              return <Books menu={false} func={clicked_book} id={curr_book.book.ID} key={index} name={curr_book.book.name} author={curr_book.book.author} data={curr_book.image.data} />
            })}
          </ul>
        </div>
        <div className={class_name}>
          {selected_book &&
            <>
              <p>{selected_book.book.name}</p>
              <p>{selected_book.book.author}</p>
              <p>ISBN number : {selected_book.book.ISBN}</p>
              <div className='slides' style={{ maxHeight: '50px', maxWidth: '500px' }}>
                {selected_book.images.map((curr_image, index) => {
                  if (index == timer_pos) {
                    return <img className='slide' src={`data:image/png;base64, ${curr_image.data}`} style={{ width: '100%', maxHeight: '500px', display: 'block' }} />
                  }
                  return <img className='slide' src={`data:image/png;base64, ${curr_image.data}`} style={{ width: '100%', maxHeight: '500px', display: 'none' }} />
                })}
              </div>
              <button>Request To Borrow</button>
            </>}
        </div>
      </div>

    </>
  )

}

export default Dashboard