package com.example.course_service.repository;

import com.example.course_service.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByTenMonHocIgnoreCase(String tenMonHoc);
    Page<Course> findByTenMonHocContainingIgnoreCase(String tenMonHoc, Pageable pageable);
}
