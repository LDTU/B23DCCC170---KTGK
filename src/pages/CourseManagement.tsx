import React from 'react';
import { Row, Col, Card, Input, Button, Popconfirm, Space, Tooltip, Typography, Modal, Spin, Divider } from 'antd';
import { PlusOutlined, ReloadOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import CourseList from '../components/CourseList';
import CourseForm from '../components/CourseForm';
import CourseFilter from '../components/CourseFilter';
import useCourseModel from '../hooks/useCourseModel';

const { Search } = Input;
const { Text, Title } = Typography;

const CourseManagement: React.FC = () => {
  // Sử dụng custom hook để quản lý toàn bộ state và logic
  const {
    courses,
    filteredCourses,
    selectedCourse,
    isModalVisible,
    storageSize,
    loading,
    handleSearch,
    handleFilter,
    editCourse,
    addNewCourse,
    closeModal,
    saveCourse,
    deleteCourse,
    resetData,
    formatBytes
  } = useCourseModel();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 24, color: '#1890ff' }}>
        Quản lý khóa học
      </Title>
      
      <Spin spinning={loading} tip="Đang tải...">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card 
              bordered={false} 
              style={{ borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              <Row gutter={16} align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Search
                    placeholder="Tìm kiếm theo tên khóa học, giảng viên hoặc ID"
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                    allowClear
                    enterButton={<><SearchOutlined /> Tìm kiếm</>}
                  />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
                  <Space>
                    <Text>
                      <strong>Tổng số:</strong> {courses.length} khóa học 
                      <Tooltip title={`Dung lượng lưu trữ: ${formatBytes(storageSize)}`}>
                        <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                      </Tooltip>
                    </Text>
                    <Popconfirm
                      title="Hành động này sẽ xóa tất cả dữ liệu hiện tại và khôi phục về dữ liệu mẫu. Bạn có chắc chắn muốn tiếp tục?"
                      onConfirm={resetData}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button icon={<ReloadOutlined />}>Khôi phục dữ liệu mẫu</Button>
                    </Popconfirm>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={addNewCourse}
                      size="middle"
                    >
                      Thêm Khóa Học
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <CourseFilter 
              onFilter={handleFilter} 
            />
          </Col>

          <Col span={24}>
            <Card 
              bordered={false} 
              style={{ 
                borderRadius: 8, 
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                overflow: 'hidden' 
              }}
            >
              <CourseList 
                courses={filteredCourses}
                onEdit={editCourse}
                onDelete={deleteCourse}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title={
            <div style={{ color: '#1890ff', borderBottom: '1px solid #f0f0f0', paddingBottom: 10 }}>
              {selectedCourse ? "Chỉnh Sửa Khóa Học" : "Thêm Khóa Học Mới"}
            </div>
          }
          visible={isModalVisible}
          onCancel={closeModal}
          footer={null}
          width={800}
          destroyOnClose
          maskClosable={false}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', padding: '24px' }}
        >
          <CourseForm 
            course={selectedCourse}
            onSubmit={(values) => {
              saveCourse(values, selectedCourse?.id);
            }}
          />
        </Modal>
      </Spin>
    </div>
  );
};

export default CourseManagement;