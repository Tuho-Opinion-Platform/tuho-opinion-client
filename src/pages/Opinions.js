import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateOpinion from "../components/CreateOpinion";

function Opinions() {
  const API_URL = process.env.REACT_APP_SERVER_URL
  const [opinions, setOpinions] = useState([]);

  useEffect(() => {
    function fetchingOpinions() {
      axios.get(`${API_URL}/api/opinions`)
        .then(gettingOpinions => setOpinions(gettingOpinions.data))
        .catch(e => console.log("error fetching the opinions"))
    };

    fetchingOpinions();
  }, [])

return(
    <div className="opinions-main-container">
      <div className="input-container">
        <CreateOpinion />
      </div>
      <div className="opinions-container">
        {opinions.map(elementOfOpinions => (
          <div key={elementOfOpinions._id} className="sub-opinions-container">
            <div className="author-opinion-container">
              <img src={elementOfOpinions.authorOpinion.picture} alt="img" />
              <div>
                <p>Author: {elementOfOpinions.authorOpinion.name}</p>
                <p>{elementOfOpinions.authorOpinion.profession}</p> 
                <hr/>
              </div>
            </div>
            <p className="title">{elementOfOpinions.title}</p>
            {elementOfOpinions.picture ? <img src={elementOfOpinions.picture} alt="img"/> : <p>No Picture</p>}
            <Link to={`/opinions/${elementOfOpinions._id}`}>See more</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opinions;