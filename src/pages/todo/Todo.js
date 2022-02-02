import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem
} from '../../lib/storage';
import FinishBtn from '../../components/Table/FinishBtn';

const INIT_TODO_LIST = [
  { id: 0, title: '출근 하기', createdAt: '2022-01-01 00:00:01' },
  { id: 1, title: '퇴근 하기', createdAt: '2022-01-01 00:00:01' }
];

function Todo() {
  const [todoList, setTodoList] = useState(
    getSessionItem('todo') ?? INIT_TODO_LIST
  );
  const [selectedRowKeys, setSelectedRows] = useState([]);

  const inputRef = useRef();

  //할 일 등록
  const handleTodoSubmit = event => {
    event.preventDefault();
    const title = inputRef.current.value;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    setTodoList(prev => [...prev, { id: todoList.length, title, createdAt }]);
    inputRef.current.value = '';
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

  const handleSelectedDeleteBtn = event => {
    event.preventDefault();
    setTodoList(prev =>
      prev
        .filter(item => !selectedRowKeys.includes(item.id))
        .map((item, idx) => {
          item.id = idx;
          return item;
        })
    );
    setSelectedRows([]);
  };

  const handleAllDeleteBtn = event => {
    event.preventDefault();
    setTodoList([]);
    setSelectedRows([]);
  };

  const handleCheckboxClick = id => {
    if (selectedRowKeys.includes(id)) {
      setSelectedRows(prev => prev.filter(val => val !== id));
    } else {
      setSelectedRows(prev => [...prev, id].sort((a, b) => a - b));
    }
  };

  const handleAllCheckBoxClick = event => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows(todoList.map(todo => todo.id));
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    if (todoList.length === 0) {
      removeSessionItem('todo');
    } else {
      setSessionItem('todo', todoList);
    }
  }, [todoList]);

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={
            selectedRowKeys.length > 0 &&
            selectedRowKeys.length === todoList.length
          }
          onChange={handleAllCheckBoxClick}
        />
      ),
      dataIndex: 'id',
      align: 'center',
      render: id => (
        <input
          type="checkbox"
          checked={selectedRowKeys.includes(id)}
          onChange={() => handleCheckboxClick(id)}
        />
      )
    },
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '할 일',
      dataIndex: 'title'
    },
    {
      title: '생성일',
      dataIndex: 'createdAt'
    },
    {
      title: '완료',
      align: 'center',
      render: (_, row) => <FinishBtn row={row} onDelete={handleTodoDelete} />
    },
    {
      title: '삭제',
      dataIndex: 'id',
      align: 'center',
      render: id => {
        return (
          <button
            className="p-1 text-red-500 border border-solid border-red-600"
            onClick={() => handleTodoDelete(id)}
          >
            삭제
          </button>
        );
      }
    }
  ];

  return (
    <div className="p-5">
      <header className="flex justify-between">
        <h1 className="text-[20px]">할 일 목록!!</h1>
        <Link
          to="finish"
          className="block p-2 border border-solid border-gray-400 hover:border-sky-300"
        >
          완료 목록
        </Link>
      </header>

      <section>
        <div>
          <form onSubmit={handleTodoSubmit}>
            할 일 :{' '}
            <input
              ref={inputRef}
              className="w-2/5 h-7 border border-solid border-gray-400"
            />
            <button className="py-1 px-3 text-white bg-sky-500">저장</button>
          </form>
        </div>
        <div className="flex justify-end mb-2">
          <button
            className="mr-2 py-1 px-3 text-white bg-sky-500"
            onClick={handleSelectedDeleteBtn}
          >
            선택 삭제
          </button>
          <button
            className="py-1 px-3 text-white bg-red-500"
            onClick={handleAllDeleteBtn}
          >
            전체 삭제
          </button>
        </div>

        <div>
          <table className="w-full border border-solid border-[#000] border-collapse">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    className="p-3 border border-solid border-[#000]"
                    key={idx}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {todoList.map(todo => (
                <tr key={todo.id}>
                  {columns.map((col, idx) => (
                    <td
                      className="p-3 border border-solid border-[#000]"
                      style={{ textAlign: col.align }}
                      key={idx}
                    >
                      {col.render?.(todo[col.dataIndex], todo) ??
                        todo[col.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Todo;
