import React from 'react';
import { Table, Button, Popconfirm, Tag, Typography, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Course, CourseStatus } from '../models/course';

const { Text } = Typography;

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onEdit, onDelete }) => {
  // Hàm xác định màu sắc dựa trên trạng thái
  const getStatusColor = (status: CourseStatus): string => {
    switch (status) {
      case CourseStatus.OPEN:
        return 'green';
      case CourseStatus.PAUSED:
        return 'orange';
      case CourseStatus.CLOSED:
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
      ellipsis: true,
      render: (id: string) => (
        <Tooltip title={id}>
          <Text copyable={{ text: id }} style={{ fontSize: '0.9em' }}>
            {id.substring(0, 8)}...
          </Text>
        </Tooltip>
      )
    },
    {
      title: 'Tên Khóa Học',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (name: string, record: Course) => (
        <Tooltip title={record.description}>
          <span style={{ fontWeight: 500 }}>
            {name}
            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff', fontSize: '0.9em' }} />
          </span>
        </Tooltip>
      )
    },
    {
      title: 'Giảng Viên',
      dataIndex: 'instructor',
      key: 'instructor',
      width: '15%',
    },
    {
      title: 'Số Lượng Học Viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      width: '15%',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'} style={{ fontWeight: 'bold', width: '60px', textAlign: 'center' }}>
          {count}
        </Tag>
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      filters: Object.values(CourseStatus).map(status => ({
        text: status,
        value: status,
      })),
      onFilter: (value: string | number | boolean, record: Course) => record.status === value,
      render: (status: CourseStatus) => (
        <Tag color={getStatusColor(status)} style={{ padding: '2px 10px' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'actions',
      width: '15%',
      render: (text: string, record: Course) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title={
              <>
                <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />
                Bạn chắc chắn muốn xóa?
              </>
            }
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.studentCount > 0}
              size="small"
              title={record.studentCount > 0 ? "Không thể xóa khóa học đã có học viên" : ""}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      dataSource={courses} 
      columns={columns} 
      rowKey="id"
      pagination={{ 
        pageSize: 10, 
      }}
      bordered
      size="middle"
      scroll={{ x: 800 }}
      rowClassName={(record) => 
        record.status === CourseStatus.CLOSED ? 'table-row-closed' : ''
      }
    />
  );
};

export default CourseList;