export type DeviceKondisi = "Baik" | "Rusak" | "Dalam Perbaikan" | "Tidak Terpakai";

export interface Device {
  id: string;
  jenisDevice: string; // Computer, Laptop, Monitor, Printer, Router, Switch, Server, Tablet, Smartphone, dll
  merek: string;
  model: string;
  serialNumber: string;
  kondisi: DeviceKondisi;
  pengguna: string;
  divisi: string;
  spesifikasi: string;
  tanggalPembelian: string;
  nilaiAset: number;
  lokasi: string;
  catatan: string;
  tanggalDibuat: string;
  tanggalDiupdate: string;
}

export interface DeviceFilters {
  kondisi?: string;
  divisi?: string;
  jenisDevice?: string;
}
