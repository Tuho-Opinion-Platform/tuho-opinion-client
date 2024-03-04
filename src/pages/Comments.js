function Comments({bodyComment, subComments, authorComment}) {
  
  return(
    <div className="comments-container">
      <div className="sub-comments-container">
        <img src={authorComment.picture} alt="img"/>
        <div>
          <p>{authorComment.name}</p>
          <p>{authorComment.profession}</p>
          <p>{bodyComment}</p>
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