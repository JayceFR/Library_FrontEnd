import { NavLink } from "react-router-dom";
import { nav } from "../constants/navConstants";
import { AuthData } from "../auth/authentication";
function Nav(){

    const {user, logout, mode, change_dark} = AuthData();
    const MenuItem = ({curr_route}) => {
        return(
            <li><NavLink to = {curr_route.path}>{curr_route.name}</NavLink></li>
        )
    }
    return(
        <>
            <nav>
                <ul className="navbar">
                    {
                        nav.map((curr_route, index) => {
                            if (curr_route.isMenu && !curr_route.isPrivate){
                                return(<MenuItem key={index} curr_route={curr_route}/>)
                            }
                            else if (curr_route.isMenu && user.is_logged_in){
                                return(<MenuItem key={index} curr_route={curr_route}/>)
                            }
                            else{
                                return false
                            }
                        })
                    }
                    { user.is_logged_in ? <li><NavLink to={'/'} onClick={logout}>Log Out</NavLink></li> : <li><NavLink to={'/login'}>Log In</NavLink></li>}
                </ul>
            </nav>
            <br></br>
            {mode == "dark" && <img id="light_dark_mode" src = "../../Assets/light_on.png"/>}
            {mode == "light" && <img id="light_dark_mode" src = "../../Assets/light_off.png"/>}
            {mode=="dark" && <a onClick={change_dark} id="light_dark_txt">Turn on the lights</a>}
            {mode=="light" && <a onClick={change_dark} id="light_dark_txt">Turn off the lights</a>}
        </>
    )
}

export default Nav;