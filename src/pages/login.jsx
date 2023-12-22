import { useState } from "react";
import Input from "../components/input";
import { email_regex_value, password_regex_value } from "../constants/regexConstants";
import { AuthData } from "../auth/authentication";
import { useNavigate } from "react-router-dom";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [can_submit, setCan_submit] = useState(false)

    const email_regex = new RegExp(email_regex_value);
    const password_regex = new RegExp(password_regex_value);

    const navigate = useNavigate();

    const {login, user, mode} = AuthData();

    function submit(e) {
        e.preventDefault();
        console.log(email);
        console.log(password);
        doLogin();
    }

    function nvaigate_to_register(){
        navigate("/register");
    }

    const doLogin = async () => {
        try{
            await login(email, password);
            navigate("/dashboard")
        }catch (error){
            console.log(error);
        }
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
    return (
        <>
            <div className="lrform">
                <form onSubmit={submit}>
                    <label>Login</label>
                    <br></br>
                    <div className="inputbox">
                        <Input password={false} value={email} change_method={setEmail} name = {"Email"} />
                        {mode=="dark"? <img className = "lricon" src="../../Assets/mail_black.png"/>: <img className = "lricon" src="../../Assets/mail_white.png"/> }
                        
                    </div>
                    <div className="inputbox">
                        <Input password={true} value={password} change_method={setPassword} name = {"Password"} />
                        {mode=="dark"?<img className="lricon" src="../../Assets/lock_black.png"/>:<img className="lricon" src="../../Assets/lock_white.png"/>}
                        
                    </div>
                    {
                        can_submit && <input className="btn" type='submit' />
                    }
                    <div className="register-link">
                        <p>Don't have an account? <a onClick={nvaigate_to_register}>Register</a></p>
                    </div>
                </form>
            </div>

        </>
    )
    
}
export default Login;