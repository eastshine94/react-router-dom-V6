import React, {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  ChangeEvent,
  ReactNode
} from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem
} from '../../lib/storage';
import FinishBtn from '../../components/Table/FinishBtn';

interface TodoListTypes {
  id: number;
  title: string;
  createdAt: string;
}

interface ColumnTypes {
  title: ReactNode;
  dataIndex: keyof TodoListTypes;
  align: 'left' | 'center' | 'right';
  render: (value?: unknown, recode?: TodoListTypes) => ReactNode;
}

const INIT_TODO_LIST: TodoListTypes[] = [
  { id: 0, title: '출근 하기', createdAt: '2022-01-01 00:00:01' },
  { id: 1, title: '퇴근 하기', createdAt: '2022-01-01 00:00:01' }
];

function Todo() {
  const [todoList, setTodoList] = useState<TodoListTypes[]>(
    getSessionItem('todo') ?? INIT_TODO_LIST
  );
  const [selectedRowKeys, setSelectedRows] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  //할 일 등록
  const handleTodoSubmit = (event: MouseEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = (inputRef.current as HTMLInputElement).value;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    setTodoList(prev => [...prev, { id: todoList.length, title, createdAt }]);
    (inputRef.current as HTMLInputElement).value = '';
  };

  // 할 일 삭제
  const handleTodoDelete = (id: number) => {
    setTodoList(prev =>
      prev
        .filter(item => item.id !== id)
        .map((item, idx) => {
          item.id = idx;
          return item;
        })
    );
  };

  // 선택 삭제
  const handleSelectedDeleteBtn = (event: MouseEvent<HTMLButtonElement>) => {
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

  // 모두 삭제
  const handleAllDeleteBtn = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setTodoList([]);
    setSelectedRows([]);
  };

  // 선택
  const handleCheckboxClick = (id: number) => {
    if (selectedRowKeys.includes(id)) {
      setSelectedRows(prev => prev.filter(val => val !== id));
    } else {
      setSelectedRows(prev => [...prev, id].sort((a, b) => a - b));
    }
  };

  // 모두 선택
  const handleAllCheckBoxClick = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedRows(todoList.map(todo => todo.id));
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    // update session storage
    if (todoList.length === 0) {
      removeSessionItem('todo');
    } else {
      setSessionItem('todo', todoList);
    }
  }, [todoList]);

  const columns: Partial<ColumnTypes>[] = [
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
          checked={selectedRowKeys.includes(id as number)}
          onChange={() => handleCheckboxClick(id as number)}
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
            onClick={() => handleTodoDelete(id as number)}
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
        <div>
          <Link
            to="/antd/todo"
            className="mr-2 p-2 border border-solid border-gray-400 hover:border-sky-300"
          >
            Antd Mode
          </Link>
          <Link
            to="finish"
            className="p-2 border border-solid border-gray-400 hover:border-sky-300"
          >
            완료 목록
          </Link>
        </div>
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
          <table className="w-full table-fixed border border-solid border-[#000] border-collapse">
            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[5%]" />
              <col className="w-[40%]" />
              <col className="w-[15%]" />
              <col className="w-[25%]" />
              <col className="w-[10%]" />
            </colgroup>
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
                      className="p-3 border border-solid border-[#000] break-words"
                      style={{ textAlign: col.align }}
                      key={idx}
                    >
                      {col.dataIndex
                        ? col.render?.(todo[col.dataIndex], todo) ??
                          todo[col.dataIndex]
                        : null}
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
