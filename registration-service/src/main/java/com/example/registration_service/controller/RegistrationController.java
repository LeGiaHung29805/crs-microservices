package com.example.registration_service.controller;

import com.example.registration_service.dto.RegistrationRequestDTO;
import com.example.registration_service.entity.Registration;
import com.example.registration_service.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService registrationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Registration register(@Valid @RequestBody RegistrationRequestDTO dto) {
        return registrationService.register(dto);
    }

    @DeleteMapping("/{id}")
    public void cancel(@PathVariable Long id) {
        registrationService.cancel(id);
    }

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }

    @GetMapping("/my")
    public List<Registration> getMyRegistrations(
            Authentication authentication,
            @RequestParam(required = false) Long studentId) {
        Long id = studentId;
        if (id == null && authentication != null && authentication.getCredentials() instanceof Long) {
            id = (Long) authentication.getCredentials();
        }
        if (id == null) {
            return List.of();
        }
        return registrationService.getMyRegistrations(id);
    }
}
