import { NavLink } from "react-router-dom";
import { nav } from "../constants/navConstants";
import { AuthData } from "../auth/authentication";
function Nav(){

    const {user, logout, mode, change_dark, play, toggle_music} = AuthData();
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
                            if (curr_route.hide && user.is_logged_in){
                                return false
                            }
                            else if (curr_route.isMenu && !curr_route.isPrivate){
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
                    { user.is_logged_in ? <li onClick={() => {return logout()}}><NavLink to={'/'} >⛔</NavLink></li> : <li><NavLink to={'/login'}>Log In</NavLink></li>}
                    {user.is_logged_in && <li onClick={toggle_music}><NavLink>🎧</NavLink></li>}
                </ul>
            </nav>
            {mode == "dark" && <img id="light_dark_mode" src = "../../Assets/light_on.png"/>}
            {mode == "light" && <img id="light_dark_mode" src = "../../Assets/light_off.png"/>}
            {mode=="dark" && <a onClick={change_dark} id="light_dark_txt">Turn on the lights</a>}
            {mode=="light" && <a onClick={change_dark} id="light_dark_txt">Turn off the lights</a>}
            
        </>
    )
}

export default Nav;