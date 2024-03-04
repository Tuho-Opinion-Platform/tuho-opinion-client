import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditOpinion() {

  const {opinionId} = useParams();
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [picture, setPicture] = useState("");
  const [body, setBody] = useState("");

  const fetchingOpinionId = () => {
    axios.get(`${API_URL}/api/opinions/${opinionId}`, {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(gettingOpinionId => {
        const opinion = gettingOpinionId.data; 
        setTitle(opinion.title);
        setPicture(opinion.picture);
        setBody(opinion.body);

      })
      .catch(e => console.log("error edit new opinion"))
  };

  useEffect(() => {
    fetchingOpinionId();
  }, []);

  function handleEditSubmit(e) {
    e.preventDefault();
    
    const requestOpinionBody = {
      title, picture, body
    }
    
    console.log(requestOpinionBody)
    axios.put(`${API_URL}/api/opinions/${opinionId}`, requestOpinionBody, {headers: {Authorization: `Bearer ${storedToken}`}} )
      .then(() => {
        alert("You have successfully your opinion")
        navigate(-1)
      })
      .catch(e => console.log("error edit the opinion"))
  };


  function handleDeleteOpinion() {
    axios.delete(`${API_URL}/api/opinions/${opinionId}`, {headers: {Authorization: `Bearer ${storedToken}`}} )
    .then(() => {
      alert("You have successfully delete your opinion")
      navigate("/opinions")
    })
    .catch(e => console.log("error deleting your opinion"))
  }


  return(
    <div>
      <form onSubmit={handleEditSubmit} className="form-edit-submit">
        <label>Title</label>
        <input 
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Opinion Body</label>
        <textarea 
          type="text"
          name="body"
          value={body}
          onChange={e => setBody(e.target.value)}
        />

        <label>Picture</label>
        <input 
          type="text"
          name="picture"
          value={picture}
          onChange={e => setPicture(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>

      <button onClick={handleDeleteOpinion}>Delete</button>
    </div>
  );
};

export default EditOpinion;