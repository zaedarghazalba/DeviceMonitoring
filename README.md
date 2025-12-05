# Device Monitoring & IT Inventory System

Sistem pencatatan inventaris perangkat kantor yang modern dan responsif untuk IT Support Staff.

## Teknologi yang Digunakan

- **Next.js 16** - React Framework dengan App Router
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **Tailwind CSS v4** - Styling
- **Shadcn/ui** - UI Components
- **jsPDF & jsPDF-AutoTable** - PDF Export
- **Lucide React** - Icons
- **Local Storage** - Data Persistence (JSON-based)

## Fitur Utama

### 1. Dashboard dengan Statistik
- Total perangkat
- Kondisi baik
- Perangkat rusak
- Dalam perbaikan
- Tidak terpakai
- Visual cards dengan ikon

### 2. Manajemen Device
- **Tambah Device**: Form lengkap dengan validasi
- **Edit Device**: Update informasi device
- **Hapus Device**: Konfirmasi sebelum menghapus
- **Lihat Detail**: Modal dengan informasi lengkap

### 3. Pencarian & Filter
- **Pencarian**: Real-time search di semua field
- **Filter Kondisi**: Baik, Rusak, Dalam Perbaikan, Tidak Terpakai
- **Filter Divisi**: Filter berdasarkan departemen
- **Filter Jenis Device**: Computer, Laptop, Monitor, dll

### 4. Export PDF
- Export semua device ke PDF
- Export detail device individual
- Format profesional dengan header dan footer
- Tabel dengan styling yang rapi

### 5. Data Device Meliputi
- Jenis Device
- Merek & Model
- Serial Number
- Kondisi (dengan color coding)
- Pengguna
- Divisi
- Lokasi
- Spesifikasi Teknis
- Tanggal Pembelian
- Nilai Aset
- Catatan
- Timestamp (Dibuat & Diupdate)

## Struktur Folder

```
DeviceMonitoring/
├── app/
│   ├── globals.css          # Global styles dengan Shadcn/ui theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main dashboard page
├── components/
│   ├── ui/                   # Shadcn/ui components
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── table.tsx
│   ├── DeviceForm.tsx        # Form component untuk add/edit
│   └── DeviceDetail.tsx      # Detail view component
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── storage.ts            # Local Storage service
│   ├── pdf-export.ts         # PDF export functions
│   └── utils.ts              # Utility functions (cn)
├── types/
│   └── jspdf-autotable.d.ts  # Type declarations
└── package.json
```

## Instalasi & Menjalankan

1. **Install dependencies**:
```bash
npm install
```

2. **Run development server**:
```bash
npm run dev
```

3. **Buka browser**:
```
http://localhost:3000
```

## Data Sample

Aplikasi sudah dilengkapi dengan 5 sample data device:
1. Dell Latitude 5420 (Laptop) - Baik
2. LG 24MK430H (Monitor) - Baik
3. HP LaserJet Pro (Printer) - Dalam Perbaikan
4. Cisco RV340 (Router) - Baik
5. HP ProDesk 400 G7 (Computer) - Tidak Terpakai

Data tersimpan di Local Storage browser dan akan otomatis dimuat saat aplikasi pertama kali dijalankan.

## Penggunaan

### Menambah Device Baru
1. Klik tombol "Tambah Device"
2. Isi form dengan data device
3. Field yang wajib diisi ditandai dengan *
4. Klik "Tambah Device" untuk menyimpan

### Mengedit Device
1. Klik icon Edit (pensil) pada device yang ingin diedit
2. Update data yang diperlukan
3. Klik "Update Device" untuk menyimpan

### Melihat Detail
1. Klik icon Eye pada device
2. Modal akan menampilkan semua informasi detail
3. Dari modal detail, bisa langsung Edit atau Hapus

### Menghapus Device
1. Klik icon Trash pada device
2. Konfirmasi penghapusan
3. Data akan terhapus permanen

### Mencari Device
- Ketik di search box untuk mencari berdasarkan:
  - Jenis device
  - Merek
  - Model
  - Serial number
  - Pengguna
  - Divisi
  - Lokasi
  - Spesifikasi

### Filter Device
- Filter berdasarkan Kondisi
- Filter berdasarkan Divisi
- Filter berdasarkan Jenis Device
- Bisa kombinasi multiple filters

### Export PDF
1. **Export Semua**: Klik "Export PDF" di header
2. **Export Detail**: Buka detail device, klik "Export PDF"
3. File PDF otomatis ter-download

## Color Coding Kondisi

- **Hijau (Success)**: Baik
- **Merah (Destructive)**: Rusak
- **Kuning (Warning)**: Dalam Perbaikan
- **Abu-abu (Gray)**: Tidak Terpakai

## Responsive Design

Aplikasi fully responsive untuk:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Build untuk Production

```bash
npm run build
npm start
```

## Local Storage

Data tersimpan di browser dengan key: `device_inventory`

Untuk reset data ke sample data:
1. Buka Developer Tools (F12)
2. Console tab
3. Run: `localStorage.removeItem('device_inventory')`
4. Refresh page

## Maintenance

### Clear All Data
```javascript
localStorage.removeItem('device_inventory')
```

### Export Data (Backup)
```javascript
const data = localStorage.getItem('device_inventory')
console.log(data)
// Copy output untuk backup
```

### Import Data (Restore)
```javascript
const backupData = '...' // paste backup data
localStorage.setItem('device_inventory', backupData)
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

ISC

## Author

IT Support Team

---

**Note**: Aplikasi ini menggunakan Local Storage untuk penyimpanan data. Data tidak akan hilang selama browser cache tidak dibersihkan. Untuk production environment dengan data yang lebih aman, pertimbangkan untuk menggunakan database backend.
