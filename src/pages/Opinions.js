import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateOpinion from "../components/CreateOpinion";
import { AuthContext } from "../context/auth.context";

function Opinions() {
  const API_URL = process.env.REACT_APP_SERVER_URL
  const [opinions, setOpinions] = useState([]);
  const [title, setTitle] = useState("");
  const {user} = useContext(AuthContext)

  useEffect(() => {
    function fetchingOpinions() {
      axios.get(`${API_URL}/api/opinions`)
        .then(gettingOpinions => {
          let filterByTitle = gettingOpinions.data.filter(element => {
            const opinionTitle = element.title.toLowerCase().includes(title.toLowerCase());
            return opinionTitle;
          });
          setOpinions(filterByTitle)
          console.log(filterByTitle)
        })
        .catch(e => console.log("error fetching the opinions"))
    };

    fetchingOpinions();
  }, [title])

return(
    <div className="opinions-main-container">
      
      <div className="input-container">
        {user ? <CreateOpinion /> : <h3>Please login to post your opinion click <Link to="/login">here</Link></h3>}
      </div>
      
      <div className="input-filter-container">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Search by title"
        />
      </div>

      <div className="opinions-container">
        {opinions.map(elementOfOpinions => (
          <div key={elementOfOpinions._id} className="sub-opinions-container">
            <div className="author-opinion-container">
              <img src={elementOfOpinions.authorOpinion.picture} alt="img" />
              <div>
                <p>Author: {elementOfOpinions.authorOpinion.name}</p>
                {/* <p>{elementOfOpinions.authorOpinion.profession}</p>  */}
                <p>{new Date(elementOfOpinions.createdAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                <hr/>
              </div>
            </div>
            <p className="title">{elementOfOpinions.title}</p>
            <Link to={`/opinions/${elementOfOpinions._id}`}>
              {elementOfOpinions.picture ? <img src={elementOfOpinions.picture} alt="img" className="main-picture-from-opinion-page"/> : <p>No Picture</p>}
            </Link>            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opinions;