package com.sistemantrian.antrian.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Antrian {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomor;

    private String status;

    private LocalDate tanggal;

    private String ruang;

    private LocalDateTime waktuDipanggil;

    private LocalDateTime waktuSelesai;

    private LocalDateTime waktuDilewati;

    private LocalDateTime waktuPanggilUlang;

    private boolean pernahDipanggilLagi;

    @ManyToOne
    @JoinColumn(name = "poli_id")
    private Poli poli;

    @ManyToOne
    @JoinColumn(name = "dokter_id")
    private Dokter dokter;

    public Antrian() {
    }

    public Antrian(
            String nomor,
            String status,
            LocalDate tanggal,
            String ruang,
            Poli poli,
            Dokter dokter) {

        this.nomor = nomor;
        this.status = status;
        this.tanggal = tanggal;
        this.ruang = ruang;
        this.poli = poli;
        this.dokter = dokter;
        this.pernahDipanggilLagi = false;
    }

    public Long getId() {
        return id;
    }

    public String getNomor() {
        return nomor;
    }

    public void setNomor(String nomor) {
        this.nomor = nomor;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getTanggal() {
        return tanggal;
    }

    public void setTanggal(LocalDate tanggal) {
        this.tanggal = tanggal;
    }

    public String getRuang() {
        return ruang;
    }

    public void setRuang(String ruang) {
        this.ruang = ruang;
    }

    public LocalDateTime getWaktuDipanggil() {
        return waktuDipanggil;
    }

    public void setWaktuDipanggil(LocalDateTime waktuDipanggil) {
        this.waktuDipanggil = waktuDipanggil;
    }

    public LocalDateTime getWaktuSelesai() {
        return waktuSelesai;
    }

    public void setWaktuSelesai(LocalDateTime waktuSelesai) {
        this.waktuSelesai = waktuSelesai;
    }

    public LocalDateTime getWaktuDilewati() {
        return waktuDilewati;
    }

    public void setWaktuDilewati(LocalDateTime waktuDilewati) {
        this.waktuDilewati = waktuDilewati;
    }

    public LocalDateTime getWaktuPanggilUlang() {
        return waktuPanggilUlang;
    }

    public void setWaktuPanggilUlang(LocalDateTime waktuPanggilUlang) {
        this.waktuPanggilUlang = waktuPanggilUlang;
    }

    public boolean isPernahDipanggilLagi() {
        return pernahDipanggilLagi;
    }

    public void setPernahDipanggilLagi(boolean pernahDipanggilLagi) {
        this.pernahDipanggilLagi = pernahDipanggilLagi;
    }

    public Poli getPoli() {
        return poli;
    }

    public void setPoli(Poli poli) {
        this.poli = poli;
    }

    public Dokter getDokter() {
        return dokter;
    }

    public void setDokter(Dokter dokter) {
        this.dokter = dokter;
    }
}