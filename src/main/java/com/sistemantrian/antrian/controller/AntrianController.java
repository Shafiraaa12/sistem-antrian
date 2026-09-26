package com.sistemantrian.antrian.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sistemantrian.antrian.entity.Antrian;
import com.sistemantrian.antrian.entity.Dokter;
import com.sistemantrian.antrian.entity.Poli;
import com.sistemantrian.antrian.repository.AntrianRepository;
import com.sistemantrian.antrian.repository.DokterRepository;
import com.sistemantrian.antrian.repository.PoliRepository;
import com.sistemantrian.antrian.service.AntrianService;

@RestController
@RequestMapping("/api/antrian")
@CrossOrigin(origins = "https://antrian-ku.vercel.app")
public class AntrianController {

    private final AntrianRepository antrianRepository;
    private final AntrianService antrianService;
    private final PoliRepository poliRepository;
    private final DokterRepository dokterRepository;

    public AntrianController(
            AntrianRepository antrianRepository,
            AntrianService antrianService,
            PoliRepository poliRepository,
            DokterRepository dokterRepository) {

        this.antrianRepository = antrianRepository;
        this.antrianService = antrianService;
        this.poliRepository = poliRepository;
        this.dokterRepository = dokterRepository;
    }

    @GetMapping
    public List<Antrian> getSemuaAntrian() {
        return antrianRepository.findAll();
    }

    @GetMapping("/hari-ini")
    public List<Antrian> getAntrianHariIni() {
        return antrianRepository.findByTanggalOrderByIdAsc(
            LocalDate.now()
        );
    }

    @PostMapping
    public Antrian tambahAntrian(
            @RequestParam String nomor,
            @RequestParam LocalDate tanggal,
            @RequestParam String ruang,
            @RequestParam Long poliId,
            @RequestParam Long dokterId) {

        Poli poli = poliRepository.findById(poliId)
                .orElseThrow(() -> new RuntimeException("Poli tidak ditemukan"));

        Dokter dokter = dokterRepository.findById(dokterId)
                .orElseThrow(() -> new RuntimeException("Dokter tidak ditemukan"));

        return antrianService.tambahAntrian(
                nomor,
                tanggal,
                ruang,
                poli,
                dokter
        );
    }

    @PostMapping("/{id}/panggil")
    public Antrian panggilAntrian(@PathVariable Long id) {
        return antrianService.panggilAntrian(id);
    }

    @PostMapping("/berikutnya")
    public Antrian panggilBerikutnya(
            @RequestParam LocalDate tanggal,
            @RequestParam Long poliId,
            @RequestParam String ruang) {

        return antrianService.panggilBerikutnya(
                tanggal,
                poliId,
                ruang
        );
    }

    @PostMapping("/{id}/lewati")
    public Antrian lewatiAntrian(@PathVariable Long id) {
        return antrianService.lewatiAntrian(id);
    }

    @PostMapping("/{id}/selesai")
    public Antrian selesaikanAntrian(@PathVariable Long id) {
        return antrianService.selesaikanAntrian(id);
    }

    @PostMapping("/{id}/panggil-ulang")
    public Antrian panggilUlangAntrian(@PathVariable Long id) {
        return antrianService.panggilUlangAntrian(id);
    }
}