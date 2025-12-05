# Supabase Database Setup

## Langkah-langkah Setup Database

### 1. Akses Supabase Dashboard

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Login ke akun Anda
3. Pilih project yang sudah dibuat (project ref: `hqfowbslkqdfnxcigekn`)

### 2. Jalankan Migration SQL

1. Di Supabase Dashboard, klik **SQL Editor** di menu samping
2. Klik **New Query**
3. Copy semua konten dari file `schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** untuk menjalankan query

### 3. Verifikasi Database

Setelah migration berhasil, Anda akan memiliki:

#### Tabel yang dibuat:
- **kode_items** - Menyimpan kode dan nama barang (Monitor, PC, UPS, dll)
- **divisi** - Menyimpan daftar divisi/departemen
- **devices** - Tabel utama untuk inventory perangkat

#### Enum Types:
- **device_status**: 'Aktif', 'Tidak Aktif', 'Dalam Perbaikan', 'Menunggu Approval'
- **device_kondisi**: 'Baik', 'Rusak', 'Dalam Perbaikan', 'Tidak Terpakai'

#### Indexes:
- Index pada kode_id, jenis_barang, devisi, status, kondisi, tanggal_beli untuk performa query yang lebih baik

#### Row Level Security (RLS):
- Semua tabel dilindungi dengan RLS
- Policy dibuat untuk authenticated dan anonymous users
- Read access untuk semua user
- Insert/Update/Delete untuk authenticated users

### 4. Verifikasi di Table Editor

1. Klik **Table Editor** di menu samping
2. Anda akan melihat 3 tabel:
   - kode_items (dengan 17 default items)
   - divisi (dengan 14 default divisi)
   - devices (kosong, siap digunakan)

### 5. Setup Environment Variables

Pastikan file `.env.local` sudah dibuat dengan konten dari `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://hqfowbslkqdfnxcigekn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZm93YnNsa3FkZm54Y2lnZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MDQ5OTksImV4cCI6MjA4MDQ4MDk5OX0.j30TuZO0Uy54_Hb4xZNll0rJBnZnamx4Y2wuLdLBUrw
```

## Schema Overview

### Table: kode_items
```sql
kode VARCHAR(10) PRIMARY KEY
nama VARCHAR(100) NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Table: divisi
```sql
id UUID PRIMARY KEY
nama VARCHAR(50) UNIQUE NOT NULL
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Table: devices
```sql
id UUID PRIMARY KEY
kode_id VARCHAR(50) UNIQUE NOT NULL
jenis_barang VARCHAR(100) NOT NULL
tanggal_beli DATE NOT NULL
garansi INTEGER NOT NULL
garansi_sampai DATE NOT NULL
lokasi VARCHAR(255) NOT NULL
devisi VARCHAR(50) NOT NULL
sub_devisi VARCHAR(100)
merk VARCHAR(100) NOT NULL
type VARCHAR(100) NOT NULL
sn_reg_model VARCHAR(100) NOT NULL
spesifikasi TEXT
gambar TEXT
status device_status NOT NULL
kondisi device_kondisi NOT NULL
akun_terhubung VARCHAR(255)
keterangan TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

## MCP Supabase Configuration

MCP Supabase sudah dikonfigurasi di file `.mcp.json`:

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=hqfowbslkqdfnxcigekn"
    }
  }
}
```

## Next Steps

Setelah setup database selesai:
1. Aplikasi akan otomatis menggunakan Supabase untuk menyimpan data
2. Data yang sebelumnya di localStorage dapat dimigrasikan ke Supabase
3. Semua operasi CRUD akan dilakukan melalui Supabase

## Troubleshooting

### Error: "relation does not exist"
- Pastikan schema.sql sudah dijalankan dengan benar
- Check di Table Editor apakah tabel sudah dibuat

### Error: "JWT expired"
- Pastikan NEXT_PUBLIC_SUPABASE_ANON_KEY masih valid
- Generate new key di Dashboard > Settings > API

### Error: "Row Level Security policy violation"
- Pastikan policy sudah dibuat dengan benar
- Check di Authentication > Policies
