import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditSubcomment() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const {subcommentId} = useParams();
  const navigate = useNavigate();

  const [bodySubcomment, setBodySubcomment] = useState("");

  useEffect(() => {
    function gettingSubcommentId () {
      axios.get(`${API_URL}/api/subcomments/${subcommentId}`, {headers: {Authorization: `Bearer ${storedToken}`}})
        .then(response => {
          const getBodySubcomment = response.data
          console.log(getBodySubcomment);
          setBodySubcomment(getBodySubcomment.bodySubcomment)
        })
        .catch(e => console.log("error getting subcomment id", e))
    };

    gettingSubcommentId();
  }, [])

  const handleUpdateSubmitSubComment = (e) => {
    e.preventDefault();

    axios.put(`${API_URL}/api/subcomments/${subcommentId}`, {bodySubcomment},
    {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(() => {
        alert("You have successfully update your subcomment")
        setBodySubcomment("");
        navigate(-1);
      })
      .catch(e => console.log("error updating subcomment"))
  }

  const handleDeleteSubComment = () => {
    axios.delete(`${API_URL}/api/subcomments/${subcommentId}`, 
    {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(() => {
        navigate(-1)
        alert("You have successfully deleted the subcomment")
      })
      .catch(e => console.log("error deleting the subcomment"))
  }

  return(
    <div className="edit-form-subcomment">
      <form onSubmit={handleUpdateSubmitSubComment}>
        <input 
          type="text"
          name="bodySubcomment"
          value={bodySubcomment}
          onChange={e => setBodySubcomment(e.target.value)}
        />

        <button type="submit">Update</button>
      </form>

      <button onClick={handleDeleteSubComment}>Delete</button>
    </div>
  );
};

export default EditSubcomment;