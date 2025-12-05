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
} from "@/lib/storage"
import { exportDevicesToPDF } from "@/lib/pdf-export"
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
} from "lucide-react"

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<DeviceFilters>({
    kondisi: "all",
    divisi: "all",
    jenisDevice: "all",
  })

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Unique values for filters
  const [uniqueDivisions, setUniqueDivisions] = useState<string[]>([])
  const [uniqueJenisDevice, setUniqueJenisDevice] = useState<string[]>([])

  // Load devices on mount
  useEffect(() => {
    loadDevices()
  }, [])

  // Apply filters and search whenever they change
  useEffect(() => {
    applyFiltersAndSearch()
  }, [devices, searchQuery, filters])

  const loadDevices = () => {
    const allDevices = getAllDevices()
    setDevices(allDevices)
    setUniqueDivisions(getUniqueValues("divisi"))
    setUniqueJenisDevice(getUniqueValues("jenisDevice"))
  }

  const applyFiltersAndSearch = () => {
    let result = devices

    // Apply filters
    if (filters.kondisi !== "all" || filters.divisi !== "all" || filters.jenisDevice !== "all") {
      result = filterDevices(filters)
    }

    // Apply search
    if (searchQuery.trim()) {
      result = searchDevices(searchQuery).filter(device =>
        result.some(d => d.id === device.id)
      )
    }

    setFilteredDevices(result)
  }

  const handleAddDevice = (deviceData: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => {
    addDevice(deviceData)
    loadDevices()
    setIsAddDialogOpen(false)
  }

  const handleUpdateDevice = (deviceData: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => {
    if (selectedDevice) {
      updateDevice(selectedDevice.id, deviceData)
      loadDevices()
      setIsEditDialogOpen(false)
      setSelectedDevice(null)
    }
  }

  const handleDeleteDevice = () => {
    if (selectedDevice) {
      deleteDevice(selectedDevice.id)
      loadDevices()
      setIsDeleteDialogOpen(false)
      setIsDetailDialogOpen(false)
      setSelectedDevice(null)
    }
  }

  const handleExportPDF = () => {
    exportDevicesToPDF(filteredDevices)
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

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Device Monitoring System</h1>
            <p className="text-muted-foreground mt-1">
              Sistem Pencatatan Inventaris Perangkat Kantor
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportPDF} variant="outline">
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Device
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Device</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDevices}</div>
              <p className="text-xs text-muted-foreground">Semua perangkat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kondisi Baik</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{devicesBaik}</div>
              <p className="text-xs text-muted-foreground">
                {totalDevices > 0 ? Math.round((devicesBaik / totalDevices) * 100) : 0}% dari total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rusak</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{devicesRusak}</div>
              <p className="text-xs text-muted-foreground">Perlu perhatian</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dalam Perbaikan</CardTitle>
              <Wrench className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{devicesDalamPerbaikan}</div>
              <p className="text-xs text-muted-foreground">Sedang diperbaiki</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tidak Terpakai</CardTitle>
              <Archive className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{devicesTidakTerpakai}</div>
              <p className="text-xs text-muted-foreground">Tersimpan</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari device..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select
                value={filters.kondisi}
                onChange={(e) => setFilters({ ...filters, kondisi: e.target.value })}
              >
                <option value="all">Semua Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak">Rusak</option>
                <option value="Dalam Perbaikan">Dalam Perbaikan</option>
                <option value="Tidak Terpakai">Tidak Terpakai</option>
              </Select>

              <Select
                value={filters.divisi}
                onChange={(e) => setFilters({ ...filters, divisi: e.target.value })}
              >
                <option value="all">Semua Divisi</option>
                {uniqueDivisions.map((divisi) => (
                  <option key={divisi} value={divisi}>
                    {divisi}
                  </option>
                ))}
              </Select>

              <Select
                value={filters.jenisDevice}
                onChange={(e) => setFilters({ ...filters, jenisDevice: e.target.value })}
              >
                <option value="all">Semua Jenis Device</option>
                {uniqueJenisDevice.map((jenis) => (
                  <option key={jenis} value={jenis}>
                    {jenis}
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Daftar Device ({filteredDevices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Merek</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Kondisi</TableHead>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>Divisi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Tidak ada data device
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.jenisDevice}</TableCell>
                        <TableCell>{device.merek}</TableCell>
                        <TableCell>{device.model}</TableCell>
                        <TableCell className="font-mono text-sm">{device.serialNumber}</TableCell>
                        <TableCell>
                          <Badge variant={getKondisiBadgeVariant(device.kondisi)}>
                            {device.kondisi}
                          </Badge>
                        </TableCell>
                        <TableCell>{device.pengguna || "-"}</TableCell>
                        <TableCell>{device.divisi}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openDetailDialog(device)}
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditDialog(device)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openDeleteDialog(device)}
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Device Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Device Baru</DialogTitle>
          </DialogHeader>
          <DeviceForm
            onSubmit={handleAddDevice}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
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
        <DialogContent>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus Device</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin menghapus device ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            {selectedDevice && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium">{selectedDevice.merek} {selectedDevice.model}</p>
                <p className="text-sm text-muted-foreground">S/N: {selectedDevice.serialNumber}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setSelectedDevice(null)
                }}
              >
                Batal
              </Button>
              <Button variant="destructive" onClick={handleDeleteDevice}>
                Hapus Device
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
