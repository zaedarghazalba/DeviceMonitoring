"use client"

import React, { useState, useEffect } from "react"
import { KodeItem } from "@/lib/types"
import { getAllKodeItems, addKodeItem, deleteKodeItem } from "@/lib/supabase/db-operations"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Plus, Trash2 } from "lucide-react"

interface KodeItemManagerProps {
  onUpdate?: () => void
}

export function KodeItemManager({ onUpdate }: KodeItemManagerProps) {
  const [kodeItems, setKodeItems] = useState<KodeItem[]>([])
  const [newKode, setNewKode] = useState("")
  const [newNama, setNewNama] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    const items = await getAllKodeItems()
    setKodeItems(items)
    if (onUpdate) onUpdate()
  }

  const handleAdd = async () => {
    setError("")

    // Validation
    if (!newKode.trim() || !newNama.trim()) {
      setError("Kode dan nama harus diisi")
      return
    }

    // Kode must be 2 digits
    if (!/^\d{2}$/.test(newKode)) {
      setError("Kode harus 2 digit angka (contoh: 18, 19, 20)")
      return
    }

    const success = await addKodeItem({
      kode: newKode,
      nama: newNama,
    })

    if (success) {
      setNewKode("")
      setNewNama("")
      refreshData()
    } else {
      setError("Kode sudah ada")
    }
  }

  const handleDelete = async (kode: string) => {
    if (confirm(`Hapus kode item ${kode}?`)) {
      await deleteKodeItem(kode)
      await refreshData()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newKode" className="text-sm font-medium text-slate-700 dark:text-slate-300">Kode (2 digit)</Label>
          <Input
            id="newKode"
            value={newKode}
            onChange={(e) => setNewKode(e.target.value)}
            placeholder="01"
            maxLength={2}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newNama" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Item</Label>
          <Input
            id="newNama"
            value={newNama}
            onChange={(e) => setNewNama(e.target.value)}
            placeholder="Nama barang"
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800">
              <TableHead className="w-24 text-slate-700 dark:text-slate-300">Kode</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Nama Item</TableHead>
              <TableHead className="w-24 text-right text-slate-700 dark:text-slate-300">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kodeItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-slate-600 dark:text-slate-400">
                  Tidak ada kode item
                </TableCell>
              </TableRow>
            ) : (
              kodeItems.map((item) => (
                <TableRow key={item.kode} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-mono font-medium text-slate-900 dark:text-slate-100">{item.kode}</TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">{item.nama}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.kode)}
                      title="Hapus"
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
