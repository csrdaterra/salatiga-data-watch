import * as XLSX from 'xlsx';

export const downloadSampleSurveyFile = () => {
  // Sample data for survey import
  const sampleData = [
    ['Tanggal Survey', 'Pasar', 'Nama Komoditas', 'Harga', 'Status Stok', 'Kualitas', 'Operator', 'Catatan'],
    ['2024-01-15', 'Pasar Raya I', 'Beras Medium', '12000', 'available', 'good', 'Operator Aktif', 'Kondisi baik'],
    ['2024-01-15', 'Pasar Raya I', 'Cabai Merah Keriting', '35000', 'limited', 'excellent', 'Operator Aktif', 'Stok terbatas'],
    ['2024-01-15', 'Pasar Rejosari', 'Bawang Merah', '28000', 'available', 'good', 'Operator Aktif', ''],
    ['2024-01-15', 'Pasar Blauran I', 'Minyak Goreng Curah', '14000', 'unavailable', 'poor', 'Operator Aktif', 'Stok habis']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 15 }, // Tanggal Survey
    { wch: 20 }, // Pasar
    { wch: 25 }, // Nama Komoditas
    { wch: 10 }, // Harga
    { wch: 15 }, // Status Stok
    { wch: 12 }, // Kualitas
    { wch: 15 }, // Operator
    { wch: 30 }  // Catatan
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Survey Data');

  XLSX.writeFile(wb, 'Sample_Survey_Harga.xlsx');
};

export const downloadSampleStockBapoktingFile = () => {
  // Sample data for stock bapokting import
  const sampleData = [
    ['No', 'Tanggal Survey', 'Komoditas', 'Nama Toko Besar', 'Januari (capaian)', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
    [1, '2024-01-15', 'Beras Medium', 'Toko ABC', 100, 95, 110, 105, 98, 102, 115, 108, 92, 103, 107, 112],
    [2, '2024-01-15', 'Minyak Goreng Curah', 'Toko XYZ', 85, 88, 92, 87, 90, 86, 94, 89, 91, 88, 93, 95],
    [3, '2024-01-15', 'Gula Pasir Curah', 'Toko DEF', 75, 78, 82, 77, 80, 83, 79, 81, 84, 76, 85, 88],
    [4, '2024-01-15', 'Cabai Merah Keriting', 'Toko GHI', 120, 115, 125, 118, 122, 119, 128, 121, 117, 124, 126, 130]
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 5 },  // No
    { wch: 15 }, // Tanggal Survey
    { wch: 25 }, // Komoditas
    { wch: 20 }, // Nama Toko Besar
    { wch: 12 }, // Jan
    { wch: 8 },  // Feb
    { wch: 8 },  // Mar
    { wch: 8 },  // Apr
    { wch: 8 },  // Mei
    { wch: 8 },  // Jun
    { wch: 8 },  // Jul
    { wch: 8 },  // Agt
    { wch: 8 },  // Sep
    { wch: 8 },  // Okt
    { wch: 8 },  // Nov
    { wch: 8 }   // Des
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Stock Bapokting');

  XLSX.writeFile(wb, 'Sample_Stock_Bapokting.xlsx');
};

export const downloadSampleMarketFile = () => {
  // Sample data for market import
  const sampleData = [
    ['Nama Pasar', 'Alamat', 'Kontak', 'Longitude', 'Latitude', 'Kecamatan'],
    ['Pasar Contoh A', 'Jl. Contoh No. 123, Kel. Contoh, Kec. Contoh', '0298-123456', '110.4928', '-7.3298', 'Tingkir'],
    ['Pasar Contoh B', 'Jl. Sample No. 456, Kel. Sample, Kec. Sample', '0298-654321', '110.4856', '-7.3325', 'Sidomukti'],
    ['Pasar Contoh C', 'Jl. Demo No. 789, Kel. Demo, Kec. Demo', '0298-987654', '110.4912', '-7.3285', 'Argomulyo']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 20 }, // Nama Pasar
    { wch: 40 }, // Alamat
    { wch: 15 }, // Kontak
    { wch: 12 }, // Longitude
    { wch: 12 }, // Latitude
    { wch: 15 }  // Kecamatan
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Market Data');

  XLSX.writeFile(wb, 'Sample_Market_Data.xlsx');
};

export const downloadSampleCommodityFile = () => {
  // Sample data for commodity import
  const sampleData = [
    ['Nama Komoditas', 'Deskripsi', 'Satuan', 'Kategori'],
    ['Beras Contoh', 'Beras kualitas contoh', 'kg', 'beras'],
    ['Cabai Contoh', 'Cabai contoh segar', 'kg', 'cabai'],
    ['Minyak Contoh', 'Minyak goreng contoh', 'liter', 'minyak goreng'],
    ['Gula Contoh', 'Gula pasir contoh', 'kg', 'gula pasir']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 25 }, // Nama Komoditas
    { wch: 30 }, // Deskripsi
    { wch: 10 }, // Satuan
    { wch: 15 }  // Kategori
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Commodity Data');

  XLSX.writeFile(wb, 'Sample_Commodity_Data.xlsx');
};

export const downloadSampleGasStationFile = () => {
  // Sample data for gas station import
  const sampleData = [
    ['Nama SPBU', 'Alamat', 'Kontak', 'Longitude', 'Latitude', 'Operator', 'Status'],
    ['SPBU Contoh 001', 'Jl. Contoh Raya No. 123', '0298-111222', '110.4950', '-7.3300', 'Pertamina', 'Aktif'],
    ['SPBU Contoh 002', 'Jl. Sample Street No. 456', '0298-333444', '110.4870', '-7.3280', 'Shell', 'Aktif'],
    ['SPBU Contoh 003', 'Jl. Demo Avenue No. 789', '0298-555666', '110.4890', '-7.3320', 'Total', 'Tidak Aktif']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 20 }, // Nama SPBU
    { wch: 30 }, // Alamat
    { wch: 15 }, // Kontak
    { wch: 12 }, // Longitude
    { wch: 12 }, // Latitude
    { wch: 15 }, // Operator
    { wch: 12 }  // Status
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Gas Station Data');

  XLSX.writeFile(wb, 'Sample_Gas_Station_Data.xlsx');
};

export const downloadSampleLargeStoreFile = () => {
  // Sample data for large store import
  const sampleData = [
    ['Nama Toko', 'Alamat', 'Kontak', 'Longitude', 'Latitude', 'Jenis Toko', 'Status'],
    ['Hypermarket Contoh', 'Jl. Raya Contoh No. 100', '0298-777888', '110.4940', '-7.3290', 'Hypermarket', 'Aktif'],
    ['Supermarket Sample', 'Jl. Sample Center No. 200', '0298-999000', '110.4860', '-7.3310', 'Supermarket', 'Aktif'],
    ['Minimarket Demo', 'Jl. Demo Plaza No. 300', '0298-111333', '110.4920', '-7.3270', 'Minimarket', 'Aktif']
  ];

  const ws = XLSX.utils.aoa_to_sheet(sampleData);
  
  // Set column widths
  const colWidths = [
    { wch: 25 }, // Nama Toko
    { wch: 35 }, // Alamat
    { wch: 15 }, // Kontak
    { wch: 12 }, // Longitude
    { wch: 12 }, // Latitude
    { wch: 15 }, // Jenis Toko
    { wch: 12 }  // Status
  ];
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Large Store Data');

  XLSX.writeFile(wb, 'Sample_Large_Store_Data.xlsx');
};