import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Device } from "./types";

export function exportDevicesToPDF(devices: Device[]): void {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title and header
  doc.setFontSize(18);
  doc.text("Laporan Inventaris Perangkat Kantor", 14, 15);

  doc.setFontSize(11);
  doc.text("Device Monitoring System", 14, 22);
  doc.setFontSize(9);
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, 14, 27);

  // Summary statistics
  const totalDevices = devices.length;
  const devicesBaik = devices.filter(d => d.kondisi === "Baik").length;
  const devicesRusak = devices.filter(d => d.kondisi === "Rusak").length;
  const devicesDalamPerbaikan = devices.filter(d => d.kondisi === "Dalam Perbaikan").length;
  const devicesTidakTerpakai = devices.filter(d => d.kondisi === "Tidak Terpakai").length;

  doc.setFontSize(9);
  doc.text(`Total Perangkat: ${totalDevices} | Baik: ${devicesBaik} | Rusak: ${devicesRusak} | Dalam Perbaikan: ${devicesDalamPerbaikan} | Tidak Terpakai: ${devicesTidakTerpakai}`, 14, 32);

  // Prepare table data
  const tableData = devices.map((device) => [
    device.jenisDevice,
    device.merek,
    device.model,
    device.serialNumber,
    device.kondisi,
    device.pengguna,
    device.divisi,
    device.lokasi,
    `Rp ${device.nilaiAset.toLocaleString("id-ID")}`,
  ]);

  // Add table
  autoTable(doc, {
    head: [
      [
        "Jenis Device",
        "Merek",
        "Model",
        "Serial Number",
        "Kondisi",
        "Pengguna",
        "Divisi",
        "Lokasi",
        "Nilai Aset",
      ],
    ],
    body: tableData,
    startY: 37,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 22 },
      2: { cellWidth: 28 },
      3: { cellWidth: 28 },
      4: { cellWidth: 25 },
      5: { cellWidth: 28 },
      6: { cellWidth: 25 },
      7: { cellWidth: 30 },
      8: { cellWidth: 25 },
    },
  });

  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }

  // Save the PDF
  doc.save(`Laporan_Inventaris_${new Date().toISOString().split("T")[0]}.pdf`);
}

export function exportDeviceDetailToPDF(device: Device): void {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text("Detail Perangkat", 14, 15);

  doc.setFontSize(10);
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`, 14, 22);

  // Device details
  const details = [
    ["Jenis Device", device.jenisDevice],
    ["Merek", device.merek],
    ["Model", device.model],
    ["Serial Number", device.serialNumber],
    ["Kondisi", device.kondisi],
    ["Pengguna", device.pengguna],
    ["Divisi", device.divisi],
    ["Lokasi", device.lokasi],
    ["Spesifikasi", device.spesifikasi],
    ["Tanggal Pembelian", new Date(device.tanggalPembelian).toLocaleDateString("id-ID")],
    ["Nilai Aset", `Rp ${device.nilaiAset.toLocaleString("id-ID")}`],
    ["Catatan", device.catatan],
    ["Tanggal Dibuat", new Date(device.tanggalDibuat).toLocaleDateString("id-ID")],
    ["Terakhir Diupdate", new Date(device.tanggalDiupdate).toLocaleDateString("id-ID")],
  ];

  autoTable(doc, {
    body: details,
    startY: 28,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: "bold", fillColor: [240, 240, 240] },
      1: { cellWidth: 130 },
    },
  });

  // Save the PDF
  doc.save(`Detail_${device.serialNumber}_${new Date().toISOString().split("T")[0]}.pdf`);
}
