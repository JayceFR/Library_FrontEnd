import { useState } from "react";
import Input from "../components/input";
import {password_regex_value } from "../constants/regexConstants";
import { AuthData } from "../auth/authentication";
import { useNavigate } from 'react-router-dom'
function Create_Community(){
  const [name, setName] = useState("");
  const [can_submit, setCan_submit] = useState(false);

  const name_regex = new RegExp(password_regex_value);
  const {user, create_comm, update_comm_id} = AuthData();

  const navigate = useNavigate();
  function navigate_to_dashboard(){
      navigate("/dashboard");
  }
  
  function submit(e) {
    e.preventDefault();
    console.log(name);
    do_update(user.id);
    
  }
  const do_update = async (id) => {
    try{
        await create_comm(name, id);
        navigate_to_dashboard();
    }catch (error){
        console.log(error);
    }
  }
  if (name_regex.test(name)){
    if(!can_submit){
      setCan_submit(true);
    }
  }
  else{
    if(can_submit){
      setCan_submit(false);
    }
  }
  return(
    <>
      <div className="lrform">
          <form onSubmit={submit}>
              <label>Create Community</label>
              <br></br>
              <div className="inputbox">
                  <Input password={false} value={name} change_method={setName} name = {"Community Name"} />
              </div>
              {
                  can_submit && <input className="btn" type='submit' />
              }
          </form>
      </div>
    </>
  )
}
export default Create_Community