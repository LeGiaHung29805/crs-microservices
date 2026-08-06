# Tài Liệu Bản Thiết Kế API (API Blueprint) - Course Registration System (CRS)

Tài liệu này liệt kê toàn bộ các API thực tế đã được triển khai của **Course Service** trong hệ thống đăng ký môn học CRS.

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
