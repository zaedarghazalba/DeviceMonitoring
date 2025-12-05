import { KodeItem } from "./types";

const KODE_ITEM_STORAGE_KEY = "kode_item_list";
const DIVISI_STORAGE_KEY = "divisi_list";

// Default kode item
const defaultKodeItems: KodeItem[] = [
  { kode: "01", nama: "Monitor" },
  { kode: "02", nama: "PC" },
  { kode: "03", nama: "UPS" },
  { kode: "04", nama: "Keyboard" },
  { kode: "05", nama: "Mouse" },
  { kode: "06", nama: "TV" },
  { kode: "07", nama: "Laptop" },
  { kode: "08", nama: "Smartphone" },
  { kode: "09", nama: "Printer" },
  { kode: "10", nama: "MousePad" },
  { kode: "11", nama: "Shooting Kit" },
  { kode: "12", nama: "Mini PC" },
  { kode: "13", nama: "Router" },
  { kode: "14", nama: "WifiUSB" },
  { kode: "15", nama: "Headset" },
  { kode: "16", nama: "Telpon rumah" },
  { kode: "17", nama: "Stavolt" },
];

// Default divisi
const defaultDivisi: string[] = [
  "EC",
  "EM",
  "ADM",
  "FIN",
  "BA",
  "PRG",
  "OPS",
  "IT",
  "EDITOR",
  "SOSMED",
  "PROGRAMMER",
  "DESIGN",
  "HR",
  "PRIMEHUB",
];

// Initialize kode item if not exists
function initializeKodeItems(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(KODE_ITEM_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(KODE_ITEM_STORAGE_KEY, JSON.stringify(defaultKodeItems));
  }
}

// Initialize divisi if not exists
function initializeDivisi(): void {
  if (typeof window === "undefined") return;
  const existing = localStorage.getItem(DIVISI_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(DIVISI_STORAGE_KEY, JSON.stringify(defaultDivisi));
  }
}

// Get all kode items
export function getAllKodeItems(): KodeItem[] {
  if (typeof window === "undefined") return defaultKodeItems;
  initializeKodeItems();
  const data = localStorage.getItem(KODE_ITEM_STORAGE_KEY);
  return data ? JSON.parse(data) : defaultKodeItems;
}

// Add new kode item
export function addKodeItem(kodeItem: KodeItem): boolean {
  const items = getAllKodeItems();

  // Check if kode already exists
  if (items.some(item => item.kode === kodeItem.kode)) {
    return false;
  }

  items.push(kodeItem);
  items.sort((a, b) => a.kode.localeCompare(b.kode));
  localStorage.setItem(KODE_ITEM_STORAGE_KEY, JSON.stringify(items));
  return true;
}

// Delete kode item
export function deleteKodeItem(kode: string): boolean {
  const items = getAllKodeItems();
  const filtered = items.filter(item => item.kode !== kode);

  if (filtered.length === items.length) {
    return false;
  }

  localStorage.setItem(KODE_ITEM_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Get all divisi
export function getAllDivisi(): string[] {
  if (typeof window === "undefined") return defaultDivisi;
  initializeDivisi();
  const data = localStorage.getItem(DIVISI_STORAGE_KEY);
  return data ? JSON.parse(data) : defaultDivisi;
}

// Add new divisi
export function addDivisi(divisi: string): boolean {
  const divisiList = getAllDivisi();

  // Check if divisi already exists (case insensitive)
  if (divisiList.some(d => d.toLowerCase() === divisi.toLowerCase())) {
    return false;
  }

  divisiList.push(divisi.toUpperCase());
  divisiList.sort();
  localStorage.setItem(DIVISI_STORAGE_KEY, JSON.stringify(divisiList));
  return true;
}

// Delete divisi
export function deleteDivisi(divisi: string): boolean {
  const divisiList = getAllDivisi();
  const filtered = divisiList.filter(d => d !== divisi);

  if (filtered.length === divisiList.length) {
    return false;
  }

  localStorage.setItem(DIVISI_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Generate Kode ID format: INV-{kodeItem}-{sequence}-{tahun}
// Example: INV-01-001-25
export function generateKodeId(kodeItem: string, existingDevices: any[], tanggalBeli: string): string {
  // Get year from tanggalBeli
  const year = new Date(tanggalBeli).getFullYear().toString().slice(-2);

  // Count existing devices with same kodeItem and year
  const sameTypeDevices = existingDevices.filter(device => {
    const deviceYear = new Date(device.tanggalBeli).getFullYear().toString().slice(-2);
    return device.kodeId.startsWith(`INV-${kodeItem}-`) && deviceYear === year;
  });

  // Get next sequence number
  let nextSequence = 1;
  if (sameTypeDevices.length > 0) {
    // Extract sequence numbers and find the maximum
    const sequences = sameTypeDevices.map(device => {
      const parts = device.kodeId.split('-');
      return parseInt(parts[2]) || 0;
    });
    nextSequence = Math.max(...sequences) + 1;
  }

  // Format sequence with leading zeros (3 digits)
  const sequenceStr = String(nextSequence).padStart(3, '0');

  return `INV-${kodeItem}-${sequenceStr}-${year}`;
}
