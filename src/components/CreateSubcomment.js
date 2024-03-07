import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function CreateSubcomment() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const {commentId} = useParams();
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  const [bodySubcomment, setBodySubcomment] = useState("");

  const postNewSubcomment = (e) => {
    e.preventDefault();

    axios
      .post(`${API_URL}/api/comments/${commentId}/subcomments`, {bodySubcomment},
        {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(() => {
          setBodySubcomment("");
          navigate(-1);
          alert("success subcomments")
        })
        .catch(e => console.log("error posting new subcomment"));
  };

  return(
    <div className="post-subcomment-container">
      {user?.picture? <img src={user?.picture} alt="img"/> : <p>No picture</p>}

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