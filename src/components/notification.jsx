import { useRef } from "react";

function Notification(props) {
  const notify_ref = useRef(null);
  const progress_ref = useRef(null);
  if (props.show) {
    if (notify_ref.current) {
      notify_ref.current.classList.add("active");
      progress_ref.current.classList.add("active");
    }
  }
  else {
    if (notify_ref.current) {
      notify_ref.current.classList.remove("active");
      progress_ref.current.classList.remove("active");
    }
  }
  return (
    <>
      <div ref={notify_ref} className="notification">
        <div className="notification_content">
          <img src="../../Assets/bell.png" />
          <div className="notmessage">
            <span className="txt txt-1">Notification</span>
            <span className="txt txt-2">{props.content}</span>
          </div>
        </div>
        <div ref={progress_ref} className="progress"></div>
      </div>
    </>
  )
}

export default Notification