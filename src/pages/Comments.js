import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Comments({bodyComment, subComments, authorComment, _id}) {
  const [isVisbile, setIsVisible] = useState(false);
  const {user} = useContext(AuthContext)

  const setVisibleToggle = (e) => {
    e.preventDefault();
    setIsVisible(!isVisbile)
  }

  return(
    <div className="comments-container">
      <div className="sub-comments-container">
        <img src={authorComment.picture} alt="img"/>
        <div>
          <p>{authorComment.name}</p>
          <p>{authorComment.profession}</p>
          <hr/>
          <p className="body-sub-comment">{bodyComment}</p>
          
          <div className="edit-reply-container">
            { user._id === authorComment._id
            ? 
            <div>
              <Link to={`/comments/${_id}/subcomments`}>Reply</Link>
              <Link to={`/comments/${_id}`}>Edit</Link> 
              <Link onClick={setVisibleToggle}>Replies</Link>
            </div>
            :
            <div>
              <Link onClick={setVisibleToggle}>Replies</Link>
            </div>
            }
          </div>
         
      
          {isVisbile && subComments.map(element => ( 
          <div key={element._id} className="sub-subcomment-container">
            <img src={element.authorSubcomment.picture} alt="img"/>
            <div>
              <p>{element.authorSubcomment.name}</p>
              <p>{element.authorSubcomment.profession}</p>
              <p>{element.bodySubcomment}</p>
              {user._id === element.authorSubcomment._id
              ? 
              <div>
                <Link to={`/subcomments/${element._id}`}>Edit</Link>
                <Link to={`/comments/${_id}/subcomments`}>Reply</Link>
              </div>
              :
              <div>
                <Link to={`/comments/${_id}/subcomments`}>Reply</Link>
              </div>              }
            </div>
          </div>
          )) }
        </div>
      </div>
    </div>
  );
};

export default Comments;