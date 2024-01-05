function Request(props){
  let obj = JSON.parse(props.content)
  if (props.left == true){
    return(
      <>
      <div className="request left" style={{float:"left"}}>
        <h3>Request To Borrow</h3>
        <p><span style={{fontWeight:'bolder'}}>Title</span>  : {obj.book.name}</p>
        <p><span style={{fontWeight:'bolder'}}>Author</span> : {obj.book.author}</p>
        <p><span style={{fontWeight:'bolder'}}>ISBN</span>   : {obj.book.ISBN}</p>
        <p>From   : {new Date(obj.from).toDateString()}</p>
        <p>To     : {new Date(obj.to).toDateString()}</p>
        {!obj.book.borrowed && <button onClick={() => {props.func(obj.book.ID, new Date(obj.from).toJSON().replace("T", " ").replace("Z", ""), new Date(obj.to).toJSON().replace("T", " ").replace("Z", ""), props.id, props.pos)}}>Grant Request</button>}
        {obj.book.borrowed && <button onClick={() => {props.remfunc(obj.book.ID, new Date(obj.from).toJSON().replace("T", " ").replace("Z", ""), new Date(obj.to).toJSON().replace("T", " ").replace("Z", ""), props.id, props.pos)}}>Book Is Returned?</button>}
      </div>
      </>
    )
  }
  else{
    return(
      <>
      <div className="request right" style={{float:"right"}}>
        <h3>Request To Borrow</h3>
        <p>Title  : {obj.book.name}</p>
        <p>Author : {obj.book.author}</p>
        <p>ISBN   : {obj.book.ISBN}</p>
        <p>From   : {new Date(obj.from).toDateString()}</p>
        <p>To     : {new Date(obj.to).toDateString()}</p>
      </div>
      </>
    )
  }
}
export default Request