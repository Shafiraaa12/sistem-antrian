package com.sistemantrian.antrian.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemantrian.antrian.entity.Dokter;
import com.sistemantrian.antrian.repository.DokterRepository;

@RestController
@RequestMapping("/api/dokter")
@CrossOrigin(origins = "https://antrian-ku.vercel.app")
public class DokterController {

    private final DokterRepository dokterRepository;

    public DokterController(DokterRepository dokterRepository) {
        this.dokterRepository = dokterRepository;
    }

    @GetMapping
    public List<Dokter> getSemuaDokter() {
        return dokterRepository.findAll();
    }
}
