"use client"

import React from "react"
import { Device } from "@/lib/types"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { exportDeviceDetailToPDF } from "@/lib/pdf-export"
import { FileDown, Edit, Trash2 } from "lucide-react"

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
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

  const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0">
      <dt className="font-medium text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-foreground">{value}</dd>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{device.merek} {device.model}</h2>
          <p className="text-sm text-muted-foreground mt-1">{device.jenisDevice}</p>
        </div>
        <Badge variant={getKondisiBadgeVariant(device.kondisi)}>
          {device.kondisi}
        </Badge>
      </div>

      {/* Details */}
      <dl className="space-y-0 bg-muted/30 rounded-lg p-4">
        <DetailRow label="Serial Number" value={device.serialNumber} />
        <DetailRow label="Merek" value={device.merek} />
        <DetailRow label="Model" value={device.model} />
        <DetailRow label="Kondisi" value={device.kondisi} />
        <DetailRow label="Pengguna" value={device.pengguna || "-"} />
        <DetailRow label="Divisi" value={device.divisi} />
        <DetailRow label="Lokasi" value={device.lokasi} />
        <DetailRow
          label="Spesifikasi"
          value={device.spesifikasi || "-"}
        />
        <DetailRow
          label="Tanggal Pembelian"
          value={formatDate(device.tanggalPembelian)}
        />
        <DetailRow
          label="Nilai Aset"
          value={formatCurrency(device.nilaiAset)}
        />
        <DetailRow
          label="Catatan"
          value={device.catatan || "-"}
        />
        <DetailRow
          label="Tanggal Dibuat"
          value={formatDate(device.tanggalDibuat)}
        />
        <DetailRow
          label="Terakhir Diupdate"
          value={formatDate(device.tanggalDiupdate)}
        />
      </dl>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-end pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onClose}
        >
          Tutup
        </Button>
      </div>
    </div>
  )
}
