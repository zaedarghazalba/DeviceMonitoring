"use client"

import React, { useState } from "react"
import { Device, DeviceKondisi } from "@/lib/types"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"

interface DeviceFormProps {
  device?: Device
  onSubmit: (data: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => void
  onCancel: () => void
}

const jenisDeviceOptions = [
  "Computer",
  "Laptop",
  "Monitor",
  "Printer",
  "Router",
  "Switch",
  "Server",
  "Tablet",
  "Smartphone",
  "Keyboard",
  "Mouse",
  "Scanner",
  "Webcam",
  "Headset",
  "UPS",
  "Lainnya",
]

const kondisiOptions: DeviceKondisi[] = [
  "Baik",
  "Rusak",
  "Dalam Perbaikan",
  "Tidak Terpakai",
]

export function DeviceForm({ device, onSubmit, onCancel }: DeviceFormProps) {
  const [formData, setFormData] = useState({
    jenisDevice: device?.jenisDevice || "",
    merek: device?.merek || "",
    model: device?.model || "",
    serialNumber: device?.serialNumber || "",
    kondisi: device?.kondisi || ("Baik" as DeviceKondisi),
    pengguna: device?.pengguna || "",
    divisi: device?.divisi || "",
    spesifikasi: device?.spesifikasi || "",
    tanggalPembelian: device?.tanggalPembelian || "",
    nilaiAset: device?.nilaiAset || 0,
    lokasi: device?.lokasi || "",
    catatan: device?.catatan || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "nilaiAset" ? Number(value) : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.jenisDevice.trim()) {
      newErrors.jenisDevice = "Jenis device wajib diisi"
    }
    if (!formData.merek.trim()) {
      newErrors.merek = "Merek wajib diisi"
    }
    if (!formData.model.trim()) {
      newErrors.model = "Model wajib diisi"
    }
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number wajib diisi"
    }
    if (!formData.divisi.trim()) {
      newErrors.divisi = "Divisi wajib diisi"
    }
    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi wajib diisi"
    }
    if (!formData.tanggalPembelian) {
      newErrors.tanggalPembelian = "Tanggal pembelian wajib diisi"
    }
    if (formData.nilaiAset <= 0) {
      newErrors.nilaiAset = "Nilai aset harus lebih dari 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jenisDevice">
            Jenis Device <span className="text-red-500">*</span>
          </Label>
          <Select
            id="jenisDevice"
            name="jenisDevice"
            value={formData.jenisDevice}
            onChange={handleChange}
          >
            <option value="">Pilih jenis device</option>
            {jenisDeviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          {errors.jenisDevice && (
            <p className="text-sm text-red-500">{errors.jenisDevice}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="kondisi">
            Kondisi <span className="text-red-500">*</span>
          </Label>
          <Select
            id="kondisi"
            name="kondisi"
            value={formData.kondisi}
            onChange={handleChange}
          >
            {kondisiOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="merek">
            Merek <span className="text-red-500">*</span>
          </Label>
          <Input
            id="merek"
            name="merek"
            value={formData.merek}
            onChange={handleChange}
            placeholder="Contoh: Dell, HP, Lenovo"
          />
          {errors.merek && (
            <p className="text-sm text-red-500">{errors.merek}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">
            Model <span className="text-red-500">*</span>
          </Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Contoh: Latitude 5420"
          />
          {errors.model && (
            <p className="text-sm text-red-500">{errors.model}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">
            Serial Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            value={formData.serialNumber}
            onChange={handleChange}
            placeholder="Contoh: DL-LAT-001"
          />
          {errors.serialNumber && (
            <p className="text-sm text-red-500">{errors.serialNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pengguna">Pengguna</Label>
          <Input
            id="pengguna"
            name="pengguna"
            value={formData.pengguna}
            onChange={handleChange}
            placeholder="Nama pengguna"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="divisi">
            Divisi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="divisi"
            name="divisi"
            value={formData.divisi}
            onChange={handleChange}
            placeholder="Contoh: IT Support, Finance"
          />
          {errors.divisi && (
            <p className="text-sm text-red-500">{errors.divisi}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lokasi">
            Lokasi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lokasi"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleChange}
            placeholder="Contoh: Kantor Pusat - Lt. 3"
          />
          {errors.lokasi && (
            <p className="text-sm text-red-500">{errors.lokasi}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tanggalPembelian">
            Tanggal Pembelian <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tanggalPembelian"
            name="tanggalPembelian"
            type="date"
            value={formData.tanggalPembelian}
            onChange={handleChange}
          />
          {errors.tanggalPembelian && (
            <p className="text-sm text-red-500">{errors.tanggalPembelian}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nilaiAset">
            Nilai Aset (Rp) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nilaiAset"
            name="nilaiAset"
            type="number"
            value={formData.nilaiAset}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
          {errors.nilaiAset && (
            <p className="text-sm text-red-500">{errors.nilaiAset}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="spesifikasi">Spesifikasi</Label>
        <textarea
          id="spesifikasi"
          name="spesifikasi"
          value={formData.spesifikasi}
          onChange={handleChange}
          placeholder="Detail spesifikasi teknis"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="catatan">Catatan</Label>
        <textarea
          id="catatan"
          name="catatan"
          value={formData.catatan}
          onChange={handleChange}
          placeholder="Catatan tambahan"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          {device ? "Update Device" : "Tambah Device"}
        </Button>
      </div>
    </form>
  )
}
