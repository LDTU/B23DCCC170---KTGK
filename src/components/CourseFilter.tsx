import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Row, Col, Card, Spin, Tag, Divider } from 'antd';
import { FilterOutlined, UndoOutlined } from '@ant-design/icons';
import { CourseStatus } from '../models/course';
import courseService from '../services/courseService';

const { Option } = Select;

interface CourseFilterProps {
  onFilter: (instructor: string | null, status: CourseStatus | null) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ onFilter }) => {
  const [instructors, setInstructors] = useState<string[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Cập nhật danh sách giảng viên khi component được mount và khi danh sách khóa học thay đổi
  const updateInstructorsList = () => {
    setLoading(true);
    const courses = courseService.getCourses();
    const uniqueInstructors = Array.from(new Set(courses.map(course => course.instructor)));
    setInstructors(uniqueInstructors);
    setLoading(false);
  };

  useEffect(() => {
    // Đăng ký lắng nghe sự kiện storage để cập nhật khi có thay đổi từ tab khác
    window.addEventListener('storage', updateInstructorsList);
    updateInstructorsList();

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener('storage', updateInstructorsList);
    };
  }, []);

  // Thiết lập cập nhật định kỳ danh sách giảng viên mỗi 10 giây
  useEffect(() => {
    const intervalId = setInterval(updateInstructorsList, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleReset = () => {
    setSelectedInstructor(null);
    setSelectedStatus(null);
    onFilter(null, null);
  };

  const handleFilter = () => {
    onFilter(selectedInstructor, selectedStatus);
  };

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

  return (
    <Card title="Bộ lọc khóa học" style={{ marginBottom: 16 }}>
      <Form layout="horizontal">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <Form.Item 
              label={
                <div>
                  Giảng viên 
                  {loading && <Spin size="small" style={{ marginLeft: 8 }} />}
                </div>
              }
            >
              <Select 
                placeholder="Chọn giảng viên"
                allowClear
                value={selectedInstructor}
                onChange={(value) => setSelectedInstructor(value)}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {instructors.map(instructor => (
                  <Option key={instructor} value={instructor}>{instructor}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <Form.Item label="Trạng thái">
              <Select 
                placeholder="Chọn trạng thái"
                allowClear
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                style={{ width: '100%' }}
                optionLabelProp="label"
              >
                {Object.values(CourseStatus).map(status => (
                  <Option key={status} value={status} label={status}>
                    <Tag color={getStatusColor(status)}>{status}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={4} lg={4} xl={4} style={{ textAlign: 'right' }}>
            <Form.Item>
              <Button 
                type="primary" 
                onClick={handleFilter} 
                style={{ marginRight: 8 }}
                icon={<FilterOutlined />}
              >
                Lọc
              </Button>
              <Button 
                onClick={handleReset}
                icon={<UndoOutlined />}
              >
                Đặt lại
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CourseFilter;
