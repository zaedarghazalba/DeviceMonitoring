"use client"

import React from "react"
import { Device } from "@/lib/types"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { exportDeviceDetailToPDF } from "@/lib/pdf-export"
import {
  FileDown,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Package,
  Shield,
  User,
  FileText,
  Tag,
} from "lucide-react"

interface DeviceDetailProps {
  device: Device
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}

export function DeviceDetail({
  device,
  onEdit,
  onDelete,
  onClose,
}: DeviceDetailProps) {
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aktif":
        return "success"
      case "Tidak Aktif":
        return "gray"
      case "Dalam Perbaikan":
        return "warning"
      case "Menunggu Approval":
        return "default"
      default:
        return "default"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleExportPDF = () => {
    exportDeviceDetailToPDF(device)
  }

  const DetailRow = ({
    icon: Icon,
    label,
    value,
    className = "",
  }: {
    icon?: any
    label: string
    value: React.ReactNode
    className?: string
  }) => (
    <div className={`flex items-start gap-4 py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${className}`}>
      <div className="flex items-center gap-3 min-w-[140px] sm:min-w-[180px]">
        {Icon && (
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</dt>
      </div>
      <dd className="flex-1 text-sm text-slate-900 dark:text-slate-100 font-medium">{value}</dd>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {device.merk} {device.type}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {device.jenisBarang}
              </span>
              <span>•</span>
              <span className="font-mono">{device.kodeId}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={getStatusBadgeVariant(device.status)} className="text-sm px-3 py-1">
              {device.status}
            </Badge>
            <Badge variant={getKondisiBadgeVariant(device.kondisi)} className="text-sm px-3 py-1">
              {device.kondisi}
            </Badge>
          </div>
        </div>

        {/* Image Display */}
        {device.gambar && (
          <div className="relative w-full overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-lg">
            <img
              src={device.gambar}
              alt={`${device.merk} ${device.type}`}
              className="w-full max-h-[400px] object-contain p-4"
            />
          </div>
        )}
      </div>

      {/* Details Sections */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            Informasi Dasar
          </h3>
          <div className="space-y-0">
            <DetailRow icon={Tag} label="Kode ID" value={<span className="font-mono">{device.kodeId}</span>} />
            <DetailRow icon={Package} label="Jenis Barang" value={device.jenisBarang} />
            <DetailRow label="Merk" value={device.merk} />
            <DetailRow label="Type" value={device.type} />
            <DetailRow label="SN / Reg Model" value={<span className="font-mono">{device.snRegModel}</span>} />
          </div>
        </div>

        {/* Purchase & Warranty */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            Pembelian & Garansi
          </h3>
          <div className="space-y-0">
            <DetailRow icon={Calendar} label="Tanggal Beli" value={formatDate(device.tanggalBeli)} />
            <DetailRow icon={Shield} label="Garansi" value={`${device.garansi} bulan`} />
            <DetailRow
              icon={Calendar}
              label="Garansi Sampai"
              value={
                <span className={new Date(device.garansiSampai) < new Date() ? "text-red-600 dark:text-red-400" : ""}>
                  {formatDate(device.garansiSampai)}
                  {new Date(device.garansiSampai) < new Date() && " (Expired)"}
                </span>
              }
            />
          </div>
        </div>

        {/* Location & User */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            Lokasi & Pengguna
          </h3>
          <div className="space-y-0">
            <DetailRow icon={MapPin} label="Lokasi" value={device.lokasi} />
            <DetailRow icon={Users} label="Divisi" value={device.devisi} />
            <DetailRow icon={User} label="Sub Divisi / Pengguna" value={device.subDevisi || "-"} />
            <DetailRow icon={User} label="Akun Terhubung" value={device.akunTerhubung || "-"} />
          </div>
        </div>

        {/* Specifications & Notes */}
        {(device.spesifikasi || device.keterangan) && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              Detail Tambahan
            </h3>
            <div className="space-y-4">
              {device.spesifikasi && (
                <div>
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Spesifikasi</dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                    {device.spesifikasi}
                  </dd>
                </div>
              )}
              {device.keterangan && (
                <div>
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Keterangan</dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                    {device.keterangan}
                  </dd>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-base mb-4 text-slate-600 dark:text-slate-400">Metadata</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-600 dark:text-slate-400 mb-1">Tanggal Dibuat</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{formatDate(device.tanggalDibuat)}</dd>
            </div>
            <div>
              <dt className="text-slate-600 dark:text-slate-400 mb-1">Terakhir Diupdate</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">{formatDate(device.tanggalDiupdate)}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          className="text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-700"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Tutup
        </Button>
      </div>
    </div>
  )
}
