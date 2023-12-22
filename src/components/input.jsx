function Input(props){ // {password: false, value : name, change_method : setName}
    const is_password = props.password;
    if (is_password){
        return(
            <>
                <input placeholder={props.name} value={props.value} onChange={e => {props.change_method(e.target.value)}} type="password"></input>
            </>
        )
    }
    else{
        return(
            <>
                <input placeholder={props.name} value={props.value} onChange={e => {props.change_method(e.target.value)}} type="text"></input>
            </>
        )
    }
    
}

export default Input