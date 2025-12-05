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
        jenisDevice: "Laptop",
        merek: "Dell",
        model: "Latitude 5420",
        serialNumber: "DL-LAT-001",
        kondisi: "Baik",
        pengguna: "Ahmad Rizki",
        divisi: "IT Support",
        spesifikasi: "Intel Core i5-1145G7, 16GB RAM, 512GB SSD",
        tanggalPembelian: "2023-01-15",
        nilaiAset: 15000000,
        lokasi: "Kantor Pusat - Lt. 3",
        catatan: "Laptop untuk developer",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        jenisDevice: "Monitor",
        merek: "LG",
        model: "24MK430H",
        serialNumber: "LG-MON-045",
        kondisi: "Baik",
        pengguna: "Siti Nurhaliza",
        divisi: "Finance",
        spesifikasi: "24 inch, Full HD, IPS Panel",
        tanggalPembelian: "2022-08-10",
        nilaiAset: 2500000,
        lokasi: "Kantor Pusat - Lt. 2",
        catatan: "Monitor tambahan untuk pekerjaan spreadsheet",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        jenisDevice: "Printer",
        merek: "HP",
        model: "LaserJet Pro M404dn",
        serialNumber: "HP-PRN-012",
        kondisi: "Dalam Perbaikan",
        pengguna: "Bersama",
        divisi: "General Office",
        spesifikasi: "Laser Printer, A4, Network",
        tanggalPembelian: "2021-05-20",
        nilaiAset: 4500000,
        lokasi: "Kantor Pusat - Lt. 1",
        catatan: "Paper jam, sedang diperbaiki teknisi",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        jenisDevice: "Router",
        merek: "Cisco",
        model: "RV340",
        serialNumber: "CS-RTR-003",
        kondisi: "Baik",
        pengguna: "Network Admin",
        divisi: "IT Support",
        spesifikasi: "Dual WAN, VPN, 4 Port Gigabit",
        tanggalPembelian: "2022-03-12",
        nilaiAset: 8500000,
        lokasi: "Server Room",
        catatan: "Router utama kantor",
        tanggalDibuat: getCurrentTimestamp(),
        tanggalDiupdate: getCurrentTimestamp(),
      },
      {
        id: generateId(),
        jenisDevice: "Computer",
        merek: "HP",
        model: "ProDesk 400 G7",
        serialNumber: "HP-PC-088",
        kondisi: "Tidak Terpakai",
        pengguna: "-",
        divisi: "-",
        spesifikasi: "Intel Core i3-10100, 8GB RAM, 256GB SSD",
        tanggalPembelian: "2020-11-05",
        nilaiAset: 7000000,
        lokasi: "Gudang IT - Rak B3",
        catatan: "Cadangan, kondisi baik namun tidak digunakan",
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
    device.jenisDevice.toLowerCase().includes(lowerQuery) ||
    device.merek.toLowerCase().includes(lowerQuery) ||
    device.model.toLowerCase().includes(lowerQuery) ||
    device.serialNumber.toLowerCase().includes(lowerQuery) ||
    device.pengguna.toLowerCase().includes(lowerQuery) ||
    device.divisi.toLowerCase().includes(lowerQuery) ||
    device.spesifikasi.toLowerCase().includes(lowerQuery) ||
    device.lokasi.toLowerCase().includes(lowerQuery)
  );
}

// Filter devices
export function filterDevices(filters: DeviceFilters): Device[] {
  const devices = getAllDevices();

  return devices.filter(device => {
    if (filters.kondisi && filters.kondisi !== "all" && device.kondisi !== filters.kondisi) {
      return false;
    }
    if (filters.divisi && filters.divisi !== "all" && device.divisi !== filters.divisi) {
      return false;
    }
    if (filters.jenisDevice && filters.jenisDevice !== "all" && device.jenisDevice !== filters.jenisDevice) {
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
