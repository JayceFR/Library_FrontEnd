import {useNavigate} from "react-router-dom"
function Home() {
  const navigate = useNavigate();
  function nav(){
    navigate("/register");
  }
  return (
    <>
      <div className="heading">
        <div className="container">
          <div className="box">
            <span></span>
            <div className="sontent">
              <h2>E-Library</h2>
              <p>An app that strives to break the barriers between a reader amd their book. Flouished with communities, painted with books and powered with real time sockets. Be more than who you already are...</p>
              <button onClick={nav}>Join Us</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home