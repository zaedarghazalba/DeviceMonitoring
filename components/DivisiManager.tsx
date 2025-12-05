"use client"

import React, { useState, useEffect } from "react"
import { getAllDivisi, addDivisi, deleteDivisi } from "@/lib/supabase/db-operations"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Plus, Trash2 } from "lucide-react"

interface DivisiManagerProps {
  onUpdate?: () => void
}

export function DivisiManager({ onUpdate }: DivisiManagerProps) {
  const [divisiList, setDivisiList] = useState<string[]>([])
  const [newDivisi, setNewDivisi] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    const divisi = await getAllDivisi()
    setDivisiList(divisi)
    if (onUpdate) onUpdate()
  }

  const handleAdd = async () => {
    setError("")

    // Validation
    if (!newDivisi.trim()) {
      setError("Nama divisi harus diisi")
      return
    }

    const success = await addDivisi(newDivisi)

    if (success) {
      setNewDivisi("")
      await refreshData()
    } else {
      setError("Divisi sudah ada")
    }
  }

  const handleDelete = async (divisi: string) => {
    if (confirm(`Hapus divisi ${divisi}?`)) {
      await deleteDivisi(divisi)
      await refreshData()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="newDivisi" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Divisi</Label>
          <Input
            id="newDivisi"
            value={newDivisi}
            onChange={(e) => setNewDivisi(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Contoh: MARKETING"
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Divisi
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
        <h3 className="text-sm font-medium mb-3 text-slate-900 dark:text-slate-100">Daftar Divisi ({divisiList.length})</h3>
        <div className="flex flex-wrap gap-2">
          {divisiList.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-400">Tidak ada divisi</p>
          ) : (
            divisiList.map((divisi) => (
              <div key={divisi} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-md border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{divisi}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 ml-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  onClick={() => handleDelete(divisi)}
                  title="Hapus"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
