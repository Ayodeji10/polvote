import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../components/apiRoot";
import { useNavigate } from "react-router-dom";
import RecStoriesSkeleton from "../skeletons/recStoriesSkeleton";

function RecommendedStories() {
  // history
  const navigate = useNavigate();

  // fetch stories and aspirants
  const [stories, setStories] = useState([]);
  const [storyFetch, setStoryFetch] = useState(true);

  const fetchStories = () => {
    axios({
      method: "GET",
      url: `${API.API_ROOT}/story?page=1&limit=30`,
    })
      .then((response) => {
        // console.log(response.data)
        setStories(response.data.stories);
        setStoryFetch(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div className="story-recomentdations mb-3">
      <h2>Recommended Posts</h2>
      {storyFetch && (
        <>
          {[1, 2, 3, 4, 5].map((n) => {
            return <RecStoriesSkeleton key={n} />;
          })}
        </>
      )}
      {stories
        .slice(0)
        .sort(function () {
          return 0.5 - Math.random();
        })
        .slice(0, 5)
        .map((each, index) => {
          ///slice(0) at the beginning is to duplicate the stories array
          return (
            <div className="story row" key={index}>
              <div className="col-2">
                <div
                  className="img-container"
                  onClick={() => navigate(`/user/${each.userid}`)}
                >
                  {each.userimage === null || each.userimage === undefined ? (
                    <img
                      src="/img/place.jpg"
                      className="img-fluid"
                      alt="avatar"
                      id="profile-img"
                    />
                  ) : (
                    <img src={each.userimage} alt="avatar" id="profile-img" />
                  )}
                </div>
              </div>
              <div className="col-10 details">
                <h3 onClick={() => navigate(`/user/${each.userid}`)}>
                  {each.fullname}
                </h3>
                <h4>{each.username}</h4>
                <p>
                  {each.story.replace(/(<([^>]+)>)/gi, "").substring(0, 100)}
                  {each.story.length > 200 && "..."}
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/stories/${each.story
                        .replace(/(<([^>]+)>)/gi, "")
                        .replaceAll(" ", "-")
                        .replaceAll("?", "")
                        .replaceAll("/", "-")
                        .replaceAll("%", "percent")
                        .substring(0, 45)}/${each._id}`
                    )
                  }
                >
                  Read more
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default RecommendedStories;
