import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateOpinion from "../components/CreateOpinion";
import { AuthContext } from "../context/auth.context";
import { CiSearch } from "react-icons/ci";


function Opinions() {
  const API_URL = process.env.REACT_APP_SERVER_URL;
  const [opinions, setOpinions] = useState([]);
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(4);
  const { user } = useContext(AuthContext);


  const showMoreItems = () => {
    setVisible(prevValue => prevValue + 3)
  }

  useEffect(() => {
    function fetchingOpinions() {
      axios.get(`${API_URL}/api/opinions`)
        .then(gettingOpinions => {
          let filterByTitle = gettingOpinions.data.filter(element => {
            const opinionTitle = element.title.toLowerCase().includes(title.toLowerCase());
            return opinionTitle;
          });
          setOpinions(filterByTitle);
        })
        .catch(e => console.log("error fetching the opinions"));
    };

    fetchingOpinions();
  }, [title]);

  if (opinions.length < 1) {
    return <div className="lds-dual-ring"></div>;
  } else {
    return (
      <div className="opinions-main-container">
        <div className="search-icon-container">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Search..."
            className="input-filter-container"
          />
          <span><CiSearch /></span>
        </div>

        <div className="input-container">
          {user && <CreateOpinion />}
        </div>

        <div className="opinions-container">
          {opinions.slice(0, visible).map(elementOfOpinions => (
            <div key={elementOfOpinions._id} className="sub-opinions-container">
              <div className="author-opinion-container">
                <img src={elementOfOpinions.authorOpinion.picture} alt="author" />
                <div>
                  <p>Author: {elementOfOpinions.authorOpinion.name}</p>
                  <p>{new Date(elementOfOpinions.createdAt).toLocaleDateString("en", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  <hr />
                </div>
              </div>
              <p className="title">{elementOfOpinions.title}</p>
              <Link to={`/opinions/${elementOfOpinions._id}`}>
                {elementOfOpinions.mediaUrl ? (
                  elementOfOpinions.mediaUrl.endsWith(".mp4") ? (
                    <video controls src={elementOfOpinions.mediaUrl} className="main-picture-from-opinion-page"></video>
                  ) : (
                    <>
                    <img src={elementOfOpinions.mediaUrl} alt="Opinion" className="main-picture-from-opinion-page" />
                    </>
                  )
                ) : <p style={{textAlign: "center"}}>No Media</p>}
              </Link>
              
            </div>
          ))}
        </div>
        {opinions.length > 4 && (
          <div className="container-button-load-more">
            <button onClick={showMoreItems} className="button-load-more">Load More</button>
          </div>
        )}
      </div>
    );
  }
}

export default Opinions;