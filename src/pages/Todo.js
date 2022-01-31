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
import Finish from '../components/Table/Finish';

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
  const [currentPage, setCurrentPage] = useState(1);

  const [form] = Form.useForm();

  //할 일 등록
  const handleTodoSubmit = data => {
    const { title } = data;
    const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');

    setTodoList(prev => [...prev, { id: todoList.length, title, createdAt }]);
    form.setFieldsValue({ title: '' });
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

  const handleTableChange = pagination => {
    const { current } = pagination;
    setCurrentPage(current);
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
      align: 'center',
      render: (_, row) => <Finish row={row} onDelete={handleTodoDelete} />
    },
    {
      title: '삭제',
      dataIndex: 'id',
      align: 'center',
      render: id => {
        return (
          <Popconfirm
            title="삭제 하시겠습니까?"
            onConfirm={() => handleTodoDelete(id)}
          >
            <Button danger={true}>삭제</Button>
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
                      message: '할 일을 입력해주세요!'
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
                  <Button type="primary" htmlType="submit">
                    저장
                  </Button>
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
          pagination={{
            current: currentPage,
            pageSize: 10,
            position: ['bottomCenter']
          }}
          bordered={true}
          onChange={handleTableChange}
        />
      </Content>
    </Layout>
  );
}

export default Todo;
