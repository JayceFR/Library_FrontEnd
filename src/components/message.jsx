function Message(props){ //{"left": true, "content" : "sa-re-pa-ga"}
  if (props.left == true){
    return(
      <>
      <div className="message left" style={{float:"left"}}>{props.content}</div>
      </>
    )
  }
  else{
    return(
      <>
      <div className="message right" style={{float:"right"}}>{props.content}</div>
      </>
    )
  }
}

export default Message