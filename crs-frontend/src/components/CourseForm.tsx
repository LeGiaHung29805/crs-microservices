import { useState } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
    editingCourse: Course | null; // null = dang o che do Them; co gia tri = dang Sua
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
    serverError: string | null;
}

const courseToFormValues = (editingCourse: Course | null): CourseFormValues => {
    if (!editingCourse) return emptyCourseForm;
    return {
        tenMonHoc: editingCourse.tenMonHoc ?? '',
        soTinChi: editingCourse.soTinChi != null ? String(editingCourse.soTinChi) : '',
        soChoToiDa: editingCourse.soChoToiDa != null ? String(editingCourse.soChoToiDa) : '',
    };
};

export default function CourseForm({
    editingCourse,
    onSubmit,
    onCancel,
    submitting,
    serverError,
}: CourseFormProps) {
    const [prevEditingCourse, setPrevEditingCourse] = useState<Course | null>(editingCourse);
    const [values, setValues] = useState<CourseFormValues>(() => courseToFormValues(editingCourse));
    const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});

    // Reset hoặc đồng bộ dữ liệu vào form khi editingCourse thay đổi
    if (editingCourse !== prevEditingCourse) {
        setPrevEditingCourse(editingCourse);
        setValues(courseToFormValues(editingCourse));
        setClientErrors({});
    }

    const validate = (): boolean => {
        const errors: Partial<CourseFormValues> = {};

        if (!values.tenMonHoc.trim()) {
            errors.tenMonHoc = 'Tên môn học không được để trống';
        }

        const soTinChi = Number(values.soTinChi);
        if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
            errors.soTinChi = 'Số tín chỉ phải là số lớn hơn 0';
        }

        const soChoToiDa = Number(values.soChoToiDa);
        if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
            errors.soChoToiDa = 'Số chỗ tối đa phải là số lớn hơn 0';
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(values);
        if (!editingCourse) {
            setValues(emptyCourseForm);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h3>{editingCourse ? 'Sửa môn học' : 'Thêm môn học mới'}</h3>

            <div style={{ marginBottom: 8 }}>
                <label>Tên môn học</label><br />
                <input
                    type="text"
                    value={values.tenMonHoc}
                    onChange={(e) => setValues((prev) => ({ ...prev, tenMonHoc: e.target.value }))}
                />
                {clientErrors.tenMonHoc && <p style={{ color: '#b91c1c', margin: 0 }}>{clientErrors.tenMonHoc}</p>}
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Số tín chỉ</label><br />
                <input
                    type="number"
                    value={values.soTinChi}
                    onChange={(e) => setValues((prev) => ({ ...prev, soTinChi: e.target.value }))}
                />
                {clientErrors.soTinChi && <p style={{ color: '#b91c1c', margin: 0 }}>{clientErrors.soTinChi}</p>}
            </div>

            <div style={{ marginBottom: 8 }}>
                <label>Số chỗ tối đa</label><br />
                <input
                    type="number"
                    value={values.soChoToiDa}
                    onChange={(e) => setValues((prev) => ({ ...prev, soChoToiDa: e.target.value }))}
                />
                {clientErrors.soChoToiDa && <p style={{ color: '#b91c1c', margin: 0 }}>{clientErrors.soChoToiDa}</p>}
            </div>

            {serverError && <p style={{ color: '#b91c1c' }}>{serverError}</p>}

            <button type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : (editingCourse ? 'Cập nhật' : 'Thêm mới')}
            </button>
            {editingCourse && (
                <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
                    Hủy
                </button>
            )}
        </form>
    );
}