"use client"

import React, { useState, useEffect } from "react"
import { Device, DeviceFilters } from "@/lib/types"
import {
  getAllDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  searchDevices,
  filterDevices,
  getUniqueValues,
} from "@/lib/supabase/db-operations"
import { exportDevicesToPDF, exportDevicesToCSV } from "@/lib/pdf-export"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DeviceForm } from "@/components/DeviceForm"
import { DeviceDetail } from "@/components/DeviceDetail"
import { KodeItemManager } from "@/components/KodeItemManager"
import { DivisiManager } from "@/components/DivisiManager"
import { ThemeToggle } from "@/components/ThemeToggle"
import {
  Plus,
  Search,
  FileDown,
  Eye,
  Edit,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  Wrench,
  Archive,
  Settings,
  LogOut,
  X,
  Filter,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/lib/supabase/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<DeviceFilters>({
    kondisi: "all",
    devisi: "all",
    jenisBarang: "all",
    status: "all",
  })

  // Loading states
  const [isLoadingDevices, setIsLoadingDevices] = useState(true)
  const [isApplyingFilters, setIsApplyingFilters] = useState(false)

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [settingsTab, setSettingsTab] = useState<"kodeItem" | "divisi">("kodeItem")

  // Unique values for filters
  const [uniqueDevisi, setUniqueDevisi] = useState<string[]>([])
  const [uniqueJenisBarang, setUniqueJenisBarang] = useState<string[]>([])

  // Load devices on mount
  useEffect(() => {
    loadDevices()
  }, [])

  // Load unique values for filters
  useEffect(() => {
    loadUniqueValues()
  }, [devices])

  // Apply filters and search whenever they change
  useEffect(() => {
    applyFiltersAndSearch()
  }, [searchQuery, filters])

  const loadDevices = async () => {
    setIsLoadingDevices(true)
    try {
      const allDevices = await getAllDevices()
      setDevices(allDevices)
      setFilteredDevices(allDevices)
    } catch (error) {
      console.error("Error loading devices:", error)
    } finally {
      setIsLoadingDevices(false)
    }
  }

  const loadUniqueValues = async () => {
    const devisi = await getUniqueValues("devisi")
    const jenisBarang = await getUniqueValues("jenisBarang")
    setUniqueDevisi(devisi)
    setUniqueJenisBarang(jenisBarang)
  }

  const applyFiltersAndSearch = async () => {
    setIsApplyingFilters(true)
    try {
      let result = devices

      // Check if any filter is active
      const hasActiveFilters =
        filters.kondisi !== "all" ||
        filters.devisi !== "all" ||
        filters.jenisBarang !== "all" ||
        filters.status !== "all"

      // Apply filters from Supabase if any filter is active
      if (hasActiveFilters) {
        result = await filterDevices(filters)
      }

      // Apply search on top of filtered results
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase().trim()
        result = result.filter(device =>
          device.kodeId.toLowerCase().includes(lowerQuery) ||
          device.jenisBarang.toLowerCase().includes(lowerQuery) ||
          device.merk.toLowerCase().includes(lowerQuery) ||
          device.type.toLowerCase().includes(lowerQuery) ||
          device.snRegModel.toLowerCase().includes(lowerQuery) ||
          device.devisi.toLowerCase().includes(lowerQuery) ||
          (device.subDevisi && device.subDevisi.toLowerCase().includes(lowerQuery)) ||
          (device.lokasi && device.lokasi.toLowerCase().includes(lowerQuery))
        )
      }

      setFilteredDevices(result)
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setIsApplyingFilters(false)
    }
  }

  const handleAddDevice = async (deviceData: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => {
    await addDevice(deviceData)
    await loadDevices()
    setIsAddDialogOpen(false)
  }

  const handleUpdateDevice = async (deviceData: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => {
    if (selectedDevice) {
      await updateDevice(selectedDevice.id, deviceData)
      await loadDevices()
      setIsEditDialogOpen(false)
      setSelectedDevice(null)
    }
  }

  const handleDeleteDevice = async () => {
    if (selectedDevice) {
      await deleteDevice(selectedDevice.id)
      await loadDevices()
      setIsDeleteDialogOpen(false)
      setIsDetailDialogOpen(false)
      setSelectedDevice(null)
    }
  }

  const handleExport = (format: "pdf" | "csv") => {
    if (format === "pdf") {
      exportDevicesToPDF(filteredDevices)
    } else {
      exportDevicesToCSV(filteredDevices)
    }
    setIsExportDialogOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
    router.refresh()
  }

  const handleClearFilters = () => {
    setFilters({
      kondisi: "all",
      devisi: "all",
      jenisBarang: "all",
      status: "all",
    })
    setSearchQuery("")
  }

  const openDetailDialog = (device: Device) => {
    setSelectedDevice(device)
    setIsDetailDialogOpen(true)
  }

  const openEditDialog = (device: Device) => {
    setSelectedDevice(device)
    setIsDetailDialogOpen(false)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (device: Device) => {
    setSelectedDevice(device)
    setIsDeleteDialogOpen(true)
  }

  const getKondisiBadgeVariant = (kondisi: string) => {
    switch (kondisi) {
      case "Baik":
        return "success"
      case "Rusak":
        return "destructive"
      case "Dalam Perbaikan":
        return "warning"
      case "Tidak Terpakai":
        return "gray"
      default:
        return "default"
    }
  }

  // Calculate statistics
  const totalDevices = devices.length
  const devicesBaik = devices.filter(d => d.kondisi === "Baik").length
  const devicesRusak = devices.filter(d => d.kondisi === "Rusak").length
  const devicesDalamPerbaikan = devices.filter(d => d.kondisi === "Dalam Perbaikan").length
  const devicesTidakTerpakai = devices.filter(d => d.kondisi === "Tidak Terpakai").length

  // Count active filters
  const activeFilterCount = [
    filters.kondisi !== "all",
    filters.devisi !== "all",
    filters.jenisBarang !== "all",
    filters.status !== "all",
    searchQuery.trim() !== ""
  ].filter(Boolean).length

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Device Monitoring System
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Sistem Pencatatan Inventaris Perangkat Kantor
            </p>
            {user && (
              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {user.email}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsSettingsDialogOpen(true)}
              variant="outline"
              className="text-slate-700 dark:text-slate-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </Button>
            <Button
              onClick={() => setIsExportDialogOpen(true)}
              variant="outline"
              className="text-slate-700 dark:text-slate-300"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
            <ThemeToggle />
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Barang
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-slate-700 dark:text-slate-300 hover:text-red-600 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Device</CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalDevices}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Semua perangkat terdaftar</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Kondisi Baik</CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{devicesBaik}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {totalDevices > 0 ? Math.round((devicesBaik / totalDevices) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rusak</CardTitle>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{devicesRusak}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Perlu perhatian segera</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dalam Perbaikan</CardTitle>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Wrench className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{devicesDalamPerbaikan}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Sedang diperbaiki</p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak Terpakai</CardTitle>
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <Archive className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-600 dark:text-slate-300">{devicesTidakTerpakai}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Disimpan</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Filter & Pencarian</CardTitle>
              {activeFilterCount > 0 && (
                <Badge variant="default" className="ml-2 bg-blue-600 text-white">
                  {activeFilterCount} aktif
                </Badge>
              )}
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative lg:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <Input
                  placeholder="Cari barang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
                />
              </div>

              <Select
                value={filters.kondisi}
                onChange={(e) => setFilters({ ...filters, kondisi: e.target.value })}
                className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Kondisi</option>
                <option value="Baik" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Baik</option>
                <option value="Rusak" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Rusak</option>
                <option value="Dalam Perbaikan" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Dalam Perbaikan</option>
                <option value="Tidak Terpakai" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Tidak Terpakai</option>
              </Select>

              <Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Status</option>
                <option value="Aktif" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Aktif</option>
                <option value="Tidak Aktif" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Tidak Aktif</option>
                <option value="Dalam Perbaikan" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Dalam Perbaikan</option>
                <option value="Menunggu Approval" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Menunggu Approval</option>
              </Select>

              <Select
                value={filters.devisi}
                onChange={(e) => setFilters({ ...filters, devisi: e.target.value })}
                className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Divisi</option>
                {uniqueDevisi.map((devisi) => (
                  <option key={devisi} value={devisi} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {devisi}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.jenisBarang}
                onChange={(e) => setFilters({ ...filters, jenisBarang: e.target.value })}
                className="h-10 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Jenis Barang</option>
                {uniqueJenisBarang.map((jenis) => (
                  <option key={jenis} value={jenis} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {jenis}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Daftar Barang
                <Badge variant="outline" className="ml-2 font-normal text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600">
                  {filteredDevices.length} items
                </Badge>
              </CardTitle>
              {isApplyingFilters && (
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memfilter...
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingDevices ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Memuat data perangkat...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kode ID</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Jenis Barang</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Merk</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Type</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">SN/Reg Model</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kondisi</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Divisi</TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Sub Divisi</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                              <Package className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">Tidak ada data barang</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {activeFilterCount > 0
                                  ? "Coba ubah filter atau hapus filter aktif"
                                  : "Mulai dengan menambahkan barang baru"}
                              </p>
                            </div>
                            {activeFilterCount > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="mt-2 text-slate-700 dark:text-slate-300"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDevices.map((device, index) => (
                        <TableRow
                          key={device.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <TableCell className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">{device.kodeId}</TableCell>
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100">{device.jenisBarang}</TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{device.merk}</TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{device.type}</TableCell>
                          <TableCell className="font-mono text-sm text-slate-700 dark:text-slate-300">{device.snRegModel}</TableCell>
                          <TableCell>
                            <Badge variant={getKondisiBadgeVariant(device.status)} className="font-medium">
                              {device.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getKondisiBadgeVariant(device.kondisi)} className="font-medium">
                              {device.kondisi}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{device.devisi}</TableCell>
                          <TableCell className="text-slate-700 dark:text-slate-300">{device.subDevisi || "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openDetailDialog(device)}
                                title="Lihat Detail"
                                className="text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialog(device)}
                                title="Edit"
                                className="text-slate-600 dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openDeleteDialog(device)}
                                title="Hapus"
                                className="text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Device Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Tambah Barang Baru</DialogTitle>
          </DialogHeader>
          <DeviceForm
            onSubmit={handleAddDevice}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Edit Barang</DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <DeviceForm
              device={selectedDevice}
              onSubmit={handleUpdateDevice}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedDevice(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Device Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          {selectedDevice && (
            <DeviceDetail
              device={selectedDevice}
              onEdit={() => openEditDialog(selectedDevice)}
              onDelete={() => openDeleteDialog(selectedDevice)}
              onClose={() => {
                setIsDetailDialogOpen(false)
                setSelectedDevice(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Konfirmasi Hapus Barang</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            {selectedDevice && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                <p className="font-semibold text-red-900 dark:text-red-100">{selectedDevice.merk} {selectedDevice.type}</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Kode: {selectedDevice.kodeId} | S/N: {selectedDevice.snRegModel}</p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedDevice(null)
                }}
                className="text-slate-700 dark:text-slate-300"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteDevice}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Barang
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pengaturan</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-4">
            <button
              onClick={() => setSettingsTab("kodeItem")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                settingsTab === "kodeItem"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300"
              }`}
            >
              Kode Item
            </button>
            <button
              onClick={() => setSettingsTab("divisi")}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                settingsTab === "divisi"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300"
              }`}
            >
              Divisi
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {settingsTab === "kodeItem" ? (
              <KodeItemManager onUpdate={loadDevices} />
            ) : (
              <DivisiManager onUpdate={loadDevices} />
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button onClick={() => setIsSettingsDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">Export Laporan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Pilih format file untuk mengexport {filteredDevices.length} data perangkat
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleExport("pdf")}
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700 group"
              >
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FileDown className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">PDF</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Format katalog dengan gambar</p>
                </div>
              </Button>

              <Button
                onClick={() => handleExport("csv")}
                variant="outline"
                className="h-32 flex flex-col items-center justify-center gap-3 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-300 dark:hover:border-green-700 group"
              >
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FileDown className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">CSV</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Format spreadsheet Excel</p>
                </div>
              </Button>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} className="text-slate-700 dark:text-slate-300">
                Batal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
