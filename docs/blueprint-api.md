# Tài Liệu Bản Thiết Kế API (API Blueprint) - Course Registration System (CRS)

Tài liệu này liệt kê toàn bộ các API thực tế đã được triển khai của các dịch vụ trong hệ thống đăng ký môn học CRS.

> [!IMPORTANT]
> **Base URL của hệ thống qua API Gateway:** `http://localhost:8080/api`
>
> Tất cả các request từ phía Frontend hoặc Client cần được gửi qua API Gateway ở cổng `8080`. API Gateway sẽ chịu trách nhiệm định tuyến (routing) và kiểm tra sơ bộ quyền truy cập (Authentication Header).

---

## 1. Auth Service (Dịch vụ Xác thực)
Quản lý đăng nhập và cấp phát mã thông báo JWT.
* **Cổng chạy trực tiếp (Internal Port):** `8081`
* **Định tuyến qua Gateway:** `/api/auth/**` -> `/auth/**`

### 1.1. Đăng nhập hệ thống (Login)
* **Endpoint**: `POST /api/auth/login`
* **Mô tả**: Xác thực tài khoản người dùng và trả về JWT token.
* **Quyền truy cập**: Public (Không yêu cầu Token)
* **Content-Type**: `application/json`
* **Body Request**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
  *(Tài khoản mẫu: `admin` / `admin123` [Role: ADMIN], `student1` / `student123` [Role: STUDENT])*
* **Mã phản hồi**:
  * `200 OK`: Đăng nhập thành công.
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsIn...",
      "username": "admin",
      "role": "ADMIN"
    }
    ```
  * `401 Unauthorized`: Sai tài khoản hoặc mật khẩu.

---

## 2. Course Service (Dịch vụ Môn học)
Quản lý thông tin chi tiết môn học và số lượng chỗ ngồi còn lại cho từng môn.
* **Cổng chạy trực tiếp (Internal Port):** `8083`
* **Định tuyến qua Gateway:** `/api/courses/**` -> `/courses/**` và `/api/public/courses` -> `/courses`

### API đã triển khai:

#### 2.1. Lấy danh sách toàn bộ môn học
* **Endpoint**: `GET /api/courses`
* **Mô tả**: Trả về danh sách phân trang tất cả các môn học hiện có.
* **Quyền truy cập**: Public (Không yêu cầu Token)
* **Mã phản hồi**:
  * `200 OK`: Thành công. Trả về mảng JSON chứa các môn học.

#### 2.2. Lấy chi tiết môn học theo ID
* **Endpoint**: `GET /api/courses/{id}`
* **Mô tả**: Trả về thông tin chi tiết của một môn học cụ thể dựa vào ID.
* **Quyền truy cập**: Public (Không yêu cầu Token)
* **Mã phản hồi**:
  * `200 OK`: Thành công.
  * `404 Not Found`: Không tìm thấy môn học với ID cung cấp.

#### 2.3. Tạo mới môn học
* **Endpoint**: `POST /api/courses`
* **Mô tả**: Tạo mới một môn học.
* **Quyền truy cập**: Yêu cầu JWT Token (Role: `ADMIN`)
* **Headers**: `Authorization: Bearer <token>`
* **Content-Type**: `application/json`
* **Body Request**:
  ```json
  {
    "tenMonHoc": "Mathematics",
    "soTinChi": 3,
    "soChoToiDa": 50
  }
  ```
* **Mã phản hồi**:
  * `201 Created`: Tạo thành công. Trả về thông tin môn học đã tạo.
  * `400 Bad Request`: Tên môn học để trống, số tín chỉ < 1 hoặc tên môn học đã tồn tại.
  * `401 Unauthorized`: Token không hợp lệ hoặc thiếu Token.
  * `403 Forbidden`: Quyền truy cập không hợp lệ (không phải ADMIN).

#### 2.4. Cập nhật môn học theo ID
* **Endpoint**: `PUT /api/courses/{id}`
* **Mô tả**: Cập nhật thông tin môn học.
* **Quyền truy cập**: Yêu cầu JWT Token (Role: `ADMIN`)
* **Headers**: `Authorization: Bearer <token>`
* **Content-Type**: `application/json`
* **Body Request**:
  ```json
  {
    "tenMonHoc": "Advanced Mathematics",
    "soTinChi": 4,
    "soChoToiDa": 60
  }
  ```
* **Mã phản hồi**:
  * `200 OK`: Cập nhật thành công.
  * `400 Bad Request`: Dữ liệu đầu vào không hợp lệ.
  * `401 Unauthorized` / `403 Forbidden`: Lỗi xác thực hoặc phân quyền.
  * `404 Not Found`: Không tìm thấy môn học.

#### 2.5. Xóa môn học theo ID
* **Endpoint**: `DELETE /api/courses/{id}`
* **Mô tả**: Xóa môn học ra khỏi hệ thống.
* **Quyền truy cập**: Yêu cầu JWT Token (Role: `ADMIN`)
* **Headers**: `Authorization: Bearer <token>`
* **Mã phản hồi**:
  * `204 No Content`: Xóa thành công.
  * `401 Unauthorized` / `403 Forbidden`: Lỗi xác thực hoặc phân quyền.
  * `404 Not Found`: Không tìm thấy môn học.

#### 2.6. Đặt chỗ cho môn học (Internal API)
* **Endpoint**: `PATCH /internal/courses/{id}/reserve-seat`
* **Mô tả**: Gọi nội bộ từ Registration Service qua mạng nội bộ để trừ bớt 1 chỗ trống khi đăng ký thành công.
* **Quyền truy cập**: Chỉ gọi nội bộ (Bypass Security)
* **Mã phản hồi**:
  * `200 OK`: Đặt chỗ thành công.
  * `404 Not Found`: Không tìm thấy môn học.
  * `409 Conflict`: Môn học đã hết chỗ, không thể đăng ký.

#### 2.7. Giải phóng chỗ cho môn học (Internal API)
* **Endpoint**: `PATCH /internal/courses/{id}/release-seat`
* **Mô tả**: Gọi nội bộ từ Registration Service qua mạng nội bộ để cộng lại 1 chỗ trống khi hủy đăng ký.
* **Quyền truy cập**: Chỉ gọi nội bộ (Bypass Security)
* **Mã phản hồi**:
  * `200 OK`: Giải phóng chỗ thành công.
  * `404 Not Found`: Không tìm thấy môn học.

---

## 3. Registration Service (Dịch vụ Đăng ký)
Quản lý đăng ký môn học của sinh viên và phối hợp với Course Service để quản lý sĩ số.
* **Cổng chạy trực tiếp (Internal Port):** `8082`
* **Định tuyến qua Gateway:** `/api/registrations/**` -> `/registrations/**`

### API đã triển khai:

#### 3.1. Đăng ký môn học mới
* **Endpoint**: `POST /api/registrations`
* **Mô tả**: Đăng ký một môn học mới cho sinh viên hiện tại.
* **Quyền truy cập**: Yêu cầu JWT Token (Đã xác thực)
* **Headers**: `Authorization: Bearer <token>`
* **Content-Type**: `application/json`
* **Body Request**:
  ```json
  {
    "studentId": 1,
    "courseId": 2
  }
  ```
* **Mã phản hồi**:
  * `201 Created`: Đăng ký thành công. Trả về thông tin lượt đăng ký.
  * `400 Bad Request`: Dữ liệu đầu vào thiếu thông tin bắt buộc.
  * `401 Unauthorized`: Chưa xác thực JWT.
  * `409 Conflict`: Sinh viên đã đăng ký môn học này trước đó, hoặc lớp học đã hết chỗ, hoặc môn học không tồn tại.

#### 3.2. Hủy đăng ký môn học
* **Endpoint**: `DELETE /api/registrations/{id}`
* **Mô tả**: Hủy đăng ký môn học hiện tại theo ID của lượt đăng ký. Đồng thời khôi phục lại 1 chỗ trống cho môn học tương ứng.
* **Quyền truy cập**: Yêu cầu JWT Token (Đã xác thực)
* **Headers**: `Authorization: Bearer <token>`
* **Mã phản hồi**:
  * `200 OK`: Hủy thành công.
  * `401 Unauthorized`: Chưa xác thực JWT.
  * `404 Not Found`: Không tìm thấy đăng ký với ID tương ứng.
  * `409 Conflict`: Đăng ký này đã được hủy trước đó.

#### 3.3. Lấy toàn bộ danh sách đăng ký
* **Endpoint**: `GET /api/registrations`
* **Mô tả**: Trả về toàn bộ danh sách các lượt đăng ký có trong hệ thống (bao gồm cả trạng thái đăng ký và đã hủy).
* **Quyền truy cập**: Yêu cầu JWT Token (Đã xác thực)
* **Headers**: `Authorization: Bearer <token>`
* **Mã phản hồi**:
  * `200 OK`: Thành công. Trả về danh sách JSON chứa các `Registration`.


