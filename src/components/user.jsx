function User(props){ //{'name': 'Jayce', 'active': true, 'onlcik': func, 'id': 'uuid'}
  //need to still add the status shown
  return (
    <>
      <div className="user" onClick={() => props.func(props.user)}>
        <p className="user_name">{props.name}</p>
        <img src="../../Assets/user_white.png" alt="Avatar"/>
      </div>
    </>
  )
}

export default User