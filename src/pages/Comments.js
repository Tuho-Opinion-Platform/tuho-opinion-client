import { Link } from "react-router-dom";

function Comments({bodyComment, subComments, authorComment, _id}) {
  console.log(_id)
  return(
    <div className="comments-container">
      <div className="sub-comments-container">
        <img src={authorComment.picture} alt="img"/>
        <div>
          <p>{authorComment.name}</p>
          <p>{authorComment.profession}</p>
          <hr/>
          <p className="body-sub-comment">{bodyComment}</p>
          <Link to={`/comments/${_id}`}>Edit</Link>
          {subComments.map(element =>( 
          <div key={element._id} className="sub-subcomment-container">
            <img src={element.authorSubcomment.picture} alt="img"/>
            <div>
              <p>{element.authorSubcomment.name}</p>
              <p>{element.authorSubcomment.profession}</p>
              <p>{element.bodySubcomment}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comments;