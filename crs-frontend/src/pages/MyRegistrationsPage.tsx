import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration } from '../api/registrationApi';
import { getCourseById } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import type { Registration } from '../types/registration';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

interface RegistrationRow extends Registration {
    courseName: string;
}

export default function MyRegistrationsPage() {
    const [rows, setRows] = useState<RegistrationRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const { user } = useAuth();
    const { toast, showToast, clearToast } = useToast();

    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    const loadData = useCallback(async () => {
        setLoading(true);
        setLoadError(null);
        try {
            const res = await getMyRegistrations(user?.id);
            const activeRegistrations = res.data.filter((r) => r.trangThai === 'DA_DANG_KY');
            const enriched = await Promise.all(
                activeRegistrations.map(async (reg) => {
                    try {
                        const courseRes = await getCourseById(reg.courseId);
                        return { ...reg, courseName: (courseRes.data as Course).tenMonHoc };
                    } catch {
                        return { ...reg, courseName: `Môn học #${reg.courseId} (không tìm thấy thông tin)` };
                    }
                })
            );

            setRows(enriched);
        } catch (err) {
            let message = 'Không tải được danh sách đăng ký.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            setLoadError(message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, [loadData]);

    const handleCancel = async (row: RegistrationRow) => {
        if (!window.confirm(`Hủy đăng ký môn "${row.courseName}"?`)) return;
        setCancellingId(row.id);
        try {
            await cancelRegistration(row.id);
            showToast(`Đã hủy đăng ký môn "${row.courseName}"`, 'success');
            loadData(); // tải lại danh sách
        } catch (err) {
            let message = 'Hủy đăng ký không thành công.';
            if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
                message = err.response.data.message;
            }
            showToast(message, 'error');
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
            <h1>Môn học đã đăng ký</h1>

            {loading && <p>Đang tải...</p>}
            {!loading && loadError && <p style={{ color: '#b91c1c' }}>{loadError}</p>}
            {!loading && !loadError && rows.length === 0 && <p>Bạn chưa đăng ký môn học nào.</p>}

            {!loading && !loadError && rows.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #333' }}>
                            <th>Tên môn học</th>
                            <th>Ngày đăng ký</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td>{row.courseName}</td>
                                <td>{new Date(row.ngayDangKy).toLocaleString('vi-VN')}</td>
                                <td>
                                    <button onClick={() => handleCancel(row)} disabled={cancellingId === row.id}>
                                        {cancellingId === row.id ? 'Đang hủy...' : 'Hủy đăng ký'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        </div>
    );
}