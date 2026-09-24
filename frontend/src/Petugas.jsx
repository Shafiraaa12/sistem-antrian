import { useEffect, useState } from "react";
import "./Petugas.css";

const API = "http://localhost:8081/api/antrian";
const POLI_API = "http://localhost:8081/api/poli";
const DOKTER_API = "http://localhost:8081/api/dokter";

const ruangList = [
  { nama: "Ruang 1", poliId: 1, poli: "Poli Umum" },
  { nama: "Ruang 2", poliId: 1, poli: "Poli Umum" },
  { nama: "Ruang 3", poliId: 2, poli: "Poli Gigi" },
  { nama: "Ruang 4", poliId: 3, poli: "Poli Psikologi" },
  {
    nama: "Ruang 5",
    poliId: 4,
    poli: "Poli Kesehatan Ibu dan Anak",
  },
  {
    nama: "Ruang 6",
    poliId: 4,
    poli: "Poli Kesehatan Ibu dan Anak",
  },
  { nama: "Ruang 7", poliId: 5, poli: "Poli Mata" },
  { nama: "Ruang 8", poliId: 6, poli: "Poli THT" },
];

function Petugas() {
  const handleLogout = () => {
    sessionStorage.removeItem("isLogin");
    window.location.href = "/login";
  };  
  const [antrian, setAntrian] = useState([]);
  const [poliList, setPoliList] = useState([]);
  const [dokterList, setDokterList] = useState([]);

  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [poliId, setPoliId] = useState("");
  const [dokterId, setDokterId] = useState("");
  const [ruang, setRuang] = useState("");
  const [nomor, setNomor] = useState("");

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  const [showRiwayat, setShowRiwayat] = useState(false);
  const [riwayatRuang, setRiwayatRuang] = useState(null);

  // =========================
  // AMBIL DATA
  // =========================

  const ambilData = async () => {
    try {
      const [antrianResponse, poliResponse, dokterResponse] =
        await Promise.all([
          fetch(API),
          fetch(POLI_API),
          fetch(DOKTER_API),
        ]);

      if (
        !antrianResponse.ok ||
        !poliResponse.ok ||
        !dokterResponse.ok
      ) {
        throw new Error("Gagal mengambil data.");
      }

      const antrianData = await antrianResponse.json();
      const poliData = await poliResponse.json();
      const dokterData = await dokterResponse.json();

      setAntrian(antrianData);
      setPoliList(poliData);
      setDokterList(dokterData);
    } catch (error) {
      console.error(error);
      setPesan("Gagal mengambil data dari server.");
    }
  };

  useEffect(() => {
    ambilData();
  }, []);

  // =========================
  // FILTER DATA
  // =========================

  const getAntrianRuangan = (namaRuang, idPoli) => {
    return antrian
      .filter(
        (item) =>
          item.tanggal === tanggal &&
          item.ruang === namaRuang &&
          item.poli?.id === idPoli
      )
      .sort((a, b) => a.id - b.id);
  };

  const getDokterUntukPoli = () => {
    if (!poliId) return [];

    return dokterList.filter(
      (dokter) =>
        dokter.poli &&
        Number(dokter.poli.id) === Number(poliId)
    );
  };

  const getRuangUntukPoli = () => {
    if (!poliId) return [];

    return ruangList.filter(
      (item) =>
        Number(item.poliId) === Number(poliId)
    );
  };

  // =========================
  // PILIH POLI
  // =========================

  const handlePoliChange = (value) => {
    setPoliId(value);
    setDokterId("");
    setRuang("");
  };

  // =========================
  // TAMBAH ANTREAN
  // =========================

  const handleTambah = async (event) => {
    event.preventDefault();

    if (!nomor || !poliId || !dokterId || !ruang) {
      setPesan(
        "Lengkapi tanggal, poli, dokter, ruang, dan nomor antrean."
      );
      return;
    }

    setLoading(true);
    setPesan("");

    try {
      const params = new URLSearchParams({
        nomor: nomor.toUpperCase(),
        tanggal,
        ruang,
        poliId,
        dokterId,
      });

      const response = await fetch(
        `${API}?${params.toString()}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "Gagal menambahkan antrean"
        );
      }

      setNomor("");

      await ambilData();

      setPesan("Antrean berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      setPesan("Gagal menambahkan antrean.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AKSI ANTREAN
  // =========================

  const jalankanAksi = async (url) => {
    setLoading(true);
    setPesan("");

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "Aksi gagal dilakukan."
        );
      }

      await ambilData();

      // Refresh isi popup kalau sedang terbuka
      if (riwayatRuang) {
        const dataBaru = await fetch(API)
          .then((res) => res.json());

        const dataRuanganBaru = dataBaru
          .filter(
            (item) =>
              item.tanggal === tanggal &&
              item.ruang ===
                riwayatRuang.ruang.nama &&
              item.poli?.id ===
                riwayatRuang.ruang.poliId
          )
          .sort((a, b) => a.id - b.id);

        setRiwayatRuang({
          ...riwayatRuang,
          data: dataRuanganBaru,
        });
      }
    } catch (error) {
      console.error(error);
      setPesan(
        error.message || "Aksi gagal dilakukan."
      );
    } finally {
      setLoading(false);
    }
  };

  const panggil = (id) => {
    jalankanAksi(`${API}/${id}/panggil`);
  };

  const lewati = (id) => {
    jalankanAksi(`${API}/${id}/lewati`);
  };

  const selesaikan = (id) => {
    jalankanAksi(`${API}/${id}/selesai`);
  };

  const panggilUlang = (id) => {
    jalankanAksi(
      `${API}/${id}/panggil-ulang`
    );
  };

  // =========================
  // FORMAT WAKTU
  // =========================

  const formatWaktu = (waktu) => {
    if (!waktu) return "-";

    return new Date(waktu).toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================
  // RIWAYAT
  // =========================

  const bukaRiwayat = (
    ruangItem,
    dataRuangan
  ) => {
    setRiwayatRuang({
      ruang: ruangItem,
      data: dataRuangan,
    });

    setShowRiwayat(true);
  };

  const tutupRiwayat = () => {
    setShowRiwayat(false);
    setRiwayatRuang(null);
  };

  return (
    <div className="petugas-page">

      {/* HEADER */}

      <header className="petugas-header">

        <div>
          <h1>HALAMAN PETUGAS</h1>

          <p>
            Pengelolaan dan pemantauan antrean klinik
          </p>
        </div>

        <button
          className="btn-refresh"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      <main className="petugas-content">

        {pesan && (
          <div className="pesan">
            {pesan}
          </div>
        )}


        {/* =========================
            TAMBAH ANTREAN
        ========================= */}

        <section className="form-section">

          <div className="section-title">
            <h2>Tambah Antrean</h2>

            <span>
              Pilih tanggal dan data antrean
            </span>
          </div>


          <form
            className="form-antrean"
            onSubmit={handleTambah}
          >

            {/* TANGGAL */}

            <div className="form-group">
              <label htmlFor="tanggal">
                Tanggal
              </label>

              <input
                id="tanggal"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                onClick={(e) => {
                    e.currentTarget.showPicker?.();
                }}
              />
            </div>


            {/* POLI */}

            <div className="form-group">
              <label htmlFor="poli">
                Poli
              </label>

              <select
                id="poli"
                value={poliId}
                onChange={(e) =>
                  handlePoliChange(e.target.value)
                }
              >

                <option value="">
                  Pilih Poli
                </option>

                {poliList.map((poli) => (
                  <option
                    key={poli.id}
                    value={poli.id}
                  >
                    {poli.nama}
                  </option>
                ))}

              </select>
            </div>


            {/* DOKTER */}

            <div className="form-group">
              <label htmlFor="dokter">
                Dokter
              </label>

              <select
                id="dokter"
                value={dokterId}
                onChange={(e) =>
                  setDokterId(e.target.value)
                }
                disabled={!poliId}
              >

                <option value="">
                  {!poliId
                    ? "Pilih Poli Terlebih Dahulu"
                    : "Pilih Dokter"}
                </option>

                {getDokterUntukPoli().map(
                  (dokter) => (
                    <option
                      key={dokter.id}
                      value={dokter.id}
                    >
                      {dokter.nama}
                    </option>
                  )
                )}

              </select>
            </div>


            {/* RUANG */}

            <div className="form-group">
              <label htmlFor="ruang">
                Ruang
              </label>

              <select
                id="ruang"
                value={ruang}
                onChange={(e) =>
                  setRuang(e.target.value)
                }
                disabled={!poliId}
              >

                <option value="">
                  {!poliId
                    ? "Pilih Poli Terlebih Dahulu"
                    : "Pilih Ruang"}
                </option>

                {getRuangUntukPoli().map(
                  (item) => (
                    <option
                      key={item.nama}
                      value={item.nama}
                    >
                      {item.nama}
                    </option>
                  )
                )}

              </select>
            </div>


            {/* NOMOR */}

            <div className="form-group">
              <label htmlFor="nomor">
                Nomor Antrean
              </label>

              <input
                id="nomor"
                type="text"
                placeholder="Contoh: A-029"
                value={nomor}
                onChange={(e) =>
                  setNomor(e.target.value)
                }
              />
            </div>


            <button
              className="btn-tambah"
              type="submit"
              disabled={loading}
            >
              + Tambah Antrean
            </button>

          </form>

        </section>


        {/* =========================
            RUANG PEMERIKSAAN
        ========================= */}

        <section className="ruang-section">

          <div className="ruang-section-header">

            <div>
              <h2>Ruang Pemeriksaan</h2>

              <p>
                Menampilkan antrean untuk tanggal{" "}
                <strong>{tanggal}</strong>
              </p>
            </div>

          </div>


          <div className="ruang-grid">

            {ruangList.map((ruangItem) => {

              const dataRuangan =
                getAntrianRuangan(
                  ruangItem.nama,
                  ruangItem.poliId
                );

              const sedangDilayani =
                dataRuangan.find(
                  (item) =>
                    item.status ===
                    "DIPANGGIL"
                );

              const menunggu =
                dataRuangan.filter(
                  (item) =>
                    item.status ===
                    "MENUNGGU"
                );

              const selesai =
                dataRuangan.filter(
                  (item) =>
                    item.status ===
                    "SELESAI"
                );

              const dilewati =
                dataRuangan.filter(
                  (item) =>
                    item.status ===
                    "DILEWATI"
                );

              const antreanBerikutnya =
                menunggu[0];

              return (
                <div
                  className="ruang-card"
                  key={ruangItem.nama}
                >

                  {/* HEADER RUANG */}

                  <div className="ruang-card-header">

                    <div>
                      <h3>
                        {ruangItem.poli}
                      </h3>

                      <span>
                        {ruangItem.nama}
                      </span>
                    </div>

                  </div>


                  {/* SEDANG DILAYANI */}

                  <div className="ruang-current">

                    <span className="label-kecil">
                      SEDANG DILAYANI
                    </span>

                    <strong className="nomor-current">
                      {sedangDilayani
                        ? sedangDilayani.nomor
                        : "-"}
                    </strong>

                    <p className="dokter-current">
                      {sedangDilayani?.dokter?.nama ||
                        "-"}
                    </p>

                    <small>
                      Dipanggil{" "}
                      {formatWaktu(
                        sedangDilayani?.waktuDipanggil
                      )}
                    </small>

                  </div>


                  {/* AKSI CURRENT */}

                  {sedangDilayani && (
                    <div className="aksi-current">

                      <button
                        className="btn-lewati"
                        onClick={() =>
                          lewati(
                            sedangDilayani.id
                          )
                        }
                        disabled={loading}
                      >
                        Dilewati
                      </button>

                      <button
                        className="btn-selesai"
                        onClick={() =>
                          selesaikan(
                            sedangDilayani.id
                          )
                        }
                        disabled={loading}
                      >
                        Selesai
                      </button>

                    </div>
                  )}


                  {/* ANTREAN BERIKUTNYA */}

                  <div className="ruang-next">

                    <div>
                      <span className="label-kecil">
                        ANTREAN BERIKUTNYA
                      </span>

                      <strong>
                        {antreanBerikutnya
                          ? antreanBerikutnya.nomor
                          : "-"}
                      </strong>
                    </div>

                    {antreanBerikutnya && (
                      <button
                        className="btn-panggil"
                        onClick={() =>
                          panggil(
                            antreanBerikutnya.id
                          )
                        }
                        disabled={loading}
                      >
                        Panggil
                      </button>
                    )}

                  </div>


                  {/* DAFTAR MENUNGGU */}

                  <div className="ruang-waiting">

                    <div className="waiting-title">
                      Antrean Menunggu
                    </div>

                    {menunggu.length > 0 ? (

                      menunggu.map((item) => (
                        <div
                          key={item.id}
                          className="waiting-item"
                        >
                          {item.nomor}
                        </div>
                      ))

                    ) : (

                      <span className="waiting-empty">
                        Tidak ada antrean
                      </span>

                    )}

                  </div>


                  {/* RINGKASAN */}

                  <div className="ruang-summary">

                    <span>
                      ✓ {selesai.length} selesai
                    </span>

                    <span>
                      ⚠ {dilewati.length} dilewati
                    </span>

                  </div>


                  {/* RIWAYAT */}

                  <button
                    className="btn-riwayat"
                    onClick={() =>
                      bukaRiwayat(
                        ruangItem,
                        dataRuangan
                      )
                    }
                  >
                    Lihat Riwayat
                  </button>

                </div>
              );
            })}

          </div>

        </section>

      </main>


      {/* =========================
          POPUP RIWAYAT
      ========================= */}

      {showRiwayat && riwayatRuang && (

        <div
          className="modal-overlay"
          onClick={tutupRiwayat}
        >

          <div
            className="modal-riwayat"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  Riwayat Antrian
                </h2>

                <p>
                  {riwayatRuang.ruang.poli}
                  {" • "}
                  {riwayatRuang.ruang.nama}
                </p>
              </div>

              <button
                className="btn-tutup"
                onClick={tutupRiwayat}
              >
                ×
              </button>

            </div>


            <div className="riwayat-list">

              {riwayatRuang.data.length > 0 ? (

                riwayatRuang.data
                  .filter(
                    (item) =>
                      item.status ===
                        "SELESAI" ||
                      item.status ===
                        "DILEWATI"
                  )
                  .map((item) => (

                    <div
                      className={`riwayat-item ${
                        item.status ===
                        "DILEWATI"
                          ? "riwayat-dilewati"
                          : "riwayat-selesai"
                      }`}
                      key={item.id}
                    >

                      <div className="riwayat-info">

                        <strong>
                          {item.nomor}
                        </strong>

                        <span>
                          {item.dokter?.nama ||
                            "-"}
                        </span>

                        {item.status ===
                          "SELESAI" && (
                          <small>
                            Selesai{" "}
                            {formatWaktu(
                              item.waktuSelesai
                            )}
                          </small>
                        )}

                        {item.status ===
                          "DILEWATI" && (
                          <small>
                            Dilewati{" "}
                            {formatWaktu(
                              item.waktuDilewati
                            )}
                          </small>
                        )}

                      </div>


                      <div className="riwayat-kanan">

                        <span
                          className={`status-badge ${
                            item.status ===
                            "DILEWATI"
                              ? "badge-dilewati"
                              : "badge-selesai"
                          }`}
                        >
                          {item.status}
                        </span>


                        {item.status ===
                          "DILEWATI" && (

                          <button
                            className="btn-panggil-ulang"
                            onClick={() =>
                              panggilUlang(
                                item.id
                              )
                            }
                            disabled={loading}
                          >
                            Panggil Ulang
                          </button>

                        )}

                      </div>

                    </div>

                  ))

              ) : (

                <div className="riwayat-kosong">
                  Belum ada riwayat antrean.
                </div>

              )}

              {riwayatRuang.data.filter(
                (item) =>
                  item.status ===
                    "SELESAI" ||
                  item.status ===
                    "DILEWATI"
              ).length === 0 && (

                <div className="riwayat-kosong">
                  Belum ada riwayat antrean.
                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Petugas;