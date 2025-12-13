import { Device, DeviceFilters } from "./types";

const STORAGE_KEY = "device_inventory";

// Helper to generate UUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper to get current ISO timestamp
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// Initialize with sample data if empty
function initializeSampleData(): void {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const sampleDevices: Device[] = [
      {
        id: generateId(),
        kodeId: "INV-07-001-23",
        jenisBarang: "Laptop",
        tanggalBeli: "2023-01-15",
        garansi: 36,
        garansiSampai: "2026-01-15",
        lokasi: "Kantor Pusat - Lt. 3",
        devisi: "IT",
        subDevisi: "Ahmad Rizki",
        merk: "Dell",
        type: "Latitude 5420",
        snRegModel: "DL-LAT-001",
        spesifikasi: "Intel Core i5-1145G7, 16GB RAM, 512GB SSD",
        gambar: "",
        status: "Aktif",
        kondisi: "Baik",
        akunTerhubung: "ahmad.rizki@company.com",
        keterangan: "Laptop untuk developer",
        dataSource: "Akselera",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        kodeId: "INV-01-001-24",
        jenisBarang: "Monitor",
        tanggalBeli: "2024-08-10",
        garansi: 24,
        garansiSampai: "2026-08-10",
        lokasi: "Kantor Pusat - Lt. 2",
        devisi: "FIN",
        subDevisi: "Siti Nurhaliza",
        merk: "LG",
        type: "24MK430H",
        snRegModel: "LG-MON-045",
        spesifikasi: "24 inch, Full HD, IPS Panel",
        gambar: "",
        status: "Aktif",
        kondisi: "Baik",
        akunTerhubung: "siti.nurhaliza@company.com",
        keterangan: "Monitor tambahan untuk pekerjaan spreadsheet",
        dataSource: "Eduprima",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        kodeId: "INV-09-001-21",
        jenisBarang: "Printer",
        tanggalBeli: "2021-05-20",
        garansi: 12,
        garansiSampai: "2022-05-20",
        lokasi: "Kantor Pusat - Lt. 1",
        devisi: "ADM",
        subDevisi: "Bersama",
        merk: "HP",
        type: "LaserJet Pro M404dn",
        snRegModel: "HP-PRN-012",
        spesifikasi: "Laser Printer, A4, Network",
        gambar: "",
        status: "Dalam Perbaikan",
        kondisi: "Dalam Perbaikan",
        akunTerhubung: "",
        keterangan: "Paper jam, sedang diperbaiki teknisi",
        dataSource: "Akselera",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        kodeId: "INV-13-001-22",
        jenisBarang: "Router",
        tanggalBeli: "2022-03-12",
        garansi: 36,
        garansiSampai: "2025-03-12",
        lokasi: "Server Room",
        devisi: "IT",
        subDevisi: "Network Admin",
        merk: "Cisco",
        type: "RV340",
        snRegModel: "CS-RTR-003",
        spesifikasi: "Dual WAN, VPN, 4 Port Gigabit",
        gambar: "",
        status: "Aktif",
        kondisi: "Baik",
        akunTerhubung: "",
        keterangan: "Router utama kantor",
        dataSource: "Eduprima",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        kodeId: "INV-02-001-20",
        jenisBarang: "PC",
        tanggalBeli: "2020-11-05",
        garansi: 24,
        garansiSampai: "2022-11-05",
        lokasi: "Gudang IT - Rak B3",
        devisi: "IT",
        subDevisi: "-",
        merk: "HP",
        type: "ProDesk 400 G7",
        snRegModel: "HP-PC-088",
        spesifikasi: "Intel Core i3-10100, 8GB RAM, 256GB SSD",
        gambar: "",
        status: "Tidak Aktif",
        kondisi: "Tidak Terpakai",
        akunTerhubung: "",
        keterangan: "Cadangan, kondisi baik namun tidak digunakan",
        dataSource: "Akselera",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleDevices));
  }
}

// Get all devices
export function getAllDevices(): Device[] {
  if (typeof window === "undefined") return [];
  initializeSampleData();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Get device by ID
export function getDeviceById(id: string): Device | null {
  const devices = getAllDevices();
  return devices.find(device => device.id === id) || null;
}

// Add new device
export function addDevice(device: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">): Device {
  const devices = getAllDevices();
  const newDevice: Device = {
    ...device,
    id: generateId(),
    tanggalDibuat: getCurrentTimestamp(),
    tanggalDiupdate: getCurrentTimestamp(),
  };
  devices.push(newDevice);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  return newDevice;
}

// Update device
export function updateDevice(id: string, updates: Partial<Device>): Device {
  const devices = getAllDevices();
  const index = devices.findIndex(device => device.id === id);

  if (index === -1) {
    throw new Error("Device not found");
  }

  const updatedDevice: Device = {
    ...devices[index],
    ...updates,
    id: devices[index].id, // Ensure ID cannot be changed
    tanggalDibuat: devices[index].tanggalDibuat, // Preserve creation date
    tanggalDiupdate: getCurrentTimestamp(),
  };

  devices[index] = updatedDevice;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  return updatedDevice;
}

// Delete device
export function deleteDevice(id: string): boolean {
  const devices = getAllDevices();
  const filteredDevices = devices.filter(device => device.id !== id);

  if (filteredDevices.length === devices.length) {
    return false; // Device not found
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDevices));
  return true;
}

// Search devices
export function searchDevices(query: string): Device[] {
  const devices = getAllDevices();
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return devices;
  }

  return devices.filter(device =>
    device.kodeId.toLowerCase().includes(lowerQuery) ||
    device.jenisBarang.toLowerCase().includes(lowerQuery) ||
    device.merk.toLowerCase().includes(lowerQuery) ||
    device.type.toLowerCase().includes(lowerQuery) ||
    device.snRegModel.toLowerCase().includes(lowerQuery) ||
    device.subDevisi.toLowerCase().includes(lowerQuery) ||
    device.devisi.toLowerCase().includes(lowerQuery) ||
    device.spesifikasi.toLowerCase().includes(lowerQuery) ||
    device.lokasi.toLowerCase().includes(lowerQuery) ||
    device.akunTerhubung.toLowerCase().includes(lowerQuery)
  );
}

// Filter devices
export function filterDevices(filters: DeviceFilters): Device[] {
  const devices = getAllDevices();

  return devices.filter(device => {
    if (filters.kondisi && filters.kondisi !== "all" && device.kondisi !== filters.kondisi) {
      return false;
    }
    if (filters.devisi && filters.devisi !== "all" && device.devisi !== filters.devisi) {
      return false;
    }
    if (filters.jenisBarang && filters.jenisBarang !== "all" && device.jenisBarang !== filters.jenisBarang) {
      return false;
    }
    if (filters.status && filters.status !== "all" && device.status !== filters.status) {
      return false;
    }
    if (filters.dataSource && filters.dataSource !== "all" && device.dataSource !== filters.dataSource) {
      return false;
    }
    return true;
  });
}

// Get unique values for filters
export function getUniqueValues(field: keyof Device): string[] {
  const devices = getAllDevices();
  const values = devices.map(device => device[field] as string);
  return Array.from(new Set(values)).filter(Boolean).sort();
}
