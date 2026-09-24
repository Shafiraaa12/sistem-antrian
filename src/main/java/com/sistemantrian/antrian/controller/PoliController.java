package com.sistemantrian.antrian.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sistemantrian.antrian.entity.Poli;
import com.sistemantrian.antrian.repository.PoliRepository;

@RestController
@RequestMapping("/api/poli")
@CrossOrigin(origins = "https://antrian-ku.vercel.app")
public class PoliController {

    private final PoliRepository poliRepository;

    public PoliController(PoliRepository poliRepository) {
        this.poliRepository = poliRepository;
    }

    @GetMapping
    public List<Poli> getSemuaPoli() {
        return poliRepository.findAll();
    }
}
