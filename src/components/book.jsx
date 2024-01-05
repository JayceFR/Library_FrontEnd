import { useState } from "react"
import { test_img_data } from "../constants/test_constant"

function Books(props) {
  const [from_date, setFromDate] = useState(null);
  const [to_date, setToDate] = useState(null);
  if (props.menu){
    return(
      <>
      <li>
        <div>
          <img loading="lazy" src={`data:image/png;base64, ${props.data}`}></img>
        </div>
        <h3>{props.name}</h3>
        <p>{props.author}</p>
        {!props.borrowed && <> <input onChange={(e) => {setFromDate(new Date(e.target.value))}} type="date"/>  TO  <input onChange={(e) => {setToDate(new Date(e.target.value))}} type="date"/> </>}
        {(from_date && to_date && !props.borrowed) && <button onClick={() => props.func(props.id, from_date, to_date)}>Send Request</button>}
      </li>
    </>
    )
  }
  return (
    <>
      <li onClick={() => props.func(props.id)}>
        <div>
          <img loading="lazy" src={`data:image/png;base64, ${props.data}`}></img>
        </div>
        <h3>{props.name}</h3>
        <p>{props.author}</p>
      </li>
    </>
  )
}

export default Books