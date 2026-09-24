package com.sistemantrian.antrian.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Dokter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nama;

    @ManyToOne
    @JoinColumn(name = "poli_id")
    private Poli poli;

    public Dokter() {
    }

    public Dokter(String nama, Poli poli) {
        this.nama = nama;
        this.poli = poli;
    }

    public Long getId() {
        return id;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public Poli getPoli() {
        return poli;
    }

    public void setPoli(Poli poli) {
        this.poli = poli;
    }
}