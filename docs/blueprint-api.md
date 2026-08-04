# Tài Liệu Bản Thiết Kế API (API Blueprint) - Course Registration System (CRS)

Tài liệu này liệt kê toàn bộ các API công khai (Public) và nội bộ (Internal) của 3 microservices trong hệ thống đăng ký môn học: **Course Service**, **Student Service**, và **Registration Service**.

---

## 1. Course Service (Dịch vụ Môn học & Lớp học)

Quản lý môn học, lớp học phần và số lượng chỗ ngồi trống của lớp học.

### 1.1. Lấy danh sách lớp học phần (Public API)
* **Endpoint:** `GET /courses`
* **Mô tả:** Cho phép sinh viên xem danh sách các lớp học phần đang mở kèm thông tin về giảng viên, số tín chỉ, và số chỗ còn lại.
* **Tham số truy vấn (Query Parameters):**
  * `page` (optional): Trang hiện tại (mặc định: `0`)
  * `size` (optional): Số lượng bản ghi trên một trang (mặc định: `20`)
* **Mã phản hồi thành công:** `200 OK`
* **Dữ liệu phản hồi mẫu (Response Body):**
  ```json
  [
    {
      "id": 1,
      "courseCode": "INT2204",
      "title": "Lập trình Java cơ bản",
      "sectionCode": "INT2204_01",
      "credits": 3,
      "lecturerName": "Nguyễn Văn A",
      "maxSeats": 40,
      "remainingSeats": 12,
      "schedule": "Thứ 2 (Kíp 1-2), Phòng 301-G2"
    },
    {
      "id": 2,
      "courseCode": "INT2205",
      "title": "Cơ sở dữ liệu",
      "sectionCode": "INT2205_02",
      "credits": 4,
      "lecturerName": "Trần Thị B",
      "maxSeats": 35,
      "remainingSeats": 0,
      "schedule": "Thứ 4 (Kíp 3-4), Phòng 205-G3"
    }
  ]
  ```

### 1.2. Giữ chỗ tạm thời (Internal API)
* **Endpoint:** `POST /internal/courses/sections/{sectionCode}/reserve-seat`
* **Mô tả:** Được gọi bởi **Registration Service** để giảm số chỗ còn lại (`remainingSeats`) đi 1 khi sinh viên đăng ký. Đây là tác vụ Atomic (sử dụng khóa bi quan hoặc lạc quan để tránh race condition).
* **Mã phản hồi thành công:** `200 OK` (Giữ chỗ thành công)
* **Dữ liệu phản hồi mẫu:**
  ```json
  {
    "success": true,
    "message": "Giữ chỗ thành công lớp học phần INT2204_01",
    "sectionCode": "INT2204_01",
    "remainingSeats": 11
  }
  ```
* **Mã phản hồi lỗi:** 
  * `400 Bad Request` (Nếu lớp học phần đã hết chỗ - `remainingSeats == 0`)
  ```json
  {
    "success": false,
    "message": "Không thể giữ chỗ: Lớp học phần INT2205_02 đã hết chỗ trống.",
    "sectionCode": "INT2205_02",
    "remainingSeats": 0
  }
  ```

### 1.3. Nhả chỗ (Internal API)
* **Endpoint:** `POST /internal/courses/sections/{sectionCode}/release-seat`
* **Mô tả:** Được gọi bởi **Registration Service** khi sinh viên hủy đăng ký hoặc khi luồng đăng ký học phần thất bại ở bước sau (ví dụ: lỗi thanh toán, check điều kiện học tập thất bại sau đó). Tác vụ này sẽ tăng số chỗ còn lại (`remainingSeats`) lên 1.
* **Mã phản hồi thành công:** `200 OK`
* **Dữ liệu phản hồi mẫu:**
  ```json
  {
    "success": true,
    "message": "Hủy giữ chỗ thành công lớp học phần INT2204_01",
    "sectionCode": "INT2204_01",
    "remainingSeats": 12
  }
  ```

---

## 2. Student Service (Dịch vụ Sinh viên)

Quản lý hồ sơ học tập và điều kiện tài chính của sinh viên.

### 2.1. Tra cứu thông tin hồ sơ sinh viên (Public API)
* **Endpoint:** `GET /students/{studentCode}/profile`
* **Mô tả:** Xem thông tin cá nhân của sinh viên và trạng thái đóng học phí.
* **Mã phản hồi thành công:** `200 OK`
* **Dữ liệu phản hồi mẫu:**
  ```json
  {
    "studentCode": "SV1024",
    "fullname": "Nguyễn Hoàng Nam",
    "email": "namnh@sis.edu.vn",
    "tuitionStatus": "PAID"
  }
  ```

### 2.2. Kiểm tra điều kiện đăng ký môn học (Internal/Public API)
* **Endpoint:** `GET /students/{studentCode}/eligibility`
* **Mô tả:** Được gọi bởi **Registration Service** để kiểm tra sinh viên có đủ điều kiện đăng ký môn học đích hay không (không nợ học phí và đã vượt qua môn tiên quyết).
* **Tham số truy vấn (Query Parameters):**
  * `courseCode` (required): Mã môn học muốn đăng ký (Ví dụ: `INT2205`)
* **Mã phản hồi thành công:** `200 OK`
* **Dữ liệu phản hồi mẫu (Đủ điều kiện):**
  ```json
  {
    "studentCode": "SV1024",
    "courseCode": "INT2205",
    "eligible": true,
    "reason": "Sinh viên đủ điều kiện đóng học phí và đã hoàn thành môn tiên quyết (INT2204)."
  }
  ```
* **Dữ liệu phản hồi mẫu (Không đủ điều kiện):**
  ```json
  {
    "studentCode": "SV1024",
    "courseCode": "INT2205",
    "eligible": false,
    "reason": "Sinh viên chưa hoàn thành môn học tiên quyết bắt buộc (INT2204)."
  }
  ```

---

## 3. Registration Service (Dịch vụ Đăng ký học phần)

Tiếp nhận yêu cầu đăng ký của sinh viên, đóng vai trò điều phối luồng quy trình (Orchestrator).

### 3.1. Đăng ký lớp học phần (Public API)
* **Endpoint:** `POST /registrations`
* **Mô tả:** Tiếp nhận yêu cầu đăng ký lớp học phần từ sinh viên.
* **Yêu cầu dữ liệu gửi lên (Request Body):**
  ```json
  {
    "studentCode": "SV1024",
    "sectionCode": "INT2204_01",
    "courseCode": "INT2204"
  }
  ```
* **Quy trình xử lý nội bộ:**
  1. Kiểm tra điều kiện học tập & học phí qua `Student Service` (Gọi API `GET /students/SV1024/eligibility?courseCode=INT2204`).
  2. Nếu không hợp lệ -> Báo lỗi và dừng luồng.
  3. Nếu hợp lệ -> Gọi sang `Course Service` giữ chỗ (Gọi API `POST /internal/courses/sections/INT2204_01/reserve-seat`).
  4. Nếu giữ chỗ thành công -> Lưu bản ghi đăng ký vào `registration_db` với trạng thái `SUCCESS`.
  5. Nếu giữ chỗ thất bại (hết chỗ) -> Ghi nhận trạng thái `FAILED`, thông báo lớp hết chỗ.
* **Mã phản hồi mẫu (Thành công - 201 Created):**
  ```json
  {
    "registrationId": 142,
    "studentCode": "SV1024",
    "sectionCode": "INT2204_01",
    "status": "SUCCESS",
    "registeredAt": "2026-08-04T08:50:00Z"
  }
  ```
* **Mã phản hồi mẫu (Thất bại - 400 Bad Request):**
  ```json
  {
    "status": "FAILED",
    "message": "Đăng ký thất bại: Lớp học phần đã hết chỗ ngồi trống."
  }
  ```

### 3.2. Hủy đăng ký lớp học phần (Public API)
* **Endpoint:** `DELETE /registrations`
* **Mô tả:** Sinh viên hủy môn học đã đăng ký thành công trước đó để chọn lớp khác.
* **Yêu cầu dữ liệu gửi lên (Request Body):**
  ```json
  {
    "studentCode": "SV1024",
    "sectionCode": "INT2204_01"
  }
  ```
* **Quy trình xử lý nội bộ:**
  1. Tìm bản ghi đăng ký hiện tại trong `registration_db`, cập nhật trạng thái thành `CANCELLED`.
  2. Gọi sang `Course Service` để nhả chỗ (API `POST /internal/courses/sections/INT2204_01/release-seat`).
* **Mã phản hồi mẫu (Thành công - 200 OK):**
  ```json
  {
    "studentCode": "SV1024",
    "sectionCode": "INT2204_01",
    "status": "CANCELLED",
    "message": "Hủy đăng ký lớp học phần thành công. Chỗ trống đã được giải phóng."
  }
  ```

### 3.3. Xem danh sách môn học đã đăng ký của sinh viên (Public API)
* **Endpoint:** `GET /registrations/student/{studentCode}`
* **Mô tả:** Cho phép sinh viên xem lại các học phần mình đã đăng ký thành công trong kỳ học hiện tại.
* **Mã phản hồi thành công:** `200 OK`
* **Dữ liệu phản hồi mẫu:**
  ```json
  {
    "studentCode": "SV1024",
    "semester": "Học kỳ 1 - 2026",
    "registeredSections": [
      {
        "sectionCode": "INT2204_01",
        "title": "Lập trình Java cơ bản",
        "credits": 3,
        "status": "SUCCESS"
      }
    ]
  }
  ```
