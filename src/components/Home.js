import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Show from "./Show";
import "./Home.css";
import bg from "../video/popcorn.mp4";

function Home() {
  const [error, setError] = useState("");
  const [shows, setShows] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const getPopularShows = useCallback(async () => {
    try {
      const {
        data: {
          data: { readAllTvShows },
        },
      } = await axios({
        url: "http://localhost:8001/graphql",
        method: "POST",
        data: {
          query: `
        query readAllTvShows {
          readAllTvShows{
            name
            showId
            image_thumbnail_path
          }
        }
          `,
        },
      });
      setShows(readAllTvShows);
    } catch ({ message }) {
      setError(message);
    }

    // readAllTvShows.forEach(async (show) => {
    //   const {
    //     data: { tvShow },
    //   } = await axios.get(
    //     `https://www.episodate.com/api/show-details?q=${show.showId}`
    //   );
    //   const {
    //     rating,
    //     name,
    //     description,
    //     image_thumbnail_path,
    //     genres,
    //     status,
    //     episodes,
    //   } = tvShow;
    //   const seasons = episodes[episodes.length - 1].season;
    //   let showOptions = {
    //     name,
    //     description,
    //     genres,
    //     image_thumbnail_path,
    //     rating,
    //     status,
    //     seasons,
    //     showId: show.showId,
    //   };
    //   const res = await axios({
    //     url: "http://localhost:8001/graphql",
    //     method: "POST",
    //     data: {
    //       query: `
    //     mutation createOneSingleTvShow($options: singleTvShowOptionsInput) {
    //       createOneSingleTvShow(options:$options)
    //     }
    //       `,
    //       variables: { options: showOptions },
    //     },
    //   });
    // });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchInput.length === 0) {
      getPopularShows();
    } else {
      const { data: shows } = await axios.get(
        `https://www.episodate.com/api/search?q=${searchInput}`
      );
      setShows(shows.tv_shows);
    }
  };

  useEffect(() => {
    getPopularShows();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      <video src={bg} playsInline autoPlay muted loop id="bgvid" />
      <h1>The Best T.V Shows</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          id="search-bar"
          placeholder="Search t.v show..."
          type="text"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        ></input>
        <button id="submit-btn" type="submit">
          Search
        </button>
      </form>
      {error ? (
        <div className="errorDiv">
          <p>Oops... There's been an error..</p>
          <p className="error">{error}</p>
        </div>
      ) : (
        <div className="top-shows">
          {shows.map((show) => (
            <Show show={show} key={show.showId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
