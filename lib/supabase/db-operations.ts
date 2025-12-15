"use client"

import { createClient } from "./client"
import { Device, DeviceFilters, KodeItem } from "../types"
import { Database } from "./database.types"

const supabase = createClient()

// Type for database row
type DeviceRow = Database['public']['Tables']['devices']['Row']

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Transform database row to app format
 * This helper eliminates code duplication across all device operations
 */
function transformDeviceFromDB(deviceRow: DeviceRow): Device {
  return {
    id: deviceRow.id,
    kodeId: deviceRow.kode_id,
    jenisBarang: deviceRow.jenis_barang,
    tanggalBeli: deviceRow.tanggal_beli,
    garansi: deviceRow.garansi,
    garansiSampai: deviceRow.garansi_sampai,
    lokasi: deviceRow.lokasi,
    devisi: deviceRow.devisi,
    subDevisi: deviceRow.sub_devisi || '',
    merk: deviceRow.merk,
    type: deviceRow.type,
    snRegModel: deviceRow.sn_reg_model,
    spesifikasi: deviceRow.spesifikasi || '',
    gambar: deviceRow.gambar || '',
    status: deviceRow.status as Device['status'],
    kondisi: deviceRow.kondisi as Device['kondisi'],
    akunTerhubung: deviceRow.akun_terhubung || '',
    keterangan: deviceRow.keterangan || '',
    dataSource: (deviceRow.data_source as Device['dataSource']) || 'Akselera',
    tanggalDibuat: deviceRow.created_at,
    tanggalDiupdate: deviceRow.updated_at,
  }
}

// ============================================
// DEVICE OPERATIONS
// ============================================

/**
 * Get all devices from Supabase
 */
export async function getAllDevices(): Promise<Device[]> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching devices:', error)
      throw new Error(`Failed to fetch devices: ${error.message}`)
    }

    return data.map(transformDeviceFromDB)
  } catch (error) {
    console.error('Error in getAllDevices:', error)
    return []
  }
}

/**
 * Get device by ID
 */
export async function getDeviceById(id: string): Promise<Device | null> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching device:', error)
      throw new Error(`Failed to fetch device: ${error.message}`)
    }

    if (!data) return null

    return transformDeviceFromDB(data)
  } catch (error) {
    console.error('Error in getDeviceById:', error)
    return null
  }
}

/**
 * Add new device
 */
export async function addDevice(device: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">): Promise<Device | null> {
  try {
    const { data, error } = await supabase
      .from('devices')
      .insert({
        kode_id: device.kodeId,
        jenis_barang: device.jenisBarang,
        tanggal_beli: device.tanggalBeli,
        garansi: device.garansi,
        garansi_sampai: device.garansiSampai,
        lokasi: device.lokasi,
        devisi: device.devisi,
        sub_devisi: device.subDevisi || null,
        merk: device.merk,
        type: device.type,
        sn_reg_model: device.snRegModel,
        spesifikasi: device.spesifikasi || null,
        gambar: device.gambar || null,
        status: device.status,
        kondisi: device.kondisi,
        akun_terhubung: device.akunTerhubung || null,
        keterangan: device.keterangan || null,
        data_source: device.dataSource,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding device:', error)
      throw new Error(`Failed to add device: ${error.message}`)
    }

    return transformDeviceFromDB(data)
  } catch (error) {
    console.error('Error in addDevice:', error)
    return null
  }
}

/**
 * Update device
 */
export async function updateDevice(id: string, updates: Partial<Device>): Promise<Device | null> {
  try {
    const updateData: Record<string, any> = {}

    if (updates.kodeId) updateData.kode_id = updates.kodeId
    if (updates.jenisBarang) updateData.jenis_barang = updates.jenisBarang
    if (updates.tanggalBeli) updateData.tanggal_beli = updates.tanggalBeli
    if (updates.garansi !== undefined) updateData.garansi = updates.garansi
    if (updates.garansiSampai) updateData.garansi_sampai = updates.garansiSampai
    if (updates.lokasi) updateData.lokasi = updates.lokasi
    if (updates.devisi) updateData.devisi = updates.devisi
    if (updates.subDevisi !== undefined) updateData.sub_devisi = updates.subDevisi || null
    if (updates.merk) updateData.merk = updates.merk
    if (updates.type) updateData.type = updates.type
    if (updates.snRegModel) updateData.sn_reg_model = updates.snRegModel
    if (updates.spesifikasi !== undefined) updateData.spesifikasi = updates.spesifikasi || null
    if (updates.gambar !== undefined) updateData.gambar = updates.gambar || null
    if (updates.status) updateData.status = updates.status
    if (updates.kondisi) updateData.kondisi = updates.kondisi
    if (updates.akunTerhubung !== undefined) updateData.akun_terhubung = updates.akunTerhubung || null
    if (updates.keterangan !== undefined) updateData.keterangan = updates.keterangan || null
    if (updates.dataSource) updateData.data_source = updates.dataSource

    const { data, error } = await supabase
      .from('devices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating device:', error)
      throw new Error(`Failed to update device: ${error.message}`)
    }

    return transformDeviceFromDB(data)
  } catch (error) {
    console.error('Error in updateDevice:', error)
    return null
  }
}

/**
 * Delete device
 */
export async function deleteDevice(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting device:', error)
      throw new Error(`Failed to delete device: ${error.message}`)
    }

    return true
  } catch (error) {
    console.error('Error in deleteDevice:', error)
    return false
  }
}

/**
 * Search devices
 */
export async function searchDevices(query: string): Promise<Device[]> {
  try {
    if (!query.trim()) {
      return getAllDevices()
    }

    const lowerQuery = query.toLowerCase().trim()

    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .or(`kode_id.ilike.%${lowerQuery}%,jenis_barang.ilike.%${lowerQuery}%,merk.ilike.%${lowerQuery}%,type.ilike.%${lowerQuery}%,sn_reg_model.ilike.%${lowerQuery}%,sub_devisi.ilike.%${lowerQuery}%,devisi.ilike.%${lowerQuery}%,spesifikasi.ilike.%${lowerQuery}%,lokasi.ilike.%${lowerQuery}%,akun_terhubung.ilike.%${lowerQuery}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching devices:', error)
      throw new Error(`Failed to search devices: ${error.message}`)
    }

    return data.map(transformDeviceFromDB)
  } catch (error) {
    console.error('Error in searchDevices:', error)
    return []
  }
}

/**
 * Filter devices
 */
export async function filterDevices(filters: DeviceFilters): Promise<Device[]> {
  try {
    let query = supabase.from('devices').select('*')

    if (filters.kondisi && filters.kondisi !== "all") {
      query = query.eq('kondisi', filters.kondisi as any)
    }
    if (filters.devisi && filters.devisi !== "all") {
      query = query.eq('devisi', filters.devisi as any)
    }
    if (filters.jenisBarang && filters.jenisBarang !== "all") {
      query = query.eq('jenis_barang', filters.jenisBarang as any)
    }
    if (filters.status && filters.status !== "all") {
      query = query.eq('status', filters.status as any)
    }
    if (filters.dataSource && filters.dataSource !== "all") {
      query = query.eq('data_source', filters.dataSource as any)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('Error filtering devices:', error)
      throw new Error(`Failed to filter devices: ${error.message}`)
    }

    return data.map(transformDeviceFromDB)
  } catch (error) {
    console.error('Error in filterDevices:', error)
    return []
  }
}

/**
 * Get unique values for a specific field (for filters)
 */
export async function getUniqueValues(field: keyof Device): Promise<string[]> {
  const devices = await getAllDevices()
  const values = devices.map(device => device[field] as string)
  return Array.from(new Set(values)).filter(Boolean).sort()
}

// ============================================
// KODE ITEM OPERATIONS
// ============================================

/**
 * Get all kode items
 */
export async function getAllKodeItems(): Promise<KodeItem[]> {
  const { data, error } = await supabase
    .from('kode_items')
    .select('*')
    .order('kode', { ascending: true })

  if (error) {
    console.error('Error fetching kode items:', error)
    return []
  }

  return data.map(item => ({
    kode: item.kode,
    nama: item.nama,
  }))
}

/**
 * Add new kode item
 */
export async function addKodeItem(kodeItem: KodeItem): Promise<boolean> {
  const { error } = await supabase
    .from('kode_items')
    .insert({
      kode: kodeItem.kode,
      nama: kodeItem.nama,
    })

  if (error) {
    console.error('Error adding kode item:', error)
    return false
  }

  return true
}

/**
 * Delete kode item
 */
export async function deleteKodeItem(kode: string): Promise<boolean> {
  const { error } = await supabase
    .from('kode_items')
    .delete()
    .eq('kode', kode)

  if (error) {
    console.error('Error deleting kode item:', error)
    return false
  }

  return true
}

// ============================================
// DIVISI OPERATIONS
// ============================================

/**
 * Get all divisi
 */
export async function getAllDivisi(): Promise<string[]> {
  const { data, error } = await supabase
    .from('divisi')
    .select('nama')
    .order('nama', { ascending: true })

  if (error) {
    console.error('Error fetching divisi:', error)
    return []
  }

  return data.map(d => d.nama)
}

/**
 * Add new divisi
 */
export async function addDivisi(divisi: string): Promise<boolean> {
  const { error } = await supabase
    .from('divisi')
    .insert({
      nama: divisi.toUpperCase(),
    })

  if (error) {
    console.error('Error adding divisi:', error)
    return false
  }

  return true
}

/**
 * Delete divisi
 */
export async function deleteDivisi(divisi: string): Promise<boolean> {
  const { error } = await supabase
    .from('divisi')
    .delete()
    .eq('nama', divisi)

  if (error) {
    console.error('Error deleting divisi:', error)
    return false
  }

  return true
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate Kode ID format: INV-{kodeItem}-{sequence}-{tahun}
 * Example: INV-01-001-25
 */
export async function generateKodeId(kodeItem: string, tanggalBeli: string): Promise<string> {
  // Get year from tanggalBeli
  const year = new Date(tanggalBeli).getFullYear().toString().slice(-2)

  // Get devices with same kodeItem and year
  const { data, error } = await supabase
    .from('devices')
    .select('kode_id, tanggal_beli')
    .like('kode_id', `INV-${kodeItem}-%`)

  if (error) {
    console.error('Error generating kode ID:', error)
    return `INV-${kodeItem}-001-${year}`
  }

  // Filter devices with same year
  const sameTypeDevices = (data || []).filter(device => {
    const deviceYear = new Date(device.tanggal_beli).getFullYear().toString().slice(-2)
    return deviceYear === year
  })

  // Get next sequence number
  let nextSequence = 1
  if (sameTypeDevices.length > 0) {
    const sequences = sameTypeDevices.map(device => {
      const parts = device.kode_id.split('-')
      return parseInt(parts[2]) || 0
    })
    nextSequence = Math.max(...sequences) + 1
  }

  // Format sequence with leading zeros (3 digits)
  const sequenceStr = String(nextSequence).padStart(3, '0')

  return `INV-${kodeItem}-${sequenceStr}-${year}`
}
