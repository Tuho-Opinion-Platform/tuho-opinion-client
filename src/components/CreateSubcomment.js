import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateSubcomment() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const {commentId} = useParams();
  const navigate = useNavigate();

  const [bodySubcomment, setBodySubcomment] = useState("");

  function postNewSubcomment(e) {
    e.preventDefault();

    axios.post(`${API_URL}/api/comments/${commentId}/subcomments`, {bodySubcomment},
      {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(() => {
        setBodySubcomment("");
        navigate(-1)
      })
      .catch(e => console.log("error posting new subcomment"));
  };

  return(
    <div className="post-subcomment-container">
      <p>0</p>
      <form onSubmit={postNewSubcomment} className="subcomment-form">
        <input 
          type="text"
          name="bodySubcomment"
          value={bodySubcomment}
          onChange={e => setBodySubcomment(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateSubcomment;