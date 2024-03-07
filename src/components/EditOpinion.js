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

  const uploadImage = (file) => {
    return axios
      .post(`${API_URL}/api/upload`, file, {headers: {Authorization: `Bearer ${storedToken}`}})
      .then((res) => res.data)
      .catch((e) => console.log(e));
  };

  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("picture", e.target.files[0]);

    uploadImage(uploadData)
      .then((response) => {
        setPicture(response.picture);
      })
      .catch((err) => console.log("Error while uploading the file: ", err));
  };


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

  function handleUpdateSubmitOpinion(e) {
    e.preventDefault();
  
    const requestOpinionBody = {
      title, picture, body
    };
    
    axios.put(`${API_URL}/api/opinions/${opinionId}`, requestOpinionBody, {headers: {Authorization: `Bearer ${storedToken}`}} )
      .then(() => {
        alert("You have successfully edit your opinion")
        navigate(-1)
      })
      .catch(e => console.log("error edit the opinion"))
  };


  function handleDeleteOpinion() {
    axios.delete(`${API_URL}/api/opinions/${opinionId}`, {headers: {Authorization: `Bearer ${storedToken}`}} )
    .then(() => {
      alert("You have successfully deleted your opinion")
      navigate("/")
    })
    .catch(e => console.log("error deleting your opinion"))
  }


  return(
    <div className="form-container">
      <form onSubmit={handleUpdateSubmitOpinion} className="form-edit-submit">
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
        <img src={picture} alt="img"/>

        <input
          type="file"
          name="picture"
          onChange={handleFileUpload}
        />
       
        <button type="submit" className="submit-button">Submit</button>
      </form>

      <button onClick={handleDeleteOpinion} className="delete-button">Delete</button>
    </div>
  );
};

export default EditOpinion;