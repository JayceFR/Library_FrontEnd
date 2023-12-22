//Front end issues -> Cors problem while calling apis

import { useState, useEffect } from 'react'
import Input from '../components/input'
import { email_regex_value, password_regex_value } from '../constants/regexConstants'
import { useNavigate } from 'react-router-dom'
import { AuthData } from '../auth/authentication'
//import './App.css'


//Sign Up Page
function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [can_submit, setCan_submit] = useState(false)

  const {mode} = AuthData();

  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault()
    console.log(email)
    console.log(password)
    sign_up()
  }

  function navigate_to_login(){
    navigate("/login");
  }

  const email_regex = new RegExp(email_regex_value);
  const password_regex = new RegExp(password_regex_value);

  const sign_up = async () => {

    const base_url = "https://back-end.jaycejefferson3.repl.co/account"
    const user_data = {
      "first_name": name,
      "email": email,
      "password": password
    }
    const result = await fetch(base_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(user_data)
    })

    const result2 = await fetch(base_url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    const json_result = await result2.json()
    console.log(json_result)

  }

  if (email_regex.test(email) && password_regex.test(password)) {
    if (!can_submit) {
      setCan_submit(true)
    }
  }
  else {
    if (can_submit) {
      setCan_submit(false)
    }
  }

  console.log(can_submit)

  return (
    <>
      <div className='lrform'>
        <form onSubmit={submit}>
          <label>Register</label>
          <br></br>
          <div className='inputbox'>
            <Input name={"Name"} password={false} value={name} change_method={setName} />
            {mode=="dark"?<img className="lricon" src="../../Assets/user_black.png"/>:<img className="lricon" src="../../Assets/user_white.png"/>}
          </div>
          <div className='inputbox'>
            <Input name={"Email"} password={false} value={email} change_method={setEmail} />
            {mode=="dark"? <img className = "lricon" src="../../Assets/mail_black.png"/>: <img className = "lricon" src="../../Assets/mail_white.png"/> }
          </div>
          <div className='inputbox'>
            <Input name={"Password"} password={true} value={password} change_method={setPassword} />
            {mode=="dark"?<img className="lricon" src="../../Assets/lock_black.png"/>:<img className="lricon" src="../../Assets/lock_white.png"/>}
          </div>
          <br></br>
          {
            can_submit && <input className='btn' type='submit' />
          }
          <div className="register-link">
            <p>Have an account? <a onClick={navigate_to_login}>Sign In</a></p>
          </div>
        </form>
      </div>

    </>
  )
}

export default Register
