
function Notification(props){
  return(
    <>
      <div className="notification">
        <img src="../../Assets/bell.png"/> {props.content}
      </div>
    </>
  )
}

export default Notification