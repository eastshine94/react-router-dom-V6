import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div>
      <h1>About</h1>
      <div>
        <Link to="/">Home으로</Link>
      </div>
      <div>
        <Link to="/web">Web으로</Link>
      </div>
    </div>
  );
}

export default About;
