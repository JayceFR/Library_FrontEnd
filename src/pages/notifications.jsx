import React, { useRef, useState } from "react"
import { AuthData } from "../auth/authentication";

function Obj(props){
  const [hover, setHover] = useState(false)
  return (
    <>
      <li onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={() => {props.func(props.id)}} className="notifications">
        <div className="notification_content" style={{ 'backgroundColor': 'white' }}>
          <img src="../../Assets/bell.png" />
          <div className="notmessage">
            <span className="txt txt-1">{props.content}</span>
            <span className="txt txt-2">{props.date} {hover && <span style={{'float':'right', 'color':'#f32695', 'fontWeight':'bolder', 'margin':'none', 'right':'0'}}>Mark as read</span>}</span>
          </div>
        </div>
      </li>
    </>
  )
}

function Notifications() {
  const { notificaitons, remove_notification } = AuthData();
  return (
    <>
      <h1 style={{ 'textAlign': 'center' }}>Unread Notifications</h1>
      {notificaitons.map((notification, index) => {
        return <Obj content={notification.content} date={notification.date} func={remove_notification} id={notification.id} />
      })}
    </>
  )
}

export default Notifications