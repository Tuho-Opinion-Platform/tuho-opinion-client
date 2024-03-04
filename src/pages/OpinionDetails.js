import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "./Comments";

function OpinionDetails() {
  
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const {opinionId} = useParams();
  const storedToken = localStorage.getItem("authToken");
  const [opinion, setOpinion] = useState("")

  useEffect(() => {
    function fetchingOpinionId() {
      axios.get(`${API_URL}/api/opinions/${opinionId}`, {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(gettingOpinionId => setOpinion(gettingOpinionId.data))
        .catch(e => console.log("error getting opinion Id", e))
    };

    fetchingOpinionId();
  }, []);
  

  if(opinion === "") {
    return <p>Loading</p>
  } else {
    return(
      <div className="opinion-details-container">
        <div className="opinion-author-container">
          <img src={opinion.authorOpinion.picture} alt="img" />
          <div>
            <p>Author: {opinion.authorOpinion.name}</p>
            <p>{opinion.authorOpinion.profession}</p> 
            <hr/>
          </div>
        </div>
        <div className="opinion-content-container">
          <div className="sub-opinion-title-and-picture">
            <p className="title">{opinion.title}</p>
            {opinion.picture ? <img src={opinion.picture} alt="img" className="main-image"/> : <p>No Picture</p>}
            <button>
              <Link to={`/opinions/edit/${opinion._id}`}>Edit Opinion</Link>
            </button>
          </div>
          <div className="sub-opinion-body">
            <p>{opinion.body}</p>
          </div>
        </div>
        <div className="opinion-comments-container">
          {opinion && opinion.comments.map(comment => (
            <Comments key={comment._id} {...comment} />
          ))}
        </div>
      </div>
    );
  }

};

export default OpinionDetails;