package com.example.auth_service.security;

import com.example.auth_service.dto.LoginRequestDTO;
import com.example.auth_service.dto.LoginResponseDTO;
import com.example.auth_service.entity.User;
import com.example.auth_service.exception.InvalidCredentialsException;
import com.example.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.auth_service.security.JwtUtil;
@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    public LoginResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Sai username hoac password"));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
        {
            throw new InvalidCredentialsException("Sai username hoac password");
        }
        String token = jwtUtil.generateToken((long) user.getId(), user.getUsername(), user.getRole());
        return new LoginResponseDTO((long) user.getId(), token, user.getUsername(), user.getRole());
    }
}

