import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditComment() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const {commentId} = useParams();
  const navigate = useNavigate();

  const [bodyComment, setBodyComment] = useState("");

  useEffect(() => {
    function gettingCommentId() {
      axios.get(`${API_URL}/api/comments/${commentId}`)
        .then(response => {
          const bodyCommentId = response.data;
          setBodyComment(bodyCommentId.bodyComment)
        })
        .catch(e => console.log("error fetching comment Id", e))
    };

    gettingCommentId();
  }, [])

  const handleUpdateSubmitComment = (e) => {
    e.preventDefault();

    axios.put(`${API_URL}/api/comments/${commentId}`, {bodyComment}, 
      {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(() => {
          setBodyComment("")
          navigate(-1)
        })
        .catch(e => console.log("error updating the comment"))
  };  


  const handleDeleteComment = () => {
    axios.delete(`${API_URL}/api/comments/${commentId}`,
    {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(() => {
        window.location.reload()
        alert("You have successfully deleted your comment")
        navigate(-1)
      })
      .catch(e => console.log("error deleting the comment"))
  }

  return(
    <div>
      <form onSubmit={handleUpdateSubmitComment} className="edit-form-comment">
        <input 
          type="text"
          name="bodyComment"
          value={bodyComment}
          onChange={e => setBodyComment(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>

      <button onClick={handleDeleteComment}>Delete</button>
    </div>
  );
};

export default EditComment;