// Export Supabase clients
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'

// Export database types
export type { Database } from './database.types'

// Export all database operations
export {
  // Device operations
  getAllDevices,
  getDeviceById,
  addDevice,
  updateDevice,
  deleteDevice,
  searchDevices,
  filterDevices,
  getUniqueValues,

  // Kode Item operations
  getAllKodeItems,
  addKodeItem,
  deleteKodeItem,

  // Divisi operations
  getAllDivisi,
  addDivisi,
  deleteDivisi,

  // Helper functions
  generateKodeId,
} from './db-operations'
