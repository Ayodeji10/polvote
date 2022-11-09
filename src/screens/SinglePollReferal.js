import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function SinglePollReferal() {
  // history
  const navigate = useNavigate();

  // params
  const { id, referalId } = useParams();

  useEffect(() => {
    localStorage.setItem("ballotbox_referalId", referalId);
    navigate(`/polls/${id}`);
  }, []);

  return <div></div>;
}

export default SinglePollReferal;
