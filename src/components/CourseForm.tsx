import React, { useEffect } from 'react';
import { Form, Input, Select, Button, InputNumber } from 'antd';
import { Course, CourseStatus } from '../models/course';

const { Option } = Select;
const { TextArea } = Input;

interface CourseFormProps {
  course?: Course;
  onSubmit: (values: Omit<Course, 'id'>) => void;
}

const instructors = [
  'Lưu Đức Tuấn', 
  'Trần Đức Định', 
  'Nguyễn Minh Đức', 
  'Nguyễn Viết Sang', 
  'Nguyễn Trường Giang', 
  'Nguyễn Văn Huy',
  'Nguyễn Văn Khoa',
  'Nguyễn Văn Long',
  'Nguyễn Văn Minh',
  'Nguyễn Văn Nam',
  'Nguyễn Văn Nghĩa',
  'Nguyễn Văn Ngọc',
];

const CourseForm: React.FC<CourseFormProps> = ({ course, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (course) {
      form.setFieldsValue(course);
    } else {
      form.resetFields();
    }
  }, [course, form]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      initialValues={{ studentCount: 0 }}
    >
      <Form.Item
        name="name"
        label="Tên Khóa Học"
        rules={[
          { required: true, message: 'Vui lòng nhập tên khóa học' },
          { max: 100, message: 'Tên khóa học không quá 100 ký tự' }
        ]}
      >
        <Input placeholder="Nhập tên khóa học" />
      </Form.Item>

      <Form.Item
        name="instructor"
        label="Giảng Viên"
        rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
      >
        <Select placeholder="Chọn giảng viên">
          {instructors.map(instructor => (
            <Option key={instructor} value={instructor}>
              {instructor}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Mô Tả Khóa Học"
        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
      >
        <TextArea rows={4} placeholder="Nhập mô tả khóa học" />
      </Form.Item>

      <Form.Item
        name="studentCount"
        label="Số Lượng Học Viên"
        rules={[
          { required: true, message: 'Vui lòng nhập số lượng học viên' },
          { type: 'number', min: 0, message: 'Số lượng học viên không được âm' }
        ]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="Nhập số lượng học viên" min={0} />
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng Thái"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select placeholder="Chọn trạng thái">
          {Object.values(CourseStatus).map(status => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {course ? 'Cập Nhật' : 'Thêm Mới'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CourseForm;