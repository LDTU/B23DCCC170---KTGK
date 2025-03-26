import { Course, CourseStatus } from '../models/course';
import { v4 as uuidv4 } from 'uuid';

// Dữ liệu mẫu ban đầu
const initialCourses: Omit<Course, 'id'>[] = [
  {
    name: 'Lập trình React cơ bản',
    instructor: 'Lưu Đức Tuấn',
    description: 'Khóa học dành cho người mới bắt đầu học React',
    status: CourseStatus.OPEN,
    studentCount: 15
  },
  {
    name: 'Python cho người mới bắt đầu',
    instructor: 'Trần Đức Định',
    description: 'Học lập trình Python từ cơ bản đến nâng cao',
    status: CourseStatus.OPEN,
    studentCount: 20
  },
  {
    name: 'Angular nâng cao',
    instructor: 'Nguyễn Minh Đức',
    description: 'Những kỹ thuật nâng cao trong Angular',
    status: CourseStatus.PAUSED,
    studentCount: 8
  },
  {
    name: 'NodeJS và ExpressJS',
    instructor: 'Nguyễn Viết Sang',
    description: 'Xây dựng web backend với NodeJS và ExpressJS',
    status: CourseStatus.CLOSED,
    studentCount: 0
  },
];

class CourseService {
  private storageKey = 'courses';

  constructor() {
    this.initializeData();
  }

  // Khởi tạo dữ liệu mẫu nếu chưa có trong localStorage
  private initializeData(): void {
    if (!localStorage.getItem(this.storageKey)) {
      const courses = initialCourses.map(course => ({
        ...course,
        id: uuidv4()
      }));
      localStorage.setItem(this.storageKey, JSON.stringify(courses));
    }
  }

  getCourses(): Course[] {
    const courses = localStorage.getItem(this.storageKey);
    return courses ? JSON.parse(courses) : [];
  }

  addCourse(course: Omit<Course, 'id'>): Course {
    const courses = this.getCourses();
    const newCourse = { ...course, id: uuidv4() };
    
    // Kiểm tra trùng tên
    const isDuplicate = courses.some(c => c.name === newCourse.name);
    if (isDuplicate) {
      throw new Error('Tên khóa học đã tồn tại');
    }

    courses.push(newCourse);
    localStorage.setItem(this.storageKey, JSON.stringify(courses));
    return newCourse;
  }

  updateCourse(updatedCourse: Course): Course {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === updatedCourse.id);
    
    if (index === -1) {
      throw new Error('Khóa học không tồn tại');
    }
    
    // Kiểm tra trùng tên (không tính chính nó)
    const isDuplicate = courses.some(c => 
      c.name === updatedCourse.name && c.id !== updatedCourse.id
    );
    
    if (isDuplicate) {
      throw new Error('Tên khóa học đã tồn tại');
    }

    courses[index] = updatedCourse;
    localStorage.setItem(this.storageKey, JSON.stringify(courses));
    return updatedCourse;
  }

  deleteCourse(courseId: string): void {
    const courses = this.getCourses();
    const courseToDelete = courses.find(c => c.id === courseId);

    if (!courseToDelete) {
      throw new Error('Khóa học không tồn tại');
    }

    if (courseToDelete.studentCount > 0) {
      throw new Error('Không thể xóa khóa học đã có học viên');
    }

    const filteredCourses = courses.filter(c => c.id !== courseId);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredCourses));
  }

  // Xóa tất cả dữ liệu khóa học
  clearAllCourses(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Khôi phục dữ liệu mẫu
  resetToSampleData(): void {
    this.clearAllCourses();
    this.initializeData();
  }

  // Lấy kích thước dữ liệu đang lưu trữ (bytes)
  getStorageSize(): number {
    const courses = localStorage.getItem(this.storageKey);
    return courses ? new Blob([courses]).size : 0;
  }
}

export default new CourseService();