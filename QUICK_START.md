# Quick Start Guide - Device Monitoring System

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation

1. **Navigate to project directory:**
```bash
cd C:\Users\WINDOWS\Desktop\project\DeviceMonitoring
```

2. **Install dependencies (if not already done):**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Open in browser:**
```
http://localhost:3000
```

## First Time Setup

When you first open the application:
1. Sample data (5 devices) will be automatically loaded
2. Data is stored in your browser's Local Storage
3. You can immediately start using the system

## Basic Operations

### View Dashboard
- Homepage shows statistics and all devices
- 5 stat cards at the top showing device status breakdown
- Filter and search section in the middle
- Complete device table at the bottom

### Add New Device
1. Click "Tambah Device" button (top right)
2. Fill in the form:
   - Required fields marked with *
   - Select jenis device from dropdown
   - Enter merek, model, serial number
   - Select kondisi
   - Enter pengguna, divisi, lokasi
   - Set tanggal pembelian
   - Enter nilai aset (in Rupiah)
   - Add spesifikasi and catatan (optional)
3. Click "Tambah Device" to save
4. Click "Batal" to cancel

### Search for Device
1. Type in search box at top of filter section
2. Searches across:
   - Jenis device
   - Merek
   - Model
   - Serial number
   - Pengguna
   - Divisi
   - Lokasi
   - Spesifikasi
3. Results update in real-time

### Filter Devices
1. Use dropdown filters:
   - Semua Kondisi / Baik / Rusak / Dalam Perbaikan / Tidak Terpakai
   - Semua Divisi / (your divisions)
   - Semua Jenis Device / (your device types)
2. Filters can be combined
3. Results update immediately

### View Device Details
1. Click the Eye icon in Actions column
2. Modal opens showing all information
3. Dates and currency formatted nicely
4. From here you can:
   - Export to PDF
   - Edit device
   - Delete device
   - Close modal

### Edit Device
1. Click Edit icon (pencil) in Actions column
   OR click "Edit" in device detail modal
2. Form opens with current data
3. Modify any fields
4. Click "Update Device" to save

### Delete Device
1. Click Trash icon in Actions column
   OR click "Hapus" in device detail modal
2. Confirmation dialog appears
3. Review device information
4. Click "Hapus Device" to confirm
5. Click "Batal" to cancel

### Export to PDF

**Export All Devices:**
1. Apply any filters/search you want
2. Click "Export PDF" button (top right)
3. PDF downloads with filtered results

**Export Single Device:**
1. Open device detail
2. Click "Export PDF" button
3. PDF downloads with complete device information

## Understanding Color Codes

Device kondisi (condition) is color-coded:
- **Green Badge**: Baik (Good condition)
- **Red Badge**: Rusak (Broken)
- **Yellow Badge**: Dalam Perbaikan (Under repair)
- **Gray Badge**: Tidak Terpakai (Not in use)

## Tips & Tricks

1. **Quick Filter**: Use kondisi filter to quickly see devices needing attention
2. **Search Everything**: Search box searches all text fields at once
3. **Combine Filters**: Use multiple filters together for precise results
4. **Mobile Friendly**: App works on phone, tablet, and desktop
5. **Persistent Data**: Data stays in browser until you clear cache
6. **Export Filtered**: Apply filters before exporting to PDF

## Keyboard Shortcuts

Standard browser shortcuts work:
- `Ctrl/Cmd + F`: Find on page
- `Ctrl/Cmd + P`: Print page
- `ESC`: Close open modals

## Common Tasks

### Weekly Review
1. Filter by "Dalam Perbaikan"
2. Check which devices are still being repaired
3. Export PDF for record keeping

### Department Audit
1. Filter by specific Divisi
2. Review all devices in that department
3. Export PDF for department records

### Asset Valuation
1. View all devices
2. Export PDF
3. Use nilai aset column for total calculation

## Troubleshooting

### Data Not Showing
- Refresh the page
- Check browser console for errors
- Clear browser cache and reload

### Sample Data Not Loading
- Open browser console (F12)
- Run: `localStorage.removeItem('device_inventory')`
- Refresh page to reload sample data

### PDF Not Downloading
- Check browser's download settings
- Allow downloads from localhost
- Check popup blockers

### Form Not Submitting
- Check all required fields (marked with *)
- Ensure nilai aset is greater than 0
- Check date format

## Data Management

### Backup Data
```javascript
// Open browser console (F12)
const data = localStorage.getItem('device_inventory')
console.log(data)
// Copy the output and save to a file
```

### Restore Data
```javascript
// Open browser console (F12)
const backupData = '...' // paste your backup data here
localStorage.setItem('device_inventory', backupData)
location.reload()
```

### Clear All Data
```javascript
// Open browser console (F12)
localStorage.removeItem('device_inventory')
location.reload()
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Deploy with one click

### Deploy to Other Platforms
- Works on any platform supporting Next.js
- No backend/database required
- Static export possible

## Getting Help

### Documentation
- README.md - Full documentation
- COMPONENTS.md - Component reference
- This file - Quick start guide

### Check Version
```bash
npm list next react
```

### Update Dependencies
```bash
npm update
```

## Next Steps

After getting comfortable with basic operations:
1. Customize jenis device options (in DeviceForm.tsx)
2. Add more sample data
3. Customize PDF export format
4. Add custom fields if needed
5. Integrate with backend API (optional)

## Support

For issues or questions:
1. Check documentation files
2. Review browser console for errors
3. Check that all dependencies are installed
4. Ensure Node.js version is 18+

---

**Happy Device Monitoring!**
