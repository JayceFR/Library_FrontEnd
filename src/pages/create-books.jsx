import React, { useState } from "react";
import Input from "../components/input";
import { AuthData } from "../auth/authentication";

function Create_Books() {
  const [title, setTtitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [can_submit, setCan_submit] = useState(false);
  const [image, setImage] = useState(null);
  const [mulitple_images, setMultipleImages] = useState([]);
  const [display_image, setDisplayImage] = useState(null);
  const [display_images, setDisplayImages] = useState([])
  const { post_book } = AuthData();
  if (!can_submit) {
    if (image) {
      setCan_submit(true);
    }
  }
  else {
    if (image == null) {
      setCan_submit(false);
    }
  }
  const handleChangeImage = (e) => {
    let file = e.target.files[0];
    setImage(e.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImage(reader.result);
      };
      reader.readAsDataURL(file)
    }
  };
  const handleChangeImageMultiple = (e) => {
    if (mulitple_images.length <= 3) {
      let file = e.target.files[0];
      setMultipleImages((prev) => [...prev, file]);
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDisplayImages((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file)
      }
    }
  };
  function submit(e) {
    e.preventDefault();
    let files = [image, ...mulitple_images]
    let types = ["profile"]
    for (let x = 1; x <= mulitple_images.length; x++) {
      types.push("normal")
    }
    do_post_book(files, types)
  }
  const do_post_book = async (files, types) => {
    try {
      await post_book(title, author, isbn, files, types);
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className="lrform bookform">
        <form onSubmit={submit}>
          <label>Post Book</label>
          <br></br>
          <div className="inputbox">
            <Input password={false} value={title} change_method={setTtitle} name={"Title"} />
          </div>
          <div className="inputbox">
            <Input password={false} value={author} change_method={setAuthor} name={"Author"} />
          </div>
          <div className="inputbox">
            <Input password={false} value={isbn} change_method={setIsbn} name={"ISBN"} />
          </div>
          <div className="imagebox">
            <input id="pic1" onChange={handleChangeImage} type="file" accept="image/*"></input>
            <label htmlFor="pic1">
              <img className="upload" src="../Assets/upload.png" />
              Choose A Profile Photo
            </label>
            <div id="images">
              {image && <img src={display_image} />}
            </div>
          </div>
          <div className="imagebox">
            <input id="pic2" onChange={handleChangeImageMultiple} type="file" accept="image/*" multiple></input>
            <label htmlFor="pic2">
              <img className="upload" src="../Assets/upload.png" />
              Choose At Most 4 Other Photos
            </label>
            <p id="num-of-files">No of pictures chosen : {display_images.length.toString()}</p>
            <div id="images">
              {display_images.map((curr_pic, index) => {
                return (
                  <img key={index} src={curr_pic} />
                )
              })}
            </div>
          </div>
          {
            can_submit && <input className="btn" type='submit' />
          }
        </form>
      </div>
    </>
  )
}

export default Create_Books;