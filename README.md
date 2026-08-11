# Course Registration System (CRS) - Hệ Thống Đăng Ký Môn Học (Microservices)

Dự án này là hệ thống đăng ký môn học (Course Registration System - CRS) được xây dựng theo kiến trúc **Microservices** sử dụng Java Spring Boot. Hệ thống hỗ trợ sinh viên tra cứu môn học, đăng ký lớp học phần, kiểm tra điều kiện tiên quyết và quản lý số lượng chỗ ngồi của từng lớp học phần một cách độc lập và hiệu năng cao.

---

## 1. Các Thành Phần Hệ Thống (System Components)

Dự án dự kiến bao gồm **4 thành phần chính**:

1. **API Gateway**
2. **Course Service (Dịch vụ Môn học)**
3. **Student Service (Dịch vụ Sinh viên)**
4. **Registration Service (Dịch vụ Đăng ký)**

---

## 2. Thiết Kế Cơ Sở Dữ Liệu Riêng Biệt (Database per Service)

Để đảm bảo tính độc lập, mỗi service quản lý cơ sở dữ liệu riêng (không JOIN SQL trực tiếp):
* **Course Service** (`course_db`)

---

## 3. Hướng Dẫn Chạy Thử (Quick Start)

Hiện tại, **Course Service** đã được cấu hình và sẵn sàng chạy thử.

### Yêu cầu hệ thống:
* **Java**: JDK 17
* **Maven**: (Sử dụng Maven Wrapper đính kèm)

### Các bước chạy:

#### Bước 1: Khởi chạy Course Service
1. Di chuyển vào thư mục `course-service`:
   ```bash
   cd course-service
   ```
2. Tạo cấu hình môi trường: Sao chép `.env.example` thành `.env` và chỉnh sửa các thông tin kết nối cơ sở dữ liệu `course_db` của bạn.
3. Chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```
   *Dịch vụ sẽ khởi chạy tại cổng `8081`.*

#### Bước 2: Khởi chạy Registration Service
1. Di chuyển vào thư mục `registration-service`:
   ```bash
   cd registration-service
   ```
2. Tạo cấu hình môi trường: Tạo file `.env` với các biến môi trường kết nối cơ sở dữ liệu `registration_db` tương tự như `course-service`.
3. Chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```
   *Dịch vụ sẽ khởi chạy tại cổng `8082`.*

---

## 4. Kiểm tra các API chính

* **Lấy danh sách môn học**:
  ```
  GET http://localhost:8081/courses
  ```
* **Lấy danh sách đăng ký môn học**:
  ```
  GET http://localhost:8082/registrations
  ```
* **Đăng ký môn học mới**:
  ```
  POST http://localhost:8082/registrations
  Body (JSON): { "studentId": 1, "courseId": 2 }
  ```
* **Hủy đăng ký môn học**:
  ```
  DELETE http://localhost:8082/registrations/{id}
  ```

