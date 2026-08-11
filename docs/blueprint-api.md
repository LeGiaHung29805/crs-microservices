# Tài Liệu Bản Thiết Kế API (API Blueprint) - Course Registration System (CRS)

Tài liệu này liệt kê toàn bộ các API thực tế đã được triển khai của các dịch vụ trong hệ thống đăng ký môn học CRS.

---

## 1. Course Service (Dịch vụ Môn học)
Quản lý thông tin chi tiết môn học và số lượng chỗ ngồi còn lại cho từng môn.

### API đã triển khai:

#### 1.1. Lấy danh sách toàn bộ môn học
* **Endpoint**: `GET /courses`
* **Mô tả**: Trả về danh sách tất cả các môn học hiện có trong cơ sở dữ liệu.
* **Mã phản hồi**:
  * `200 OK`: Thành công. Trả về mảng JSON chứa các `CourseDTO`.

#### 1.2. Lấy chi tiết môn học theo ID
* **Endpoint**: `GET /courses/{id}`
* **Mô tả**: Trả về thông tin chi tiết của một môn học cụ thể dựa vào ID.
* **Mã phản hồi**:
  * `200 OK`: Thành công.
  * `404 Not Found`: Không tìm thấy môn học với ID cung cấp.

#### 1.3. Tạo mới môn học
* **Endpoint**: `POST /courses`
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
  * `201 Created`: Tạo thành công. Trả về `CourseDTO` đã tạo.
  * `400 Bad Request`: Dữ liệu không hợp lệ (Ví dụ: tên môn học để trống, số tín chỉ < 1) hoặc tên môn học đã tồn tại (không phân biệt chữ hoa chữ thường).

#### 1.4. Cập nhật môn học theo ID
* **Endpoint**: `PUT /courses/{id}`
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
  * `200 OK`: Cập nhật thành công. Trả về `CourseDTO` mới cập nhật.
  * `404 Not Found`: Không tìm thấy môn học cần cập nhật.
  * `400 Bad Request`: Dữ liệu đầu vào không hợp lệ.

#### 1.5. Xóa môn học theo ID
* **Endpoint**: `DELETE /courses/{id}`
* **Mã phản hồi**:
  * `204 No Content`: Xóa thành công.
  * `404 Not Found`: Không tìm thấy môn học để xóa.

#### 1.6. Đặt chỗ cho môn học (Internal API)
* **Endpoint**: `PATCH /internal/courses/{id}/reserve-seat`
* **Mô tả**: Trừ bớt 1 chỗ trống của môn học khi có sinh viên đăng ký thành công.
* **Mã phản hồi**:
  * `200 OK`: Đặt chỗ thành công. Trả về `CourseDTO` mới cập nhật.
  * `404 Not Found`: Không tìm thấy môn học.
  * `409 Conflict`: Môn học đã hết chỗ, không thể đăng ký.

#### 1.7. Giải phóng chỗ cho môn học (Internal API)
* **Endpoint**: `PATCH /internal/courses/{id}/release-seat`
* **Mô tả**: Cộng lại 1 chỗ trống khi sinh viên hủy đăng ký môn học.
* **Mã phản hồi**:
  * `200 OK`: Giải phóng chỗ thành công. Trả về `CourseDTO`.
  * `404 Not Found`: Không tìm thấy môn học.

---

## 2. Registration Service (Dịch vụ Đăng ký)
Quản lý đăng ký môn học của sinh viên và phối hợp với Course Service để quản lý sĩ số.

### API đã triển khai:

#### 2.1. Đăng ký môn học mới
* **Endpoint**: `POST /registrations`
* **Content-Type**: `application/json`
* **Body Request**:
  ```json
  {
    "studentId": 1,
    "courseId": 2
  }
  ```
* **Mã phản hồi**:
  * `201 Created`: Đăng ký thành công. Trả về thông tin `Registration`.
  * `409 Conflict`: Sinh viên đã đăng ký môn học này trước đó, hoặc lớp học đã hết chỗ, hoặc môn học không tồn tại.
  * `400 Bad Request`: Dữ liệu đầu vào thiếu thông tin bắt buộc.

#### 2.2. Hủy đăng ký môn học
* **Endpoint**: `DELETE /registrations/{id}`
* **Mô tả**: Hủy đăng ký môn học hiện tại theo ID của lượt đăng ký. Đồng thời khôi phục lại 1 chỗ trống cho môn học tương ứng.
* **Mã phản hồi**:
  * `200 OK`: Hủy thành công.
  * `404 Not Found`: Không tìm thấy đăng ký với ID tương ứng.
  * `409 Conflict`: Đăng ký này đã được hủy trước đó.

#### 2.3. Lấy toàn bộ danh sách đăng ký
* **Endpoint**: `GET /registrations`
* **Mô tả**: Trả về toàn bộ danh sách các lượt đăng ký có trong hệ thống (bao gồm cả trạng thái đăng ký và đã hủy).
* **Mã phản hồi**:
  * `200 OK`: Thành công. Trả về danh sách JSON chứa các `Registration`.

