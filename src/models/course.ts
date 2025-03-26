export enum CourseStatus {
    OPEN = 'Đang mở',
    CLOSED = 'Đã kết thúc', 
    PAUSED = 'Tạm dừng'
  }
  
export interface Course {
    id: string;
    name: string;
    instructor: string;
    description: string;
    status: CourseStatus;
    studentCount: number;
}