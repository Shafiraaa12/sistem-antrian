import { useEffect, useState } from 'react'
import './App.css'

const API = 'https://sistem-antrian-production-85e7.up.railway.app/api/antrian'

const poliList = [
  {
    id: 1,
    nama: 'Poli Umum',
    ruangan: ['Ruang 1', 'Ruang 2'],
    detail: true,
  },
  {
    id: 2,
    nama: 'Poli Gigi',
    ruangan: ['Ruang 3'],
    detail: false,
  },
  {
    id: 3,
    nama: 'Poli Psikologi',
    ruangan: ['Ruang 4'],
    detail: false,
  },
  {
    id: 4,
    nama: 'Poli Kesehatan Ibu dan Anak',
    ruangan: ['Ruang 5', 'Ruang 6'],
    detail: true,
  },
  {
    id: 5,
    nama: 'Poli Mata',
    ruangan: ['Ruang 7'],
    detail: false,
  },
  {
    id: 6,
    nama: 'Poli THT',
    ruangan: ['Ruang 8'],
    detail: false,
  },
]

function App() {
  const [antrian, setAntrian] = useState([])
  const [nomorDicari, setNomorDicari] = useState('')
  const [hasilCek, setHasilCek] = useState(null)
  const [detailPoli, setDetailPoli] = useState(null)

  useEffect(() => {
    ambilAntrian()
  }, [])

  const ambilAntrian = () => {
    fetch(API)
      .then((response) => response.json())
      .then((data) => {
        setAntrian(data)
      })
      .catch((error) => {
        console.error(
          'Gagal mengambil data antrian:',
          error
        )
      })
  }

  const getAntrianRuangan = (poliId, ruang) => {
    return antrian
      .filter(
        (item) =>
          item.poli?.id === poliId &&
          item.ruang === ruang
      )
      .sort((a, b) => a.id - b.id)
  }

  const getSedangDilayani = (poliId, ruang) => {
    return getAntrianRuangan(
      poliId,
      ruang
    ).find(
      (item) => item.status === 'DIPANGGIL'
    )
  }

  const cekAntrian = () => {
    const nomor =
      nomorDicari.trim().toUpperCase()

    if (!nomor) {
      setHasilCek(null)
      return
    }

    const ditemukan = antrian.find(
      (item) => item.nomor === nomor
    )

    if (!ditemukan) {
      setHasilCek({
        ditemukan: false,
      })
      return
    }

    const antrianRuangan =
      getAntrianRuangan(
        ditemukan.poli?.id,
        ditemukan.ruang
      )

    const jumlahSebelum =
      antrianRuangan
        .filter(
          (item) =>
            item.status === 'MENUNGGU'
        )
        .filter(
          (item) =>
            item.id < ditemukan.id
        )
        .length

    setHasilCek({
      ditemukan: true,
      ...ditemukan,
      posisi:
        ditemukan.status === 'MENUNGGU'
          ? jumlahSebelum + 1
          : 0,
      sebelum: jumlahSebelum,
    })
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>Sistem Antrian Klinik</h1>
        <p>
          Pantau nomor antrian secara langsung
        </p>
      </header>

      <main className="container">

        {/* CEK NOMOR */}
        <section className="check-queue">

          <h2>Cek Nomor Antrean</h2>

          <p>
            Masukkan nomor antrean Anda untuk
            melihat posisi antrean.
          </p>

          <div className="input-group">

            <input
              type="text"
              placeholder="Contoh: A-025"
              value={nomorDicari}
              onChange={(e) =>
                setNomorDicari(e.target.value)
              }
            />

            <button
              type="button"
              onClick={cekAntrian}
            >
              Cek
            </button>

          </div>

          {hasilCek?.ditemukan === false && (
            <p className="not-found">
              Nomor antrean tidak ditemukan.
            </p>
          )}

          {hasilCek?.ditemukan && (
            <div className="result">

              <p>
                Nomor:{' '}
                <strong>
                  {hasilCek.nomor}
                </strong>
              </p>

              {hasilCek.status === 'DILEWATI' ? (

                <div className="hasil-dilewati">
                  <strong>
                    Nomor antrean Anda telah
                    dilewati.
                  </strong>

                  <p>
                    Silakan menghubungi petugas
                    untuk informasi lebih lanjut.
                  </p>
                </div>

              ) : (

                <>
                  <p>
                    Status:{' '}
                    <strong>
                      {hasilCek.status}
                    </strong>
                  </p>

                  {hasilCek.status ===
                    'MENUNGGU' && (
                    <>
                      <p>
                        Posisi Anda:{' '}
                        <strong>
                          {hasilCek.posisi}
                        </strong>
                      </p>

                      <p>
                        Masih ada{' '}
                        <strong>
                          {hasilCek.sebelum}
                        </strong>{' '}
                        nomor sebelum Anda.
                      </p>
                    </>
                  )}

                  {hasilCek.status ===
                    'DIPANGGIL' && (
                    <p>
                      Silakan menuju ruangan
                      pemeriksaan.
                    </p>
                  )}

                  {hasilCek.status ===
                    'SELESAI' && (
                    <p>
                      Antrean Anda telah selesai
                      dilayani.
                    </p>
                  )}
                </>

              )}

            </div>
          )}

        </section>


        {/* DAFTAR POLI */}
        <section className="poli-section">

          <div className="section-title">
            <h2>Informasi Antrian</h2>

            <p>
              Lihat antrean yang sedang
              dilayani di setiap poli.
            </p>
          </div>


          <div className="poli-grid">

            {poliList.map((poli) => (

              <div
                className="poli-card"
                key={poli.id}
              >

                <div className="poli-card-header">
                  <h3>
                    {poli.nama}
                  </h3>
                </div>


                <div className="poli-ruangan">

                  {poli.ruangan.map((ruang) => {

                    const dataRuangan =
                      getAntrianRuangan(
                        poli.id,
                        ruang
                      )

                    const sedangDilayani =
                      dataRuangan.find(
                        (item) =>
                          item.status ===
                          'DIPANGGIL'
                      )

                    const berikutnya =
                      dataRuangan.find(
                        (item) =>
                          item.status ===
                          'MENUNGGU'
                      )


                    return (
                      <div
                        className="ruang-info"
                        key={ruang}
                      >

                        <span className="ruang-nama">
                          {ruang}
                        </span>


                        <span className="dokter-nama">
                          {sedangDilayani?.dokter?.nama ||
                            berikutnya?.dokter?.nama ||
                            '-'}
                        </span>


                        <span className="ruang-label">
                          Sedang dilayani
                        </span>


                        <strong className="nomor-antrian">
                          {sedangDilayani
                            ? sedangDilayani.nomor
                            : '-'}
                        </strong>


                        {/* POLI SELAIN UMUM & KIA */}
                        {!poli.detail && (
                          <>
                            <span className="berikutnya-label">
                              Berikutnya
                            </span>

                            <strong className="nomor-berikutnya">
                              {berikutnya
                                ? berikutnya.nomor
                                : '-'}
                            </strong>
                          </>
                        )}

                      </div>
                    )

                  })}

                </div>


                {/* DETAIL HANYA UNTUK UMUM & KIA */}
                {poli.detail && (
                  <>
                    <button
                      className="btn-detail"
                      onClick={() =>
                        setDetailPoli(
                          detailPoli ===
                            poli.id
                            ? null
                            : poli.id
                        )
                      }
                    >
                      {detailPoli ===
                      poli.id
                        ? 'Tutup Detail'
                        : 'Lihat Detail'}
                    </button>


                    {detailPoli ===
                      poli.id && (
                      <div className="poli-detail">

                        {poli.ruangan.map(
                          (ruang) => {

                            const dataRuangan =
                              getAntrianRuangan(
                                poli.id,
                                ruang
                              )

                            const sedangDilayani =
                              dataRuangan.find(
                                (item) =>
                                  item.status ===
                                  'DIPANGGIL'
                              )

                            const berikutnya =
                              dataRuangan.find(
                                (item) =>
                                  item.status ===
                                  'MENUNGGU'
                              )

                            return (
                              <div
                                className="detail-ruangan"
                                key={ruang}
                              >

                                <h4>
                                  {ruang}
                                </h4>

                                <p>
                                  Dokter:{' '}
                                  <strong>
                                    {sedangDilayani?.dokter?.nama ||
                                      berikutnya?.dokter?.nama ||
                                      '-'}
                                  </strong>
                                </p>

                                <p>
                                  Sedang
                                  dilayani:{' '}
                                  <strong>
                                    {sedangDilayani
                                      ? sedangDilayani.nomor
                                      : '-'}
                                  </strong>
                                </p>

                                <p>
                                  Berikutnya:{' '}
                                  <strong>
                                    {berikutnya
                                      ? berikutnya.nomor
                                      : '-'}
                                  </strong>
                                </p>

                              </div>
                            )
                          }
                        )}

                      </div>
                    )}

                  </>
                )}

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  )
}

export default App