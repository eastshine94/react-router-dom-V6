import React from 'react';
import { Tag, Table, Popconfirm, Button } from 'antd';

function Todo() {
  const products = [
    { id: 0, title: '출근 하기', success: true },
    { id: 1, title: '퇴근 하기', success: false }
  ];
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
  return <Table dataSource={products} columns={columns} />;
}

export default Todo;
