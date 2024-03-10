import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Comments from "./Comments";
import CreateComment from "../components/CreateComment";
import { AuthContext } from "../context/auth.context";

function OpinionDetails() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const { opinionId } = useParams();
  const storedToken = localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);
  const [opinion, setOpinion] = useState(null);
  const [opinionOwnerId, setOpinionOwnerId] = useState("");

  const getCounts = (key) => {
    const savedCount = localStorage.getItem(`${key}-${opinionId}`);
    return savedCount !== null ? parseInt(savedCount, 10) : 0;
  };

  const [countUp, setCountUp] = useState(() => getCounts('countUp'));
  const [countDown, setCountDown] = useState(() => getCounts('countDown'));

  const [voteType, setVoteType] = useState(() => {
    const votes = JSON.parse(localStorage.getItem(`votes-${user?._id}`) || "{}");
    return votes[opinionId] || null;
  });

  useEffect(() => {
    axios.get(`${API_URL}/api/opinions/${opinionId}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((response) => {
        const fetchedOpinion = response.data;
        if (fetchedOpinion && fetchedOpinion.authorOpinion) {
          setOpinionOwnerId(fetchedOpinion.authorOpinion._id);
        }
        setOpinion(fetchedOpinion);
      })
      .catch((error) => console.log("error getting opinion Id", error));
  }, [API_URL, opinionId, storedToken]);

  useEffect(() => {
    localStorage.setItem(`countUp-${opinionId}`, countUp.toString());
    localStorage.setItem(`countDown-${opinionId}`, countDown.toString());
    const votes = JSON.parse(localStorage.getItem(`votes-${user?._id}`) || "{}");
    if (voteType) {
      votes[opinionId] = voteType;
      localStorage.setItem(`votes-${user?._id}`, JSON.stringify(votes));
    }
  }, [countUp, countDown, opinionId, user?._id, voteType]);

  const changeVote = (newVoteType) => {
    if (user) {
      const oppositeVoteType = newVoteType === 'up' ? 'down' : 'up';
      const isChangingVote = voteType && voteType !== newVoteType;
      
      if (isChangingVote || voteType === null) {
        setVoteType(newVoteType);
        if (newVoteType === 'up') {
          setCountUp(prevCount => prevCount + 1);
          if (isChangingVote) setCountDown(prevCount => prevCount - 1);
        } else {
          setCountDown(prevCount => prevCount + 1);
          if (isChangingVote) setCountUp(prevCount => prevCount - 1);
        }
      }
    }
  };

  if (opinion === null) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="opinion-details-container">
        <div className="opinion-author-container">
          <img src={opinion.authorOpinion.picture} alt="Author" />
          <div>
            <p>Author: {opinion.authorOpinion.name}</p>
            <p>{new Date(opinion.createdAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            <p>{opinion.authorOpinion.profession}</p>
            <hr />
          </div>
        </div>
        
        <div className="opinion-content-container">
          <div className="sub-opinion-title-and-picture">
            <p className="title">{opinion.title}</p>
            {opinion.picture ? <img src={opinion.picture} alt="Opinion" className="main-image" /> : <p>No Picture Available</p>}
          </div>

          <div className="sub-opinion-body">
            <p>{opinion.body}</p>
            <div className="agree-disagree-container">  
              <button onClick={() => changeVote('up')}><p>Agree {countUp}</p></button>
              <button onClick={() => changeVote('down')}>Disagree {countDown}</button>
            </div>
            {user && user._id === opinionOwnerId && (
              <button><Link to={`/opinions/edit/${opinion._id}`}>Edit Opinion</Link></button>
            )}
            <br />
            {user ? <CreateComment /> : <h3>Please login to leave a comment! <Link to="/login">Login here</Link></h3>}
            
            <div className="opinion-comments-container">
              {opinion.comments && opinion.comments.map(comment => (
                <Comments key={comment._id} {...comment} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OpinionDetails;