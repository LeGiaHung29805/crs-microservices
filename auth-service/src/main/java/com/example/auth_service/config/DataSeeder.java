package com.example.auth_service.config;

import com.example.auth_service.entity.User;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }
        if (userRepository.findByUsername("student1").isEmpty()) {
            User student1 = new User();
            student1.setUsername("student1");
            student1.setPassword(passwordEncoder.encode("student123"));
            student1.setRole("STUDENT");
            userRepository.save(student1);
        }
        if (userRepository.findByUsername("student2").isEmpty()) {
            User student2 = new User();
            student2.setUsername("student2");
            student2.setPassword(passwordEncoder.encode("student123"));
            student2.setRole("STUDENT");
            userRepository.save(student2);
        }
    }
}
