import axios from "axios";
import { useState } from "react";

function CreateOpinion() {

  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");

  const [title, setTitle] = useState("");
  const [picture, setPicture] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState(""); // Added state for managing the file name


  const uploadImage = (file) => {
    return axios
      .post(`${API_URL}/api/upload`, file, {headers: {Authorization: `Bearer ${storedToken}`}})
      .then((res) => res.data)
      .catch((e) => console.log(e));
  };

  const handleFileUpload = (e) => {
    const uploadData = new FormData();
    uploadData.append("picture", e.target.files[0]);
    const fileName = e.target.files[0] ? e.target.files[0].name : '';
    setSelectedFileName(fileName);

    uploadImage(uploadData)
      .then((response) => {
        setPicture(response.picture);
      })
      .catch((err) => console.log("Error while uploading the file: ", err));
  };

  const postNewOpinion = (e) => {
    e.preventDefault();

    const newOpinion = {
      title, picture, body
    };

    if(picture === "") {
      return <p>{setMessage("Please upload a picture")}</p>
    }

    axios.post(`${API_URL}/api/opinions`, newOpinion, {headers: {Authorization: `Bearer ${storedToken}`}})
      .then(() => {
        setTitle("");
        setPicture("");
        setBody("");
        window.location.reload();
      })
      .catch(e => {console.log("error posting new opinion",e)});
  };


  return(
      <form onSubmit={postNewOpinion}>
        <input 
          type="text"
          name="title"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          type="text"
          name="body"
          value={body}
          placeholder="Please elaborate your opinion in positive way"
          onChange={(e) => setBody(e.target.value)}
        />

        <input 
          id="file-upload" // Match the label's htmlFor
          type="file" 
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}> Upload Picture </label>
        {selectedFileName && <div>Selected File: {selectedFileName}</div>}
        
        <h3>{message}</h3>
        <button type="submit">Submit</button>
      </form>
  );
};

export default CreateOpinion;