import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import "./OneShow.css";
import likedImg from "../media/liked.png";
import notLikedImg from "../media/notLiked.png";

function OneShow() {
  const [show, setShow] = useState({});
  const [seasons, setSeasons] = useState(0);
  const [liked, setLiked] = useState(false);
  const [ratingClass, setRatingClass] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const checkLiked = localStorage.getItem(id);
        if (checkLiked === "liked") {
          setLiked(true);
        }
        const {
          data: {
            data: { readOneSingleTvShow },
          },
        } = await axios({
          url: "http://localhost:8001/graphql",
          method: "POST",
          data: {
            query: `
              query readOneSingleTvShow($showId: Int) {
                readOneSingleTvShow(showId:$showId) {
                  name,
                  showId,
                  description,
                  image_thumbnail_path,
                  status,
                  genres,
                  seasons,
                  rating,
              }
              }
                `,
            variables: { showId: Number(id) },
          },
        });
        setShow(readOneSingleTvShow);
        setSeasons(readOneSingleTvShow.seasons);
        const rating = Number(readOneSingleTvShow.rating);
        if (rating >= 8) {
          setRatingClass("green");
        } else if (rating >= 6) {
          setRatingClass("yellow");
        } else {
          setRatingClass("red");
        }
      } catch ({ message }) {
        setError(message);
      }
    })();
  }, [id]);

  const handleLiked = () => {
    if (liked) {
      localStorage.setItem(id, "not-liked");
    } else {
      localStorage.setItem(id, "liked");
    }
    setLiked(!liked);
  };

  return show.name ? (
    <div className="one-show-container">
      <Link className="go-back-link" to="/">
        <img
          className="go-back-img"
          alt="Go back"
          src="https://img.icons8.com/metro/52/000000/circled-left-2.png"
        />
      </Link>
      <div className="like-div" onClick={handleLiked}>
        {liked ? (
          <img className="interaction-img" src={likedImg} alt="liked" />
        ) : (
          <img className="interaction-img" src={notLikedImg} alt="not liked" />
        )}
      </div>
      <div className="one-show-img-and-title">
        <h2>{show.name}</h2>
        <img
          className="one-show-img"
          src={show.image_thumbnail_path}
          alt={show.name}
        />
        <div className="one-show-footer">
          <div className="seasons">{seasons} seasons</div>
          <div className="genres">
            {show.genres.map((genre) => (
              <span className="genre" key={genre}>
                {genre}
              </span>
            ))}
          </div>
          <div className="rating">
            Rating:&nbsp;
            <span className={ratingClass}>
              {show?.rating?.toString().slice(0, 3)}
            </span>
          </div>
          <div className="show-status">
            status: <span className="status">{show.status}</span>
          </div>
        </div>
      </div>
      <div className="one-show-description">
        <h2>description:</h2>
        {show.description}
      </div>
    </div>
  ) : error ? (
    <div className="errorDiv">
      <p>Oops... There's been an error..</p>
      <p className="error">{error}</p>
    </div>
  ) : (
    <h2>loading...</h2>
  );
}

export default OneShow;
