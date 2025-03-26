import { useState, useEffect, useCallback } from 'react';
import { Course, CourseStatus } from '../models/course';
import courseService from '../services/courseService';
import { message } from 'antd';

/**
 * Custom hook để quản lý state và logic liên quan đến khóa học
 * Tách biệt logic quản lý dữ liệu khỏi components giao diện
 */
const useCourseModel = () => {
  // State quản lý
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [storageSize, setStorageSize] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Tải danh sách khóa học từ service
   */
  const loadCourses = useCallback(() => {
    setLoading(true);
    try {
      const loadedCourses = courseService.getCourses();
      setCourses(loadedCourses);
      setFilteredCourses(loadedCourses);
      setStorageSize(courseService.getStorageSize());
    } catch (error) {
      message.error('Không thể tải danh sách khóa học');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Tải dữ liệu khi component mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  /**
   * Tìm kiếm khóa học theo tên, ID hoặc giảng viên
   */
  const handleSearch = useCallback((value: string) => {
    if (!value.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const searchValue = value.toLowerCase().trim();
    const filtered = courses.filter(course => 
      course.name.toLowerCase().includes(searchValue) || 
      course.instructor.toLowerCase().includes(searchValue) ||
      course.id.toLowerCase().includes(searchValue)
    );
    setFilteredCourses(filtered);
  }, [courses]);

  /**
   * Lọc khóa học theo giảng viên và trạng thái
   */
  const handleFilter = useCallback((instructor: string | null, status: CourseStatus | null) => {
    let filtered = courses;

    if (instructor) {
      filtered = filtered.filter(course => course.instructor === instructor);
    }

    if (status) {
      filtered = filtered.filter(course => course.status === status);
    }

    setFilteredCourses(filtered);
  }, [courses]);

  /**
   * Chọn khóa học để chỉnh sửa và hiển thị modal
   */
  const editCourse = useCallback((course: Course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  }, []);

  /**
   * Mở modal để thêm khóa học mới
   */
  const addNewCourse = useCallback(() => {
    setSelectedCourse(undefined);
    setIsModalVisible(true);
  }, []);

  /**
   * Đóng modal form
   */
  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedCourse(undefined);
  }, []);

  /**
   * Lưu khóa học (thêm mới hoặc cập nhật)
   */
  const saveCourse = useCallback((values: Omit<Course, 'id'>, id?: string) => {
    setLoading(true);
    try {
      if (id) {
        // Cập nhật khóa học hiện có
        courseService.updateCourse({ ...values, id });
        message.success('Cập nhật khóa học thành công');
      } else {
        // Thêm khóa học mới
        courseService.addCourse(values);
        message.success('Thêm khóa học thành công');
      }
      loadCourses();
      closeModal();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Lỗi thao tác');
    } finally {
      setLoading(false);
    }
  }, [loadCourses, closeModal]);

  /**
   * Xóa khóa học
   */
  const deleteCourse = useCallback((courseId: string) => {
    setLoading(true);
    try {
      courseService.deleteCourse(courseId);
      message.success('Xóa khóa học thành công');
      loadCourses();
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Lỗi xóa khóa học');
    } finally {
      setLoading(false);
    }
  }, [loadCourses]);

  /**
   * Khôi phục dữ liệu mẫu
   */
  const resetData = useCallback(() => {
    setLoading(true);
    try {
      courseService.resetToSampleData();
      loadCourses();
      message.success('Đã khôi phục dữ liệu mẫu thành công');
    } catch (error) {
      message.error('Không thể khôi phục dữ liệu mẫu');
    } finally {
      setLoading(false);
    }
  }, [loadCourses]);

  /**
   * Format kích thước dữ liệu
   */
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Trả về tất cả state và methods cần thiết
  return {
    // State
    courses,
    filteredCourses,
    selectedCourse,
    isModalVisible,
    storageSize,
    loading,
    
    // Actions
    loadCourses,
    handleSearch,
    handleFilter,
    editCourse,
    addNewCourse,
    closeModal,
    saveCourse,
    deleteCourse,
    resetData,
    formatBytes
  };
};

export default useCourseModel; 