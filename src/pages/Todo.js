import React, { useEffect, useState } from 'react';
import {
  Tag,
  Table,
  Popconfirm,
  Button,
  Row,
  Col,
  Form,
  Input,
  Layout
} from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import {
  getSessionItem,
  setSessionItem,
  removeSessionItem
} from '../lib/storage';
import dayjs from 'dayjs';

const INIT_TODO_LIST = [
  { id: 0, title: '출근 하기', createdAt: '2022-01-01 00:00:01' },
  { id: 1, title: '퇴근 하기', createdAt: '2022-01-01 00:00:01' }
];

function renderSuccessType(isSuccess) {
  const tagColors = ['green', 'red'];
  const label = isSuccess ? '성공' : '실패';
  return <Tag color={tagColors[isSuccess ? 0 : 1]}>{label}</Tag>;
}

function Todo() {
  const [todoList, setTodoList] = useState(
    getSessionItem('todo') || INIT_TODO_LIST
  );
  const [selectedRowKeys, setSelectedRows] = useState([]);

  const [form] = Form.useForm();

  //할 일 등록
  const handleTodoSubmit = data => {
    const { title } = data;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    setTodoList(prev => [...prev, { id: todoList.length, title, createdAt }]);
    form.setFieldsValue({ title: '' });
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

  // 할 일 완료
  const handleTodoFinish = id => {
    const data = {};
    setSessionItem('todo-finish', data);
    handleTodoDelete(id);
  };

  const columns = [
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
      dataIndex: 'id',
      render: id => {
        return (
          <Popconfirm title="Delete?" onConfirm={() => handleTodoFinish(id)}>
            <Button>완료</Button>
          </Popconfirm>
        );
      }
    },
    {
      title: '삭제',
      dataIndex: 'id',
      render: id => {
        return (
          <Popconfirm title="Delete?" onConfirm={() => handleTodoDelete(id)}>
            <Button>삭제</Button>
          </Popconfirm>
        );
      }
    }
  ];

  useEffect(() => {
    if (todoList.length === 0) {
      removeSessionItem('todo');
    } else {
      setSessionItem('todo', todoList);
    }
  }, [todoList]);

  return (
    <Layout>
      <Header style={{ background: '#fff' }}>
        <h1>To Do!</h1>
      </Header>
      <Content>
        <Form
          style={{ marginLeft: '15px' }}
          form={form}
          onFinish={handleTodoSubmit}
        >
          <Form.Item label="할 일">
            <Row>
              <Col span={10}>
                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: '이름을 입력해주세요!'
                    }
                  ]}
                  validateTrigger={['onSubmit']}
                  noStyle
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item>
                  <Popconfirm
                    title="변경된 정보를 저장하시겠습니까?"
                    onConfirm={() => {
                      form.submit();
                    }}
                    okText="확인"
                    cancelText="취소"
                  >
                    <Button type="primary" htmlType="submit">
                      저장
                    </Button>
                  </Popconfirm>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>

        <Table
          dataSource={todoList}
          columns={columns}
          rowKey={record => record.id}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRows }}
        />
      </Content>
    </Layout>
  );
}

export default Todo;
