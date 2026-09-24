package com.sistemantrian.antrian.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.sistemantrian.antrian.entity.Dokter;
import com.sistemantrian.antrian.entity.Poli;
import com.sistemantrian.antrian.entity.User;
import com.sistemantrian.antrian.repository.DokterRepository;
import com.sistemantrian.antrian.repository.PoliRepository;
import com.sistemantrian.antrian.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            PoliRepository poliRepository,
            DokterRepository dokterRepository,
            UserRepository userRepository) {

        return args -> {

            // Data akun petugas
            if (userRepository.findByUsername("petugas").isEmpty()) {

                BCryptPasswordEncoder encoder =
                        new BCryptPasswordEncoder();

                String passwordAwal = System.getenv("PETUGAS_PASSWORD");        

                User user = new User(
                        "petugas",
                        encoder.encode(passwordAwal)
                );

                userRepository.save(user);
            }

            // Jangan membuat ulang data poli dan dokter
            if (poliRepository.count() > 0) {
                return;
            }

            // Data Poli
            Poli umum = poliRepository.save(
                    new Poli("Poli Umum"));

            Poli gigi = poliRepository.save(
                    new Poli("Poli Gigi"));

            Poli psikologi = poliRepository.save(
                    new Poli("Poli Psikologi"));

            Poli kia = poliRepository.save(
                    new Poli("Poli Kesehatan Ibu dan Anak"));

            Poli mata = poliRepository.save(
                    new Poli("Poli Mata"));

            Poli tht = poliRepository.save(
                    new Poli("Poli THT"));

            // Dokter Poli Umum
            dokterRepository.save(
                    new Dokter("Dr. Budi Santoso", umum));

            dokterRepository.save(
                    new Dokter("Dr. Andi Pratama", umum));

            dokterRepository.save(
                    new Dokter("Dr. Raka Wijaya", umum));

            // Dokter Poli Gigi
            dokterRepository.save(
                    new Dokter("drg. Sinta Maharani", gigi));

            dokterRepository.save(
                    new Dokter("drg. Fajar Nugroho", gigi));

            // Dokter Poli Psikologi
            dokterRepository.save(
                    new Dokter("Psikolog Rina Permata", psikologi));

            dokterRepository.save(
                    new Dokter("Psikolog Dinda Lestari", psikologi));

            // Dokter Poli Kesehatan Ibu dan Anak
            dokterRepository.save(
                    new Dokter("Dr. Dimas Wijaya", kia));

            dokterRepository.save(
                    new Dokter("Dr. Maya Pratiwi", kia));

            // Dokter Poli Mata
            dokterRepository.save(
                    new Dokter("Dr. Arif Nugroho", mata));

            dokterRepository.save(
                    new Dokter("Dr. Nadia Putri", mata));

            // Dokter Poli THT
            dokterRepository.save(
                    new Dokter("Dr. Fajar Ramadhan", tht));

            dokterRepository.save(
                    new Dokter("Dr. Reza Kurniawan", tht));
        };
    }
}