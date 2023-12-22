import {AuthData} from '../auth/authentication';
import {null_uuid} from '../constants/uuidConstants';
import { useNavigate } from "react-router-dom";
function Dashboard(){
  const {user, update_comm_id} = AuthData();
  console.log(user);
  const navigate = useNavigate();
  function navigate_to_create_community(){
      navigate("/create-community");
  }
  function leave_comm(){
    update_comm_id(user.id, null_uuid);
  }
  if (user.community_id == null_uuid){
    return (
      <>
        <p>Not part of a community?</p>
        <button onClick = {navigate_to_create_community}>Create One</button>
      </>
    )
  }
  return (
      <>
        <p>Dashboard</p>
        <button onClick = {leave_comm}>Leave Community</button>
      </>
  )
  
}

export default Dashboard