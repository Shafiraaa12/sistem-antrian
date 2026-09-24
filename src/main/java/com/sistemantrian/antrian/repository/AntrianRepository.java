package com.sistemantrian.antrian.repository;

import com.sistemantrian.antrian.entity.Antrian;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AntrianRepository extends JpaRepository<Antrian, Long> {

    List<Antrian> findByTanggalOrderByIdAsc(LocalDate tanggal);

    List<Antrian> findByTanggalAndPoliIdAndRuangOrderByIdAsc(
            LocalDate tanggal,
            Long poliId,
            String ruang);

    Optional<Antrian> findFirstByTanggalAndPoliIdAndRuangAndStatusOrderByIdAsc(
            LocalDate tanggal,
            Long poliId,
            String ruang,
            String status);

    // Antrean normal yang belum pernah dipanggil ulang        
    Optional<Antrian> findFirstByTanggalAndPoliIdAndRuangAndStatusAndPernahDipanggilLagiFalseOrderByIdAsc(
            LocalDate tanggal,
            Long poliId,
            String ruang,
            String status);

    // Antrean yang sudah dipanggil ulang,
    // diurutkan berdasarkan waktu panggil ulang
    Optional<Antrian> findFirstByTanggalAndPoliIdAndRuangAndStatusAndPernahDipanggilLagiTrueOrderByWaktuPanggilUlangAsc(
            LocalDate tanggal,
            Long poliId,
            String ruang,
            String status);        
}