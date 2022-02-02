import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function Web() {
  const navigate = useNavigate();
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate(-1);
  };
  return (
    <div>
      <h1>This is Web</h1>
      <button onClick={handleBackClick}>뒤로</button>
      <ul>
        <li>
          <Link to="1">Post #1</Link>
        </li>
        <li>
          <Link to="2">Post #2</Link>
        </li>
        <li>
          <Link to="3">Post #3</Link>
        </li>
        <li>
          <Link to="4">Post #4</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default Web;
