import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/auth.context";

function Comments({ bodyComment: initialBodyComment, subComments: initialSubComments, authorComment, _id, createdAt, updatedAt }) {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const storedToken = localStorage.getItem("authToken");
  const { user } = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bodyComment, setBodyComment] = useState(initialBodyComment);
  const [subComments, setSubComments] = useState(initialSubComments);
  const [newSubcommentText, setNewSubcommentText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyingToId, setReplyingToId] = useState(null); // Used to track if replying to a comment or sub-comment
  const [editingSubcommentId, setEditingSubcommentId] = useState(null);
  const [editingSubcommentText, setEditingSubcommentText] = useState('');
  const toggleVisible = () => setIsVisible(!isVisible);
  const toggleEdit = () => setIsEditing(!isEditing);
  const handleCommentChange = (e) => setBodyComment(e.target.value);

  const handleUpdateSubmitComment = (e) => {
    e.preventDefault();
    axios.put(`${API_URL}/api/comments/${_id}`, { bodyComment }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(() => {
        setIsEditing(false)})
      .catch(e => console.log("error updating the comment", e));
  };

  const handleDeleteComment = () => {
    axios.delete(`${API_URL}/api/comments/${_id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(() => window.location.reload())
      .catch(e => console.log("error deleting the comment", e));
  };

  const toggleReply = (id = null) => {
    setIsReplying(!isReplying || replyingToId !== id);
    setReplyingToId(id);
    setNewSubcommentText('');
  };

  const handleNewSubcommentChange = (e) => setNewSubcommentText(e.target.value);

  const handleAddSubcomment = () => {
    axios.post(`${API_URL}/api/comments/${_id}/subcomments`, { bodySubcomment: newSubcommentText, parentSubcommentId: replyingToId }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then((response) => {
        if (replyingToId === _id || !replyingToId) {
          setSubComments([...subComments, response.data]);
        } else {
          // Logic to handle adding subcomments to subcomments if needed
        }
        setNewSubcommentText('');
        setIsReplying(false);
        setReplyingToId(null);
      })
      .catch((error) => console.log("error adding a subcomment", error));
  };

  const handleEditSubcomment = (subcommentId) => {
    axios.put(`${API_URL}/api/subcomments/${subcommentId}`, { bodySubcomment: editingSubcommentText }, { headers: { Authorization: `Bearer ${storedToken}` } })
      .then(response => {
        const updatedSubComments = subComments.map(subcomment => {
          if (subcomment._id === subcommentId) {
            return { ...subcomment, bodySubcomment: editingSubcommentText };
          }
          return subcomment;
        });
        setSubComments(updatedSubComments);
        setEditingSubcommentId(null); // Stop editing
        setEditingSubcommentText('');
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
        <img src={authorComment?.picture} alt="author"/>
        <div>
          <p>{authorComment?.name || 'Anonymous'}</p>
          <p>{new Date(createdAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          {/* <p>Updated at {new Date(updatedAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>           */}
          
          {isEditing ? (
            <form onSubmit={handleUpdateSubmitComment} className="form-edit-comment">
              <textarea value={bodyComment} onChange={handleCommentChange} />
              <button type="submit">Save</button>
              <button onClick={toggleEdit} type="button">Cancel</button>
            </form>
          ) : (
            <div>
              <p className="body-sub-comment">{bodyComment}</p>
              <div className="edit-delete-reply-container">
                {user && user._id === authorComment?._id && (
                  <>
                    <Link to="#" onClick={toggleEdit}>Edit</Link>
                    <Link to="#" onClick={handleDeleteComment}>Delete</Link>
                  </>
                )}
                <Link to="#" onClick={() => toggleReply(_id)}>Reply</Link>
                {subComments.length > 0 && <Link to="#" onClick={toggleVisible}>View Replies ({subComments.length})</Link>}
              </div>
            </div>
          )}
        </div>
      </div>

      {isReplying && replyingToId === _id && (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddSubcomment();
        }} className="form-create-new-subcomment">
          <textarea value={newSubcommentText} onChange={handleNewSubcommentChange} />
          <div className="buttons-create-new-subcomment">
            <button type="submit">Add Reply</button>
            <button onClick={() => toggleReply(null)} type="button">Cancel</button>
          </div>
        </form>
      )}

      {isVisible && subComments.map((element) => (
        <div key={element?._id} className="sub-subcomment-container">
          <img src={element.authorSubcomment?.picture || 'default-avatar-url.jpg'} alt="subcomment author" />
          <div>
            <p>{element.authorSubcomment?.name || 'Anonymous'}</p>
            <p>{new Date(element.createdAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
            {/* <p>{element.authorSubcomment?.profession || 'Unknown Profession'}</p> */}
            <br />
            <p className="body-subcomment">{element.bodySubcomment}</p>
            {editingSubcommentId === element?._id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditSubcomment(element?._id);
              }} className="form-edit-subcomment">
                <textarea value={editingSubcommentText} onChange={(e) => setEditingSubcommentText(e.target.value)} />
                <button type="submit">Save</button>
                <button onClick={() => setEditingSubcommentId(null)} type="button">Cancel</button>
              </form>
            ) : (
              <>
                {user && user?._id === element.authorSubcomment?._id && (
                  <>
                    <Link to="#" onClick={() => {
                      setEditingSubcommentId(element?._id);
                      setEditingSubcommentText(element.bodySubcomment);
                    }}>Edit</Link>
                    <Link to="#" onClick={() => handleDeleteSubcomment(element?._id)}>Delete</Link>
                  </>
                )}
                <Link to="#" onClick={() => toggleReply(element?._id)}>Reply</Link>
              </>
            )}

            {isReplying && replyingToId === element?._id && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddSubcomment();
              }} className="form-create-new-subcomment">
                <textarea value={newSubcommentText} onChange={handleNewSubcommentChange} />
                <div className="buttons-create-new-subcomment">
                  <button type="submit">Add Reply</button>
                  <button onClick={() => toggleReply(null)} type="button">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comments;

