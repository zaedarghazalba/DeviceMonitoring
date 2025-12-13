export type DeviceKondisi = "Baik" | "Rusak" | "Dalam Perbaikan" | "Tidak Terpakai";
export type DeviceStatus = "Aktif" | "Tidak Aktif" | "Dalam Perbaikan" | "Menunggu Approval";
export type DataSource = "Akselera" | "Eduprima";

export interface KodeItem {
  kode: string; // Kode item (01, 02, 03, etc)
  nama: string; // Nama item (Monitor, PC, UPS, etc)
}

export interface Device {
  id: string;
  kodeId: string; // Kode ID format: INV-01-001-25
  jenisBarang: string; // Jenis Barang (Monitor, PC, UPS, dll)
  tanggalBeli: string; // Tanggal Beli
  garansi: number; // Garansi dalam bulan
  garansiSampai: string; // Tanggal garansi berakhir (dihitung otomatis)
  lokasi: string;
  devisi: string; // Divisi
  subDevisi: string; // Sub Devisi / Pengguna
  merk: string;
  type: string; // Type barang
  snRegModel: string; // SN / Reg Model
  spesifikasi: string;
  gambar: string; // URL atau path gambar
  status: DeviceStatus;
  kondisi: DeviceKondisi;
  akunTerhubung: string; // Akun Terhubung
  keterangan: string; // Keterangan tambahan
  dataSource: DataSource; // Sumber data: Akselera atau Eduprima
  tanggalDibuat: string;
  tanggalDiupdate: string;
}

export interface DeviceFilters {
  kondisi?: string | "all";
  devisi?: string | "all";
  jenisBarang?: string | "all";
  status?: string | "all";
  dataSource?: string | "all";
}
