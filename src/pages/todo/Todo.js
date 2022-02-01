import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import dayjs from 'dayjs';
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem
} from '../../lib/storage';

const INIT_TODO_LIST = [
  { id: 0, title: '출근 하기', createdAt: '2022-01-01 00:00:01' },
  { id: 1, title: '퇴근 하기', createdAt: '2022-01-01 00:00:01' }
];

function Todo() {
  const [todoList, setTodoList] = useState(
    getSessionItem('todo') ?? INIT_TODO_LIST
  );
  const [selectedRowKeys, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  //할 일 등록
  const handleTodoSubmit = data => {
    const { title } = data;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    setTodoList(prev => [...prev, { id: todoList.length, title, createdAt }]);
    setCurrentPage(1);
  };

  // 할 일 삭제
  const handleTodoDelete = id => {
    setTodoList(prev =>
      prev
        .filter(item => item.id !== id)
        .map((item, idx) => {
          item.id = idx;
          return item;
        })
    );
  };

  const handleSelectedDeleteBtn = () => {
    setTodoList(prev =>
      prev
        .filter(item => !selectedRowKeys.includes(item.id))
        .map((item, idx) => {
          item.id = idx;
          return item;
        })
    );
    setSelectedRows([]);
    setCurrentPage(1);
  };

  const handleAllDeleteBtn = () => {
    setTodoList([]);
    setSelectedRows([]);
    setCurrentPage(1);
  };

  const handleTableChange = pagination => {
    const { current } = pagination;
    setCurrentPage(current);
  };

  useEffect(() => {
    if (todoList.length === 0) {
      removeSessionItem('todo');
    } else {
      setSessionItem('todo', todoList);
    }
  }, [todoList]);

  return (
    <div>
      <header className="m-10">
        <h1 className="text-[20px]">할 일 목록!!</h1>
        <Link to="finish">완료 목록</Link>
      </header>
    </div>
  );
}

export default Todo;
