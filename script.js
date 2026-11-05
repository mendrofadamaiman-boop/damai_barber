// ==================================
// 1. PENGATURAN WEBSITE
// ==================================

// GANTI DENGAN NOMOR WHATSAPP KAMU
// Gunakan kode negara 62, tanpa tanda +.
const nomorWhatsApp = "6285142196892";

// Jadwal buka dan tutup.
// Format menggunakan 24 jam.
const jadwalBuka = {
    0: { buka: "08:00", tutup: "21:00" }, // Minggu
    1: { buka: "14:00", tutup: "21:00" }, // Senin
    2: { buka: "14:00", tutup: "21:00" }, // Selasa
    3: { buka: "18:00", tutup: "22:00" }, // Rabu
    4: { buka: "18:00", tutup: "22:00" }, // Kamis
    5: { buka: "14:00", tutup: "21:00" }, // Jumat
    6: { buka: "14:00", tutup: "21:00" }  // Sabtu
};


// ==================================
// 2. MENGATUR TANGGAL BOOKING
// ==================================

const inputTanggal = document.getElementById("tanggal");

const hariIni = new Date();
const tahun = hariIni.getFullYear();
const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
const tanggalHariIni = String(hariIni.getDate()).padStart(2, "0");

inputTanggal.min = `${tahun}-${bulan}-${tanggalHariIni}`;


// ==================================
// 3. SISTEM BOOKING WHATSAPP
// ==================================

document.getElementById("bookingForm").addEventListener("submit", function(e) {

    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const layanan = document.getElementById("layananPilih").value;
    const tanggal = document.getElementById("tanggal").value;
    const jam = document.getElementById("jam").value;
    const catatan = document.getElementById("catatan").value.trim();

    if (!nama || !layanan || !tanggal || !jam) {
        alert("Mohon lengkapi semua data booking!");
        return;
    }

    // Membuat tanggal sesuai zona waktu lokal
    const [y, m, d] = tanggal.split("-").map(Number);
    const tanggalDipilih = new Date(y, m - 1, d);

    const hari = tanggalDipilih.getDay();

    // Memeriksa jadwal buka
    const jadwal = jadwalBuka[hari];

    if (!jadwal) {
        alert("Maaf, barbershop tutup pada hari tersebut.");
        return;
    }

    // Memeriksa jam operasional
    if (jam < jadwal.buka || jam >= jadwal.tutup) {
        alert(
            `Maaf, jadwal booking harus antara ${jadwal.buka} sampai ${jadwal.tutup}.`
        );
        return;
    }

    // Memeriksa waktu yang sudah lewat
    const waktuDipilih = new Date(y, m - 1, d);
    const [jamDipilih, menitDipilih] = jam.split(":").map(Number);

    waktuDipilih.setHours(jamDipilih, menitDipilih, 0, 0);

    if (waktuDipilih <= new Date()) {
        alert("Silakan pilih tanggal dan jam yang masih akan datang.");
        return;
    }

    const namaHari = [
        "Minggu", "Senin", "Selasa", "Rabu",
        "Kamis", "Jumat", "Sabtu"
    ];

    const tanggalFormat = `${d}-${m}-${y}`;

    // Membuat pesan WhatsApp
    const pesan =
`HALO DAMAIAN MENDROFA!

Saya ingin melakukan booking cukur rambut.

Nama: ${nama}
Layanan: ${layanan}
Hari: ${namaHari[hari]}
Tanggal: ${tanggalFormat}
Jam: ${jam}

Catatan: ${catatan || "-"}

Mohon konfirmasi apakah jadwal tersebut tersedia.

Terima kasih.`;

    const linkWhatsApp =
        `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

    window.open(linkWhatsApp, "_blank");

});


// ==================================
// 4. SISTEM RATING BINTANG
// ==================================

let ratingTerpilih = 0;

const tombolRating = document.querySelectorAll(
    "#ratingInput button"
);

tombolRating.forEach(button => {

    button.addEventListener("click", function() {

        ratingTerpilih = Number(this.dataset.rating);

        tombolRating.forEach(b => {
            b.classList.toggle(
                "active",
                Number(b.dataset.rating) <= ratingTerpilih
            );
        });

        document.getElementById("ratingText").textContent =
            `${ratingTerpilih} dari 5 bintang`;

    });

});


// ==================================
// 5. MENYIMPAN DAN MENAMPILKAN ULASAN
// ==================================

const kunciUlasan = "damaistylebaeberReviews";

let daftarUlasan = [];

try {
    daftarUlasan = JSON.parse(
        localStorage.getItem(kunciUlasan) || "[]"
    );

    if (!Array.isArray(daftarUlasan)) {
        daftarUlasan = [];
    }
} catch {
    daftarUlasan = [];
}


// Fungsi menampilkan ulasan

function tampilkanUlasan() {

    const reviewList = document.getElementById("reviewList");

    reviewList.replaceChildren();

    let totalRating = 0;

    daftarUlasan.forEach(ulasan => {

        totalRating += ulasan.rating;

        const card = document.createElement("div");
        card.className = "review-card";

        const nama = document.createElement("h3");
        nama.textContent = ulasan.nama;

        const bintang = document.createElement("p");
        bintang.className = "review-stars";
        bintang.textContent = "★".repeat(ulasan.rating) +
            "☆".repeat(5 - ulasan.rating);

        const pesan = document.createElement("p");
        pesan.textContent = ulasan.pesan;

        card.append(nama, bintang, pesan);

        reviewList.appendChild(card);

    });

    const rataRata = daftarUlasan.length
        ? totalRating / daftarUlasan.length
        : 0;

    document.getElementById("averageRating").textContent =
        `${rataRata.toFixed(1)} / 5`;

    document.getElementById("averageStars").textContent =
        "★".repeat(Math.round(rataRata)) +
        "☆".repeat(5 - Math.round(rataRata));

    document.getElementById("totalReviews").textContent =
        `${daftarUlasan.length} ulasan pelanggan`;

}


// ==================================
// 6. FORMULIR KIRIM ULASAN
// ==================================

document.getElementById("reviewForm").addEventListener(
    "submit", function(e) {

        e.preventDefault();

        const nama = document.getElementById("reviewName").value.trim();
        const pesan = document.getElementById("reviewMessage").value.trim();

        if (!nama || !pesan || ratingTerpilih === 0) {
            alert("Lengkapi nama, rating, dan ulasan terlebih dahulu!");
            return;
        }

        const ulasanBaru = {
            nama: nama,
            rating: ratingTerpilih,
            pesan: pesan
        };

        daftarUlasan.push(ulasanBaru);

        // Simpan ulasan di browser
        localStorage.setItem(
            kunciUlasan,
            JSON.stringify(daftarUlasan)
        );

        alert("Terima kasih! Ulasan berhasil ditambahkan.");

        this.reset();

        ratingTerpilih = 0;

        tombolRating.forEach(b => b.classList.remove("active"));

        document.getElementById("ratingText").textContent =
            "Pilih jumlah bintang.";

        tampilkanUlasan();

    }
);


// Menampilkan ulasan ketika website dibuka
tampilkanUlasan();