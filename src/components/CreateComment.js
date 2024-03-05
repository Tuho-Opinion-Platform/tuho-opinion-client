import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

function CreateComment() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const {opinionId} = useParams();

  const [bodyComment, setBodyComment] = useState("");

  const postNewComment = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/api/opinions/${opinionId}/comments`, {bodyComment},
      {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(() => {
          setBodyComment("");
          window.location.reload();
        })
        .catch(e => console.log("error posting new comment"))
  };

  return(
    <div className="comment-container">
      <p>O</p>
      <form className="comment-form" onSubmit={postNewComment}>
        <input 
          type="text"
          name="bodyComment"
          value={bodyComment}
          onChange={e => setBodyComment(e.target.value)}
          placeholder="Give your comment in positive way"
        />
        <button type="submit">Comment</button>
      </form>
    </div>
  );
};

export default CreateComment;