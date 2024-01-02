import { useEffect, useState } from 'react';
import { AuthData } from '../auth/authentication';
import { null_uuid } from '../constants/uuidConstants';
import { useNavigate } from "react-router-dom";
import { base_url } from '../constants/urlConstants';
import { test_img_data } from '../constants/test_constant';
import { setCommentRange } from 'typescript';
import Books from '../components/book';
function Dashboard() {
  const { user, update_comm_id } = AuthData();
  const [books, setBooks] = useState([]);
  const [comm, setComm] = useState(null);
  const [images, setImages] = useState([]);
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
  useEffect(()=>{
    //on mount
    if (user.community_id != null_uuid ){
      fetch_comm();
      fetch_books();
    }
  }, []);

  function fetch_comm(){
    try{
      get_community();
    }
    catch (error){
      console.log(error);
    }
  }

  function fetch_books(){
    try{
      get_books();
    }
    catch(error){
      console.log(error);
    }
  }

  // useEffect(() => {
  //   setImages([])
  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImages((prev) => [...prev, reader.result]);
  //   };
  //   for (let x = 0; x <books.length; x ++){
  //     console.log(books[x].image.data)
  //     reader.readAsDataURL(new Blob([books[x].image.data]))
  //   }
  // }, [books])

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
    const url = base_url+ "community/" + user.community_id;
    const result = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    const responet = await result.json();
    return new Promise((resolve, reject) => {
      if (responet.id == null_uuid){
        reject("internal error while fetching comms")
      }
      else{
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
      {comm && <p>{comm.community_name}</p> }
      <button onClick={leave_comm}>Leave Community</button>
      <button onClick={navigate_to_post_book}>Post a book</button>
      <br></br>
      <ul className='books'>
        {books.map((curr_book, index) => {
          return <Books key={index} name={curr_book.book.name} author={curr_book.book.author} data = {curr_book.image.data} />
        })}
      </ul>
    </>
  )

}

export default Dashboard