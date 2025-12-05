"use client"

import React, { useState, useEffect } from "react"
import { Device, DeviceKondisi, DeviceStatus } from "@/lib/types"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { getAllKodeItems, getAllDivisi, generateKodeId } from "@/lib/kode-item"
import { getAllDevices } from "@/lib/storage"
import { Loader2, Image as ImageIcon, X, Check } from "lucide-react"

interface DeviceFormProps {
  device?: Device
  onSubmit: (data: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => void
  onCancel: () => void
}

const kondisiOptions: DeviceKondisi[] = [
  "Baik",
  "Rusak",
  "Dalam Perbaikan",
  "Tidak Terpakai",
]

const statusOptions: DeviceStatus[] = [
  "Aktif",
  "Tidak Aktif",
  "Dalam Perbaikan",
  "Menunggu Approval",
]

export function DeviceForm({ device, onSubmit, onCancel }: DeviceFormProps) {
  const [kodeItems, setKodeItems] = useState(getAllKodeItems())
  const [divisiList, setDivisiList] = useState(getAllDivisi())
  const [selectedKodeItem, setSelectedKodeItem] = useState("")
  const [imagePreview, setImagePreview] = useState<string>(device?.gambar || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    kodeId: device?.kodeId || "",
    jenisBarang: device?.jenisBarang || "",
    tanggalBeli: device?.tanggalBeli || "",
    garansi: device?.garansi || 0,
    garansiSampai: device?.garansiSampai || "",
    lokasi: device?.lokasi || "",
    devisi: device?.devisi || "",
    subDevisi: device?.subDevisi || "",
    merk: device?.merk || "",
    type: device?.type || "",
    snRegModel: device?.snRegModel || "",
    spesifikasi: device?.spesifikasi || "",
    gambar: device?.gambar || "",
    status: device?.status || ("Aktif" as DeviceStatus),
    kondisi: device?.kondisi || ("Baik" as DeviceKondisi),
    akunTerhubung: device?.akunTerhubung || "",
    keterangan: device?.keterangan || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-generate Kode ID when jenisBarang or tanggalBeli changes (only for new device)
  useEffect(() => {
    if (!device && selectedKodeItem && formData.tanggalBeli) {
      const existingDevices = getAllDevices()
      const newKodeId = generateKodeId(selectedKodeItem, existingDevices, formData.tanggalBeli)
      setFormData(prev => ({
        ...prev,
        kodeId: newKodeId
      }))
    }
  }, [selectedKodeItem, formData.tanggalBeli, device])

  // Auto-calculate garansiSampai when tanggalBeli or garansi changes
  useEffect(() => {
    if (formData.tanggalBeli && formData.garansi > 0) {
      const tanggalBeli = new Date(formData.tanggalBeli)
      const garansiSampai = new Date(tanggalBeli)
      garansiSampai.setMonth(garansiSampai.getMonth() + formData.garansi)
      setFormData(prev => ({
        ...prev,
        garansiSampai: garansiSampai.toISOString().split('T')[0]
      }))
    }
  }, [formData.tanggalBeli, formData.garansi])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "garansi" ? Number(value) : value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleJenisBarangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNama = e.target.value
    const kodeItem = kodeItems.find(item => item.nama === selectedNama)

    if (kodeItem) {
      setSelectedKodeItem(kodeItem.kode)
      setFormData(prev => ({
        ...prev,
        jenisBarang: selectedNama
      }))
    }

    if (errors.jenisBarang) {
      setErrors((prev) => ({ ...prev, jenisBarang: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, gambar: "File harus berupa gambar" }))
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, gambar: "Ukuran gambar maksimal 10MB" }))
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData(prev => ({
        ...prev,
        gambar: base64String
      }))
      setImagePreview(base64String)
      setErrors(prev => ({ ...prev, gambar: "" }))
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      gambar: ""
    }))
    setImagePreview("")
    // Reset file input
    const fileInput = document.getElementById('gambar') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.kodeId.trim()) {
      newErrors.kodeId = "Kode ID wajib diisi"
    }
    if (!formData.jenisBarang.trim()) {
      newErrors.jenisBarang = "Jenis barang wajib diisi"
    }
    if (!formData.tanggalBeli) {
      newErrors.tanggalBeli = "Tanggal beli wajib diisi"
    }
    if (!formData.lokasi.trim()) {
      newErrors.lokasi = "Lokasi wajib diisi"
    }
    if (!formData.devisi.trim()) {
      newErrors.devisi = "Devisi wajib diisi"
    }
    if (!formData.merk.trim()) {
      newErrors.merk = "Merk wajib diisi"
    }
    if (!formData.type.trim()) {
      newErrors.type = "Type wajib diisi"
    }
    if (!formData.snRegModel.trim()) {
      newErrors.snRegModel = "SN / Reg Model wajib diisi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Main Information Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">Informasi Utama</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Jenis Barang */}
          <div className="space-y-2">
            <Label htmlFor="jenisBarang" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Jenis Barang <span className="text-red-500">*</span>
            </Label>
            <Select
              id="jenisBarang"
              name="jenisBarang"
              value={formData.jenisBarang}
              onChange={handleJenisBarangChange}
              disabled={!!device}
              className="w-full min-h-[44px] text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pilih jenis barang</option>
              {kodeItems.map((item) => (
                <option key={item.kode} value={item.nama} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {item.nama}
                </option>
              ))}
            </Select>
            {errors.jenisBarang && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.jenisBarang}
              </p>
            )}
          </div>

          {/* Kode ID (auto-generated) */}
          <div className="space-y-2">
            <Label htmlFor="kodeId" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Kode ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="kodeId"
              name="kodeId"
              value={formData.kodeId}
              disabled
              className="min-h-[44px] text-sm bg-slate-50 dark:bg-slate-900 font-mono border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              placeholder="Auto-generated: INV-XX-XXX-XX"
            />
            {errors.kodeId && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.kodeId}
              </p>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Format: INV-[Kode Item]-[Urutan]-[Tahun]
            </p>
          </div>

          {/* Merk */}
          <div className="space-y-2">
            <Label htmlFor="merk" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Merk <span className="text-red-500">*</span>
            </Label>
            <Input
              id="merk"
              name="merk"
              value={formData.merk}
              onChange={handleChange}
              placeholder="Contoh: Dell, HP, Lenovo"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {errors.merk && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.merk}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Type <span className="text-red-500">*</span>
            </Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="Contoh: Latitude 5420"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {errors.type && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.type}
              </p>
            )}
          </div>

          {/* SN / Reg Model */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="snRegModel" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              SN / Reg Model <span className="text-red-500">*</span>
            </Label>
            <Input
              id="snRegModel"
              name="snRegModel"
              value={formData.snRegModel}
              onChange={handleChange}
              placeholder="Contoh: DL-LAT-001"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {errors.snRegModel && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.snRegModel}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Information Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">Informasi Pembelian</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Tanggal Beli */}
          <div className="space-y-2">
            <Label htmlFor="tanggalBeli" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tanggal Beli <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggalBeli"
              name="tanggalBeli"
              type="date"
              value={formData.tanggalBeli}
              onChange={handleChange}
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {errors.tanggalBeli && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.tanggalBeli}
              </p>
            )}
          </div>

          {/* Garansi (bulan) */}
          <div className="space-y-2">
            <Label htmlFor="garansi" className="text-sm font-medium text-slate-700 dark:text-slate-300">Garansi (bulan)</Label>
            <Input
              id="garansi"
              name="garansi"
              type="number"
              value={formData.garansi}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>

          {/* Garansi Sampai (auto-calculated) */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="garansiSampai" className="text-sm font-medium text-slate-700 dark:text-slate-300">Garansi Sampai (otomatis)</Label>
            <Input
              id="garansiSampai"
              name="garansiSampai"
              type="date"
              value={formData.garansiSampai}
              disabled
              className="min-h-[44px] text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Location Information Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded">
            <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">Informasi Lokasi & Pengguna</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Lokasi */}
          <div className="space-y-2">
            <Label htmlFor="lokasi" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Lokasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lokasi"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              placeholder="Contoh: Kantor Pusat - Lt. 3"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            {errors.lokasi && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.lokasi}
              </p>
            )}
          </div>

          {/* Devisi */}
          <div className="space-y-2">
            <Label htmlFor="devisi" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Divisi <span className="text-red-500">*</span>
            </Label>
            <Select
              id="devisi"
              name="devisi"
              value={formData.devisi}
              onChange={handleChange}
              className="w-full min-h-[44px] text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pilih divisi</option>
              {divisiList.map((divisi) => (
                <option key={divisi} value={divisi} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {divisi}
                </option>
              ))}
            </Select>
            {errors.devisi && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.devisi}
              </p>
            )}
          </div>

          {/* Sub Devisi / Pengguna */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subDevisi" className="text-sm font-medium text-slate-700 dark:text-slate-300">Sub Divisi / Pengguna</Label>
            <Input
              id="subDevisi"
              name="subDevisi"
              value={formData.subDevisi}
              onChange={handleChange}
              placeholder="Nama sub divisi atau pengguna"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Status Information Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded">
            <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">Status & Kondisi</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full min-h-[44px] text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {option}
                </option>
              ))}
            </Select>
          </div>

          {/* Kondisi */}
          <div className="space-y-2">
            <Label htmlFor="kondisi" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Kondisi <span className="text-red-500">*</span>
            </Label>
            <Select
              id="kondisi"
              name="kondisi"
              value={formData.kondisi}
              onChange={handleChange}
              className="w-full min-h-[44px] text-sm bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
            >
              {kondisiOptions.map((option) => (
                <option key={option} value={option} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {option}
                </option>
              ))}
            </Select>
          </div>

          {/* Akun Terhubung */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="akunTerhubung" className="text-sm font-medium text-slate-700 dark:text-slate-300">Akun Terhubung</Label>
            <Input
              id="akunTerhubung"
              name="akunTerhubung"
              value={formData.akunTerhubung}
              onChange={handleChange}
              placeholder="Email atau username"
              className="min-h-[44px] text-sm border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded">
            <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">Informasi Tambahan</h3>
        </div>

        {/* Spesifikasi */}
        <div className="space-y-2">
          <Label htmlFor="spesifikasi" className="text-sm font-medium text-slate-700 dark:text-slate-300">Spesifikasi</Label>
          <Textarea
            id="spesifikasi"
            name="spesifikasi"
            value={formData.spesifikasi}
            onChange={handleChange}
            placeholder="Detail spesifikasi teknis (CPU, RAM, Storage, dll)"
            rows={3}
          />
        </div>

        {/* Keterangan */}
        <div className="space-y-2">
          <Label htmlFor="keterangan" className="text-sm font-medium text-slate-700 dark:text-slate-300">Keterangan</Label>
          <Textarea
            id="keterangan"
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            placeholder="Keterangan tambahan"
            rows={3}
          />
        </div>

        {/* Gambar Upload */}
        <div className="space-y-2">
          <Label htmlFor="gambar" className="text-sm font-medium text-slate-700 dark:text-slate-300">Gambar Barang</Label>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Input
                id="gambar"
                name="gambar"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="cursor-pointer min-h-[44px] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-950 dark:file:text-blue-300 transition-all border-slate-200 dark:border-slate-700"
              />
            </div>
            {errors.gambar && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.gambar}
              </p>
            )}
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>Format: JPG, PNG, GIF. Maksimal 10MB. Di HP bisa langsung ambil foto dari kamera.</span>
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full max-w-full sm:max-w-sm p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 sm:h-56 object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                  title="Hapus gambar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[100px] min-h-[44px] text-slate-700 dark:text-slate-300 order-2 sm:order-1"
        >
          Batal
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[140px] min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white order-1 sm:order-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {device ? "Update Barang" : "Tambah Barang"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
