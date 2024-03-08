import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "./Comments";
import CreateComment from "../components/CreateComment";
import { AuthContext } from "../context/auth.context";

function OpinionDetails() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const {opinionId} = useParams();
  const storedToken = localStorage.getItem("authToken");
  const {user} = useContext(AuthContext)
  const [opinion, setOpinion] = useState("");
  const [opinionOwnerId, setOpinionOwnerId] = useState("");

  useEffect(() => {
    function fetchingOpinionId() {
      axios.get(`${API_URL}/api/opinions/${opinionId}`, {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(gettingOpinionId => {
          if(gettingOpinionId.data && gettingOpinionId.data.authorOpinion) {
            setOpinionOwnerId(gettingOpinionId.data.authorOpinion._id)
          }
          setOpinion(gettingOpinionId.data)
        })
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
            <p>{new Date(opinion.createdAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <p>{opinion.authorOpinion.profession}</p>
            <br /> 
            <hr/>
          </div>
        </div>
        
        <div className="opinion-content-container">
          <div className="sub-opinion-title-and-picture">
            <p className="title">{opinion.title}</p>
            {opinion.picture ? <img src={opinion.picture} alt="img" className="main-image"/> : <p>No Picture</p>}
          </div>

          <div className="sub-opinion-body">
            <p>{opinion.body}</p>
            {user && user._id === opinionOwnerId 
            ? 
            <button>
              <Link to={`/opinions/edit/${opinion._id}`}>Edit Opinion</Link>
            </button>
            :
            <></>
            }
            <br />
            {user ? <CreateComment/> : <h3>Please login to leave the comment! <Link to="/login">here</Link></h3>}
            
            <div className="opinion-comments-container">
              {opinion && opinion.comments.map(comment => (
                <Comments key={comment._id} {...comment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

};

export default OpinionDetails;