import React, { useState } from 'react';
import { Tag, Table, Popconfirm, Button, Row, Col, Form, Input } from 'antd';

function Todo() {
  const [todoList, setTodoList] = useState([
    { id: 0, title: '출근 하기', success: true },
    { id: 1, title: '퇴근 하기', success: false }
  ]);

  const [form] = Form.useForm();

  const handleSubmit = data => {
    const { title } = data;
    setTodoList(prev => [
      ...prev,
      { id: todoList.length, title, success: false }
    ]);
  };

  const onDelete = id => {
    console.log(id);
  };

  const renderSuccessType = isSuccess => {
    const tagColors = ['green', 'red'];
    const label = isSuccess ? '성공' : '실패';
    return <Tag color={tagColors[isSuccess ? 0 : 1]}>{label}</Tag>;
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
      title: '달성 여부',
      dataIndex: 'success',
      render: renderSuccessType
    },
    {
      title: 'Delete',
      render: (text, record) => {
        return (
          <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
            <Button>Delete</Button>
          </Popconfirm>
        );
      }
    }
  ];
  return (
    <div>
      <Form style={{ marginLeft: '15px' }} form={form} onFinish={handleSubmit}>
        <Form.Item label="할 일">
          <Row>
            <Col span={10}>
              <Form.Item name="title" noStyle>
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
      />
    </div>
  );
}

export default Todo;
