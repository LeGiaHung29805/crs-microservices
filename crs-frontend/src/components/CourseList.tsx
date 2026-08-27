import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
    courses: Course[];
    state: LoadState;
    errorMessage: string;
    onRetry: () => void;
}

export default function CourseList({ courses, state, errorMessage, onRetry }: CourseListProps) {
    if (state === 'loading') {
        return <p style={{ textAlign: 'center' }}>Đang tải danh sách môn học...</p>;
    }

    if (state === 'error') {
        return (
            <div style={{ textAlign: 'center', color: 'red' }}>
                <p>{errorMessage}</p>
                <button onClick={onRetry}>Thử lại</button>
            </div>
        );
    }

    if (state === 'empty') {
        return <p style={{ textAlign: 'center' }}>Không tìm thấy môn học nào phù hợp.</p>;
    }

    // state === 'success'
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <table style={{
                width: '100%',
                maxWidth: 700,
                borderCollapse: 'collapse',
                border: '1px solid #333',
                textAlign: 'center'
            }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #333' }}>
                        <th style={{ padding: '8px 12px', border: '1px solid #333' }}>Tên môn học</th>
                        <th style={{ padding: '8px 12px', border: '1px solid #333' }}>Số tín chỉ</th>
                        <th style={{ padding: '8px 12px', border: '1px solid #333' }}>Số chỗ còn lại</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: '8px 12px', border: '1px solid #ccc' }}>{course.tenMonHoc}</td>
                            <td style={{ padding: '8px 12px', border: '1px solid #ccc' }}>{course.soTinChi}</td>
                            <td style={{ padding: '8px 12px', border: '1px solid #ccc' }}>
                                {course.soChoConLai} / {course.soChoToiDa}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}