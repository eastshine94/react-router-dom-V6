import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

function WebPost() {
  const { id } = useParams();
  const location = useLocation();

  return (
    <div>
      <h1>This is Post#{id}</h1>
      <div>pathName: {location.pathname}</div>
      <div>
        <Link to="..">Post List로</Link>
      </div>
    </div>
  );
}

export default WebPost;
