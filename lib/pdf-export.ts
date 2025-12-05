import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Device } from "./types";

export function exportDevicesToPDF(devices: Device[]): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = margin;

  // Add title and header on first page
  doc.setFontSize(18);
  doc.text("Laporan Inventaris Perangkat Kantor", margin, currentY);
  currentY += 7;

  doc.setFontSize(11);
  doc.text("Device Monitoring System", margin, currentY);
  currentY += 5;

  doc.setFontSize(9);
  doc.text(`Tanggal Export: ${new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, margin, currentY);
  currentY += 5;

  // Summary statistics
  const totalDevices = devices.length;
  const devicesBaik = devices.filter(d => d.kondisi === "Baik").length;
  const devicesRusak = devices.filter(d => d.kondisi === "Rusak").length;
  const devicesDalamPerbaikan = devices.filter(d => d.kondisi === "Dalam Perbaikan").length;
  const devicesTidakTerpakai = devices.filter(d => d.kondisi === "Tidak Terpakai").length;

  doc.setFontSize(9);
  doc.text(`Total: ${totalDevices} | Baik: ${devicesBaik} | Rusak: ${devicesRusak} | Perbaikan: ${devicesDalamPerbaikan} | Tidak Terpakai: ${devicesTidakTerpakai}`, margin, currentY);
  currentY += 10;

  // Device catalog with images
  devices.forEach((device, index) => {
    const itemHeight = device.gambar ? 85 : 50;

    // Check if we need a new page
    if (currentY + itemHeight > pageHeight - 20) {
      doc.addPage();
      currentY = margin;
    }

    // Draw border around device item
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, currentY, pageWidth - (margin * 2), itemHeight);

    let itemY = currentY + 5;

    // Device header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`${device.merk} ${device.type}`, margin + 5, itemY);
    itemY += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Kode: ${device.kodeId} | S/N: ${device.snRegModel}`, margin + 5, itemY);
    itemY += 6;

    // Image if exists
    if (device.gambar) {
      try {
        const imgWidth = 50;
        const imgHeight = 40;
        const imgX = margin + 5;
        doc.addImage(device.gambar, "JPEG", imgX, itemY, imgWidth, imgHeight);

        // Device details next to image
        let detailX = imgX + imgWidth + 10;
        let detailY = itemY;

        doc.setFontSize(8);
        doc.text(`Jenis: ${device.jenisBarang}`, detailX, detailY);
        detailY += 5;
        doc.text(`Devisi: ${device.devisi}`, detailX, detailY);
        detailY += 5;
        doc.text(`Sub Devisi: ${device.subDevisi || "-"}`, detailX, detailY);
        detailY += 5;
        doc.text(`Lokasi: ${device.lokasi}`, detailX, detailY);
        detailY += 5;
        doc.text(`Status: ${device.status}`, detailX, detailY);
        detailY += 5;
        doc.text(`Kondisi: ${device.kondisi}`, detailX, detailY);
        detailY += 5;
        doc.text(`Garansi: ${device.garansi} bln (s/d ${new Date(device.garansiSampai).toLocaleDateString("id-ID")})`, detailX, detailY);
      } catch (error) {
        console.error("Error adding image to PDF:", error);
        // Show details without image if image fails
        showDeviceDetailsNoImage();
      }
    } else {
      // Show details without image
      showDeviceDetailsNoImage();
    }

    function showDeviceDetailsNoImage() {
      doc.setFontSize(8);
      doc.text(`Jenis: ${device.jenisBarang} | Devisi: ${device.devisi} | Sub Devisi: ${device.subDevisi || "-"}`, margin + 5, itemY);
      itemY += 5;
      doc.text(`Lokasi: ${device.lokasi}`, margin + 5, itemY);
      itemY += 5;
      doc.text(`Status: ${device.status} | Kondisi: ${device.kondisi}`, margin + 5, itemY);
      itemY += 5;
      doc.text(`Garansi: ${device.garansi} bulan (sampai ${new Date(device.garansiSampai).toLocaleDateString("id-ID")})`, margin + 5, itemY);
    }

    currentY += itemHeight + 5;
  });

  // Add footer to all pages
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      pageWidth - margin,
      pageHeight - 10,
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

  let currentY = 28;

  // Add image if exists
  if (device.gambar) {
    try {
      const imgWidth = 80;
      const imgHeight = 60;
      const imgX = (doc.internal.pageSize.getWidth() - imgWidth) / 2; // Center the image

      doc.addImage(device.gambar, "JPEG", imgX, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10; // Add spacing after image
    } catch (error) {
      console.error("Error adding image to PDF:", error);
      // Continue with PDF generation even if image fails
    }
  }

  // Device details
  const details = [
    ["Kode ID", device.kodeId],
    ["Jenis Barang", device.jenisBarang],
    ["Merk", device.merk],
    ["Type", device.type],
    ["SN / Reg Model", device.snRegModel],
    ["Tanggal Beli", new Date(device.tanggalBeli).toLocaleDateString("id-ID")],
    ["Garansi", `${device.garansi} bulan`],
    ["Garansi Sampai", new Date(device.garansiSampai).toLocaleDateString("id-ID")],
    ["Lokasi", device.lokasi],
    ["Devisi", device.devisi],
    ["Sub Devisi / Pengguna", device.subDevisi],
    ["Spesifikasi", device.spesifikasi],
    ["Status", device.status],
    ["Kondisi", device.kondisi],
    ["Akun Terhubung", device.akunTerhubung],
    ["Keterangan", device.keterangan],
    ["Tanggal Dibuat", new Date(device.tanggalDibuat).toLocaleDateString("id-ID")],
    ["Terakhir Diupdate", new Date(device.tanggalDiupdate).toLocaleDateString("id-ID")],
  ];

  autoTable(doc, {
    body: details,
    startY: currentY,
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
  doc.save(`Detail_${device.snRegModel}_${new Date().toISOString().split("T")[0]}.pdf`);
}

// Export devices to CSV
export function exportDevicesToCSV(devices: Device[]): void {
  // Define CSV headers
  const headers = [
    "Kode ID",
    "Jenis Barang",
    "Merk",
    "Type",
    "SN/Reg Model",
    "Tanggal Beli",
    "Garansi (bulan)",
    "Garansi Sampai",
    "Lokasi",
    "Devisi",
    "Sub Devisi",
    "Spesifikasi",
    "Status",
    "Kondisi",
    "Akun Terhubung",
    "Keterangan",
    "Tanggal Dibuat",
    "Tanggal Diupdate"
  ];

  // Convert devices to CSV rows
  const rows = devices.map(device => [
    device.kodeId,
    device.jenisBarang,
    device.merk,
    device.type,
    device.snRegModel,
    new Date(device.tanggalBeli).toLocaleDateString("id-ID"),
    device.garansi.toString(),
    new Date(device.garansiSampai).toLocaleDateString("id-ID"),
    device.lokasi,
    device.devisi,
    device.subDevisi || "-",
    device.spesifikasi || "-",
    device.status,
    device.kondisi,
    device.akunTerhubung || "-",
    device.keterangan || "-",
    new Date(device.tanggalDibuat).toLocaleDateString("id-ID"),
    new Date(device.tanggalDiupdate).toLocaleDateString("id-ID")
  ]);

  // Escape CSV values (handle commas, quotes, newlines)
  const escapeCSV = (value: string): string => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Build CSV content
  const csvContent = [
    headers.map(escapeCSV).join(","),
    ...rows.map(row => row.map(escapeCSV).join(","))
  ].join("\n");

  // Add BOM for UTF-8 support in Excel
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `Laporan_Inventaris_${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
