import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Web from './pages/Web';
import WebPost from './pages/WebPost';
import Todo from './pages/todo/Todo';
import TodoFinish from './pages/todo/TodoFinish';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="web" element={<Web />}>
          <Route path=":id" element={<WebPost />} />
        </Route>
        <Route path="todo">
          <Route index element={<Todo />} />
          <Route path="finish" element={<TodoFinish />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
