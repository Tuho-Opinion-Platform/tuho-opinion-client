import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

function Comments({ bodyComment: initialBodyComment, subComments: initialSubComments, authorComment, _id }) {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bodyComment, setBodyComment] = useState(initialBodyComment);
  const [subComments, setSubComments] = useState(initialSubComments);
  const [isReplying, setIsReplying] = useState(false);
  const [editingSubcommentId, setEditingSubcommentId] = useState(null);
  const [newSubcommentText, setNewSubcommentText] = useState('');

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleCommentChange = (e) => {
    setBodyComment(e.target.value);
  };

  const handleUpdateSubmitComment = (e) => {
    e.preventDefault();

    axios.put(`${API_URL}/api/comments/${_id}`, { bodyComment }, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(() => {
      setIsEditing(false);
    })
    .catch(e => console.log("error updating the comment", e));
  };

  const handleDeleteComment = () => {
    axios.delete(`${API_URL}/api/comments/${_id}`, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(() => {
      window.location.reload();
    })
    .catch(e => console.log("error deleting the comment", e));
  };

  const toggleReply = () => {
    setIsReplying(!isReplying);
  };

  const handleNewSubcommentChange = (e) => {
    setNewSubcommentText(e.target.value);
  };

  const handleAddSubcomment = (e) => {
    e.preventDefault();

    axios.post(`${API_URL}/api/comments/${_id}/subcomments`, { bodySubcomment: newSubcommentText }, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then((response) => {
      const addedSubcomment = response.data;
      setSubComments([...subComments, addedSubcomment]);
      setNewSubcommentText('');
      setIsReplying(false);
      alert("Subcomment added successfully");
    })
    .catch((error) => console.log("error adding a subcomment", error));
  };

  const handleEditSubcomment = (subcommentId, newBodySubcomment) => {
    axios.put(`${API_URL}/api/subcomments/${subcommentId}`, { bodySubcomment: newBodySubcomment }, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(response => {
      const updatedSubComments = subComments.map(subcomment => {
        if (subcomment._id === subcommentId) {
          return { ...subcomment, bodySubcomment: newBodySubcomment };
        }
        return subcomment;
      });
      setSubComments(updatedSubComments);
      setEditingSubcommentId(null); // Stop editing
    })
    .catch(e => console.log("error updating subcomment", e));
  };

  const handleDeleteSubcomment = (subcommentId) => {
    axios.delete(`${API_URL}/api/subcomments/${subcommentId}`, {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
    .then(() => {
      const filteredSubComments = subComments.filter(subcomment => subcomment._id !== subcommentId);
      setSubComments(filteredSubComments);
    })
    .catch(e => console.log("error deleting the subcomment", e));
  };


  return (
    <div className="comments-container">
      <div className="sub-comments-container">
        {/* Check if authorComment is defined before trying to access its properties */}
        <img src={authorComment?.picture} alt="author"/>
        <div>
          <p>{authorComment?.name || 'Anonymous'}</p>
          <p>{authorComment?.profession || 'Unknown Profession'}</p>
          <hr />
          {isEditing ? (
            <form onSubmit={handleUpdateSubmitComment} className="form-edit-comment">
              <br />
              <input value={bodyComment} onChange={handleCommentChange} />
              <button type="submit">Save</button>
              <button onClick={toggleEdit} type="button">Cancel</button>
            </form>
          ) : (
            <>
              <p className="body-sub-comment">{bodyComment}</p>
              <div className="edit-delete-reply-container">
                {user && user._id === authorComment._id && (
                  <>
                    <Link to="#" onClick={toggleEdit}>Edit</Link>
                    <Link to="#" onClick={handleDeleteComment}>Delete</Link>
                  </>
                )}
                <Link to="#" onClick={toggleReply}>Reply</Link>
              </div>
            </>
          )}

          {isReplying && (
            <form onSubmit={handleAddSubcomment}>
              <textarea value={newSubcommentText} onChange={handleNewSubcommentChange}></textarea>
              <button type="submit">Add Reply</button>
              <button onClick={toggleReply} type="button">Cancel</button>
            </form>
          )}

          {subComments.length > 0 && <Link to="#" onClick={toggleVisible}>View Replies ({subComments.length})</Link>}

          {isVisible && subComments.map((element) => (
        <div key={element._id} className="sub-subcomment-container">
          <img src={element.authorSubcomment?.picture || 'default-avatar-url.jpg'} alt="subcomment author" />
          <div>
            <p>{element.authorSubcomment?.name || 'Anonymous'}</p>
            <p>{element.authorSubcomment?.profession || 'Unknown Profession'}</p>
            {editingSubcommentId === element?._id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditSubcomment(element?._id, newSubcommentText);
              }}>
                <textarea value={newSubcommentText} onChange={(e) => setNewSubcommentText(e.target.value)}></textarea>
                <button type="submit">Save</button>
                <button onClick={() => setEditingSubcommentId(null)}>Cancel</button>
              </form>
            ) : (
              <p>{element.bodySubcomment}</p>
            )}
            {user && user?._id === element.authorSubcomment?._id && (
              <div>
                <Link to="#" onClick={() => {
                  setEditingSubcommentId(element?._id);
                  setNewSubcommentText(element?.bodySubcomment);
                }}>Edit</Link>
                <Link to="#" onClick={() => handleDeleteSubcomment(element?._id)}>Delete</Link>
                <Link to="#" onClick={toggleReply}>Reply</Link>
              </div>
            )}
          </div>
        </div>
      ))}

        </div>
      </div>
    </div>
  );
}

export default Comments;