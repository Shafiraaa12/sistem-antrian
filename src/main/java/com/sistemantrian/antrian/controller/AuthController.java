package com.sistemantrian.antrian.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemantrian.antrian.entity.User;
import com.sistemantrian.antrian.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "https://antrian-ku.vercel.app")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password) {

        User user = userRepository.findByUsername(username)
                .orElse(null);

        if (user == null ||
                !passwordEncoder.matches(password, user.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("Username atau password salah");
        }

        return ResponseEntity.ok("Login berhasil");
    }
}