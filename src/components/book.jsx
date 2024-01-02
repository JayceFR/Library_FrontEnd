import { test_img_data } from "../constants/test_constant"

function Books(props) {
  return (
    <>
      <li>
        <img src={`data:image/png;base64, ${props.data}`}></img>
        <h3>{props.name}</h3>
        <p>{props.author}</p>
      </li>
    </>
  )
}

export default Books