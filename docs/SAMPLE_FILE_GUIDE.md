# Panduan Sample File Import

Untuk memudahkan import data secara bulk, tersedia file sample yang dapat didownload di setiap halaman yang memiliki fitur import. Berikut format dan keterangan untuk setiap jenis sample file:

## 📊 Sample Survey Harga Komoditas

**File**: `Sample_Survey_Harga.xlsx`

**Format Kolom**:
- **Tanggal Survey**: Format YYYY-MM-DD (contoh: 2024-01-15)
- **Pasar**: Nama pasar yang terdaftar (Pasar Raya I, Pasar Rejosari, Pasar Blauran I)
- **Nama Komoditas**: Nama komoditas yang terdaftar
- **Harga**: Angka dalam rupiah tanpa titik/koma (contoh: 12000)
- **Status Stok**: available, limited, atau unavailable
- **Kualitas**: excellent, good, average, atau poor
- **Operator**: Nama operator yang input data
- **Catatan**: Catatan tambahan (opsional)

**Contoh Data**:
```
2024-01-15 | Pasar Raya I | Beras Medium | 12000 | available | good | Operator Aktif | Kondisi baik
```

---

## 📦 Sample Data Stok Bapokting

**File**: `Sample_Stock_Bapokting.xlsx`

**Format Kolom**:
- **No**: Nomor urut
- **Tanggal Survey**: Format YYYY-MM-DD
- **Komoditas**: Nama komoditas yang terdaftar
- **Nama Toko Besar**: Nama toko yang menjual komoditas
- **Januari (capaian)**: Angka capaian bulan Januari
- **Feb - Des**: Angka untuk setiap bulan (Februari sampai Desember)

**Contoh Data**:
```
1 | 2024-01-15 | Beras Medium | Toko ABC | 100 | 95 | 110 | 105 | 98 | 102 | 115 | 108 | 92 | 103 | 107 | 112
```

---

## 🏪 Sample Data Pasar

**File**: `Sample_Market_Data.xlsx`

**Format Kolom**:
- **Nama Pasar**: Nama lengkap pasar
- **Alamat**: Alamat lengkap pasar
- **Kontak**: Nomor telepon
- **Longitude**: Koordinat longitude (contoh: 110.4928)
- **Latitude**: Koordinat latitude (contoh: -7.3298)
- **Kecamatan**: Nama kecamatan (Tingkir, Sidomukti, Argomulyo, Sidorejo)

---

## 🥬 Sample Data Komoditas

**File**: `Sample_Commodity_Data.xlsx`

**Format Kolom**:
- **Nama Komoditas**: Nama komoditas
- **Deskripsi**: Deskripsi singkat komoditas
- **Satuan**: kg, liter, buah, ikat, gram, ekor
- **Kategori**: beras, cabai, bawang, gula pasir, minyak goreng, daging, sayuran, buah, lainnya

---

## ⛽ Sample Data SPBU

**File**: `Sample_Gas_Station_Data.xlsx`

**Format Kolom**:
- **Nama SPBU**: Nama lengkap SPBU
- **Alamat**: Alamat lengkap SPBU
- **Kontak**: Nomor telepon
- **Longitude**: Koordinat longitude
- **Latitude**: Koordinat latitude
- **Operator**: Pertamina, Shell, Total, dll
- **Status**: Aktif atau Tidak Aktif

---

## 🏬 Sample Data Toko Besar

**File**: `Sample_Large_Store_Data.xlsx`

**Format Kolom**:
- **Nama Toko**: Nama lengkap toko
- **Alamat**: Alamat lengkap toko
- **Kontak**: Nomor telepon
- **Longitude**: Koordinat longitude
- **Latitude**: Koordinat latitude
- **Jenis Toko**: Hypermarket, Supermarket, Minimarket
- **Status**: Aktif atau Tidak Aktif

---

## ⚠️ Catatan Penting

1. **Format Tanggal**: Selalu gunakan format YYYY-MM-DD (tahun-bulan-tanggal)
2. **Angka**: Jangan gunakan titik atau koma sebagai pemisah ribuan
3. **Enum Values**: Gunakan nilai yang tepat sesuai pilihan yang tersedia
4. **Koordinat**: Gunakan format desimal untuk longitude dan latitude
5. **File Excel**: Simpan dalam format .xlsx atau .xls

## 💡 Tips Penggunaan

- Download sample file terlebih dahulu untuk melihat format yang benar
- Isi data pada baris kedua dan seterusnya (jangan ubah header)
- Pastikan semua kolom wajib terisi
- Validasi data sebelum import untuk menghindari error

---

*Jika mengalami kesulitan dalam import data, pastikan format file sesuai dengan sample yang disediakan.*