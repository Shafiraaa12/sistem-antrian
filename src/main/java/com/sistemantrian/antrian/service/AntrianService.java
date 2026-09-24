package com.sistemantrian.antrian.service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.sistemantrian.antrian.entity.Antrian;
import com.sistemantrian.antrian.repository.AntrianRepository;

@Service
public class AntrianService {

    private final AntrianRepository antrianRepository;

    public AntrianService(AntrianRepository antrianRepository) {
        this.antrianRepository = antrianRepository;
    }

    public Antrian tambahAntrian(
            String nomor,
            LocalDate tanggal,
            String ruang,
            com.sistemantrian.antrian.entity.Poli poli,
            com.sistemantrian.antrian.entity.Dokter dokter) {

        Antrian antrian = new Antrian(
                nomor,
                "MENUNGGU",
                tanggal,
                ruang,
                poli,
                dokter
        );

        return antrianRepository.save(antrian);
    }

    public Antrian panggilAntrian(Long id) {

        Antrian antrianBaru = antrianRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Antrean tidak ditemukan"));

        Antrian antrianSedangDipanggil =
                antrianRepository
                        .findFirstByTanggalAndPoliIdAndRuangAndStatusOrderByIdAsc(
                                antrianBaru.getTanggal(),
                                antrianBaru.getPoli().getId(),
                                antrianBaru.getRuang(),
                                "DIPANGGIL"
                        )
                        .orElse(null);

        if (antrianSedangDipanggil != null) {
            antrianSedangDipanggil.setStatus("SELESAI");
            antrianSedangDipanggil.setWaktuSelesai(LocalDateTime.now());

            antrianRepository.save(antrianSedangDipanggil);
        }

        antrianBaru.setStatus("DIPANGGIL");
        antrianBaru.setWaktuDipanggil(LocalDateTime.now());

        return antrianRepository.save(antrianBaru);
    }

    public Antrian panggilBerikutnya(
            LocalDate tanggal,
            Long poliId,
            String ruang) {

        Antrian berikutnya =
                antrianRepository
                        .findFirstByTanggalAndPoliIdAndRuangAndStatusOrderByIdAsc(
                                tanggal,
                                poliId,
                                ruang,
                                "MENUNGGU"
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Tidak ada antrean yang menunggu"
                                ));

        return panggilAntrian(berikutnya.getId());
    }

    public Antrian lewatiAntrian(Long id) {

        Antrian antrian = antrianRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Antrean tidak ditemukan"));

        antrian.setStatus("DILEWATI");
        antrian.setWaktuDilewati(LocalDateTime.now());

        return antrianRepository.save(antrian);
    }

    public Antrian selesaikanAntrian(Long id) {

        Antrian antrian = antrianRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Antrean tidak ditemukan"));

        if (!"DIPANGGIL".equals(antrian.getStatus())) {
            throw new RuntimeException(
       "Antrean hanya dapat diselesaikan jika sedang DIPANGGIL"
            );
        }

        antrian.setStatus("SELESAI");
        antrian.setWaktuSelesai(LocalDateTime.now());

        return antrianRepository.save(antrian);
    }

    public Antrian panggilUlangAntrian(Long id) {

        Antrian antrian = antrianRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Antrean tidak ditemukan"));

        if (!"DILEWATI".equals(antrian.getStatus())) {
            throw new RuntimeException(
                    "Antrean hanya dapat dipanggil ulang jika statusnya DILEWATI"
            );
        }

        if (antrian.isPernahDipanggilLagi()) {
            throw new RuntimeException(
                    "Antrean sudah pernah dipanggil ulang"
            );
        }

        antrian.setStatus("MENUNGGU");
        antrian.setWaktuPanggilUlang(LocalDateTime.now());
        antrian.setPernahDipanggilLagi(true);

        return antrianRepository.save(antrian);
    }
}