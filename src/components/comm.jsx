function Comm(props){
  return (
    <>
      <div className="comm">
        <div className="name">
          {props.name}
        </div>
        <div className="commbtn">
          <button onClick={() => {props.func(props.id)}}>Join</button>
        </div>
      </div>
    </>
  )
}
export default Comm