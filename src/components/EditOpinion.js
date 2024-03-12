import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditOpinion() {
  const { opinionId } = useParams();
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mediaUrl, setMediaUrl] = useState(""); // For displaying current media
  const [mediaFile, setMediaFile] = useState(null); // To hold the new file to upload

  useEffect(() => {
    axios.get(`${API_URL}/api/opinions/${opinionId}`, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(response => {
      const { title, mediaUrl, body } = response.data;
      setTitle(title);
      setMediaUrl(mediaUrl);
      setBody(body);
    })
    .catch(e => console.log("Error fetching opinion details:", e));
  }, [API_URL, opinionId, storedToken]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // if (file) {
    //   setMediaFile(file);
    //   if (file.type.startsWith('image/')) {
    //     setMediaUrl(URL.createObjectURL(file));
    //   } else {
    //     setMediaUrl(''); // Clear or set a default placeholder for non-image types if necessary
    //   }
    // }
    if (file) {
      setMediaFile(file);
      setMediaUrl(URL.createObjectURL(file)); // This works for both images and videos
    }
  };

  const handleUpdateSubmitOpinion = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (mediaFile) {
      formData.append('media', mediaFile);
    }
    
    axios.put(`${API_URL}/api/opinions/${opinionId}`, formData, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
    .then(() => {
      alert("You have successfully edited your opinion");
      navigate(-1);
    })
    .catch(e => console.log("Error editing the opinion:", e));
  };

  const handleDeleteOpinion = () => {
    axios.delete(`${API_URL}/api/opinions/${opinionId}`, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(() => {
      alert("You have successfully deleted your opinion");
      navigate("/");
    })
    .catch(e => console.log("Error deleting your opinion:", e));
  };

  console.log(mediaUrl)

  return (
    <div className="form-container">
      <form onSubmit={handleUpdateSubmitOpinion} className="form-edit-submit">
        <label>Title</label>
        <input 
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Opinion Body</label>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label>Picture / Video</label>
        {mediaUrl.endsWith("mp4") 
        ? <video controls src={mediaUrl} className="main-image"/>
        : <img src={mediaUrl} alt="Opinion Preview" className="main-image" /> 
        }
        <input
          type="file"
          onChange={handleFileChange}
        />

        <button type="submit" className="submit-button">Submit</button>
      </form>

      <button onClick={handleDeleteOpinion} className="delete-button">Delete</button>
    </div>
  );
}

export default EditOpinion;