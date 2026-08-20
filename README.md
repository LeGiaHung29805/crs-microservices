# Course Registration System (CRS) - Hệ Thống Đăng Ký Môn Học (Microservices)

Dự án này là hệ thống đăng ký môn học (Course Registration System - CRS) được xây dựng theo kiến trúc **Microservices** sử dụng Java Spring Boot và React (Vite). Hệ thống hỗ trợ sinh viên đăng nhập, tra cứu môn học, đăng ký lớp học phần, kiểm tra điều kiện sĩ số chỗ ngồi và quản lý môn học một cách độc lập qua API Gateway và cơ chế xác thực tập trung JWT.

---

## 1. Các Thành Phần Hệ Thống (System Components)

Dự án bao gồm **5 thành phần chính**:

1. **API Gateway**: Cổng định tuyến và lọc xác thực tập trung ở cổng `8080`.
2. **Auth Service (Dịch vụ Xác thực)**: Cổng xác thực và cấp mã JWT token chạy ở cổng `8081`.
3. **Course Service (Dịch vụ Môn học)**: Quản lý thông tin chi tiết môn học và sĩ số ở cổng `8083`.
4. **Registration Service (Dịch vụ Đăng ký)**: Quản lý đăng ký của sinh viên và sĩ số ở cổng `8082`.
5. **crs-frontend**: Giao diện người dùng React + TypeScript chạy ở cổng `5173`.

---

## 2. Thiết Kế Cơ Sở Dữ Liệu Riêng Biệt (Database per Service)

Để đảm bảo tính độc lập, mỗi service quản lý cơ sở dữ liệu riêng trên PostgreSQL:
* **Auth Service** (`auth_db`): Quản lý bảng `app_user` và `student`.
* **Course Service** (`course_db`): Quản lý bảng `course`.
* **Registration Service** (`registration_db`): Quản lý bảng `registration`.

---

## 3. Hướng Dẫn Chạy Thử (Quick Start)

### Yêu cầu hệ thống:
* **Java**: JDK 17
* **Node.js**: Phiên bản 18 trở lên (để chạy frontend)
* **PostgreSQL**: Hãy tạo sẵn 3 cơ sở dữ liệu trống: `auth_db`, `course_db` và `registration_db`.

### Các bước chạy:

#### Bước 1: Khởi chạy Auth Service
1. Di chuyển vào thư mục `auth-service`.
2. Tạo file `.env` từ `.env.example` và điền cấu hình kết nối database `auth_db`.
3. Khởi chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Hệ thống sẽ tự động tạo bảng dữ liệu và chèn tài khoản mẫu ở lần đầu chạy)*

#### Bước 2: Khởi chạy Course Service
1. Di chuyển vào thư mục `course-service`.
2. Tạo file `.env` từ `.env.example` và điền cấu hình kết nối database `course_db`.
3. Khởi chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Bước 3: Khởi chạy Registration Service
1. Di chuyển vào thư mục `registration-service`.
2. Tạo file `.env` từ `.env.example` và điền cấu hình kết nối database `registration_db`.
3. Khởi chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```

#### Bước 4: Khởi chạy API Gateway
1. Di chuyển vào thư mục `api-gateway`.
2. Khởi chạy ứng dụng:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(API Gateway sẽ khởi chạy tại cổng `8080`)*

#### Bước 5: Khởi chạy Frontend
1. Di chuyển vào thư mục `crs-frontend`.
2. Tạo file `.env` và thiết lập biến môi trường API Gateway:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
3. Cài đặt các gói phụ thuộc và khởi động:
   ```bash
   npm install
   npm run dev
   ```
   *(Frontend sẽ khởi chạy tại cổng `5173`)*

---

## 4. Kiểm Tra Các API Chính Qua API Gateway (Port 8080)

Do hệ thống đã tích hợp bảo mật JWT, bạn nên test theo thứ tự dưới đây:

### Bước 1: Đăng nhập để lấy Token
* **Endpoint**: `POST http://localhost:8080/api/auth/login`
* **Mẫu tài khoản sinh viên**:
  ```json
  { "username": "student1", "password": "student123" }
  ```
* **Mẫu tài khoản quản trị**:
  ```json
  { "username": "admin", "password": "admin123" }
  ```
* **Kết quả**: Trích xuất lấy giá trị `"token"` từ phản hồi.

### Bước 2: Gọi các API kiểm tra
Khi gửi request tới các API bảo mật dưới đây, bạn cần thêm Header:
`Authorization: Bearer <token_vừa_lấy>`

* **Xem danh sách môn học (Public - Không cần Token)**:
  ```
  GET http://localhost:8080/api/courses
  ```

* **Tạo mới môn học (Yêu cầu tài khoản Admin)**:
  ```
  POST http://localhost:8080/api/courses
  Body (JSON): { "tenMonHoc": "Kỹ thuật lập trình", "soTinChi": 3, "soChoToiDa": 60 }
  ```

* **Đăng ký môn học mới (Yêu cầu đăng nhập)**:
  ```
  POST http://localhost:8080/api/registrations
  Body (JSON): { "studentId": 1, "courseId": 1 }
  ```

* **Hủy đăng ký môn học (Yêu cầu đăng nhập)**:
  ```
  DELETE http://localhost:8080/api/registrations/{id}
  ```



