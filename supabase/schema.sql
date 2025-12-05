-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for device status and condition
CREATE TYPE device_status AS ENUM ('Aktif', 'Tidak Aktif', 'Dalam Perbaikan', 'Menunggu Approval');
CREATE TYPE device_kondisi AS ENUM ('Baik', 'Rusak', 'Dalam Perbaikan', 'Tidak Terpakai');

-- Table: kode_items
-- Stores item codes (Monitor, PC, UPS, etc.)
CREATE TABLE IF NOT EXISTS kode_items (
  kode VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: divisi
-- Stores division/department names
CREATE TABLE IF NOT EXISTS divisi (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nama VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Table: devices
-- Main table for device inventory
CREATE TABLE IF NOT EXISTS devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  kode_id VARCHAR(50) UNIQUE NOT NULL,
  jenis_barang VARCHAR(100) NOT NULL,
  tanggal_beli DATE NOT NULL,
  garansi INTEGER NOT NULL DEFAULT 0,
  garansi_sampai DATE NOT NULL,
  lokasi VARCHAR(255) NOT NULL,
  devisi VARCHAR(50) NOT NULL,
  sub_devisi VARCHAR(100),
  merk VARCHAR(100) NOT NULL,
  type VARCHAR(100) NOT NULL,
  sn_reg_model VARCHAR(100) NOT NULL,
  spesifikasi TEXT,
  gambar TEXT,
  status device_status DEFAULT 'Aktif' NOT NULL,
  kondisi device_kondisi DEFAULT 'Baik' NOT NULL,
  akun_terhubung VARCHAR(255),
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_devices_kode_id ON devices(kode_id);
CREATE INDEX IF NOT EXISTS idx_devices_jenis_barang ON devices(jenis_barang);
CREATE INDEX IF NOT EXISTS idx_devices_devisi ON devices(devisi);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_devices_kondisi ON devices(kondisi);
CREATE INDEX IF NOT EXISTS idx_devices_tanggal_beli ON devices(tanggal_beli);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_kode_items_updated_at
  BEFORE UPDATE ON kode_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_divisi_updated_at
  BEFORE UPDATE ON divisi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default kode items
INSERT INTO kode_items (kode, nama) VALUES
  ('01', 'Monitor'),
  ('02', 'PC'),
  ('03', 'UPS'),
  ('04', 'Keyboard'),
  ('05', 'Mouse'),
  ('06', 'TV'),
  ('07', 'Laptop'),
  ('08', 'Smartphone'),
  ('09', 'Printer'),
  ('10', 'MousePad'),
  ('11', 'Shooting Kit'),
  ('12', 'Mini PC'),
  ('13', 'Router'),
  ('14', 'WifiUSB'),
  ('15', 'Headset'),
  ('16', 'Telpon rumah'),
  ('17', 'Stavolt')
ON CONFLICT (kode) DO NOTHING;

-- Insert default divisi
INSERT INTO divisi (nama) VALUES
  ('EC'),
  ('EM'),
  ('ADM'),
  ('FIN'),
  ('BA'),
  ('PRG'),
  ('OPS'),
  ('IT'),
  ('EDITOR'),
  ('SOSMED'),
  ('PROGRAMMER'),
  ('DESIGN'),
  ('HR'),
  ('PRIMEHUB')
ON CONFLICT (nama) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE kode_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE divisi ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Kode Items policies
CREATE POLICY "Allow read access to kode_items for all users" ON kode_items
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow insert access to kode_items for authenticated users" ON kode_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update access to kode_items for authenticated users" ON kode_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete access to kode_items for authenticated users" ON kode_items
  FOR DELETE TO authenticated USING (true);

-- Divisi policies
CREATE POLICY "Allow read access to divisi for all users" ON divisi
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow insert access to divisi for authenticated users" ON divisi
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update access to divisi for authenticated users" ON divisi
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete access to divisi for authenticated users" ON divisi
  FOR DELETE TO authenticated USING (true);

-- Devices policies
CREATE POLICY "Allow read access to devices for all users" ON devices
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Allow insert access to devices for authenticated users" ON devices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow update access to devices for authenticated users" ON devices
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow delete access to devices for authenticated users" ON devices
  FOR DELETE TO authenticated USING (true);
