import axios from 'axios';
import { useState } from 'react';

function CreateOpinion() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem('authToken');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setMediaUrl(selectedFile);
      setSelectedFileName(selectedFile.name);
    }
  };

  const postNewOpinion = (e) => {
    e.preventDefault();

    if (!mediaUrl) {
      setMessage('Please upload a media file (photo or video).');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('body', body);
    uploadData.append('media', mediaUrl); 
    axios.post(`${API_URL}/api/opinions`, uploadData, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
    .then((response) => {
      setTitle('');
      setBody('');
      setMediaUrl(null);
      setSelectedFileName('');
      setMessage('Opinion created successfully!');
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error posting new opinion:', error);
      setMessage('Failed to create opinion. Please try again.');
    });
  };

  return (
    <form onSubmit={postNewOpinion}>
      <input 
        type="text"
        name="title"
        value={title}
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        name="body"
        value={body}
        placeholder="Your opinion"
        onChange={(e) => setBody(e.target.value)}
      />

      <input 
        id="file-upload"
        type="file" 
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}> Image or Video🤳 </label>

      {selectedFileName && <div>Selected File: {selectedFileName}</div>}

      <h3>{message}</h3>
      <button type="submit">Submit Opinion</button>
    </form>
  );
}

export default CreateOpinion;