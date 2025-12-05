# Component Reference Guide

## UI Components (components/ui/)

### Button
Professional button component with multiple variants and sizes.

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"

**Usage:**
```tsx
<Button variant="default" size="default">Click Me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>
```

### Card
Container component for grouped content.

**Components:**
- `Card` - Main container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content area
- `CardFooter` - Footer section

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Input
Text input field with consistent styling.

**Props:**
- Standard HTML input props
- `type`: "text" | "email" | "password" | "number" | "date" | etc.

**Usage:**
```tsx
<Input
  type="text"
  placeholder="Enter text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### Label
Label component for form fields.

**Usage:**
```tsx
<Label htmlFor="field-id">Field Name</Label>
<Input id="field-id" />
```

### Select
Dropdown select component.

**Usage:**
```tsx
<Select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>
```

### Table
Complete table component set.

**Components:**
- `Table` - Main table wrapper
- `TableHeader` - Table header
- `TableBody` - Table body
- `TableFooter` - Table footer
- `TableRow` - Table row
- `TableHead` - Header cell
- `TableCell` - Body cell
- `TableCaption` - Caption

**Usage:**
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Badge
Status badge with color variants.

**Props:**
- `variant`: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "gray"

**Usage:**
```tsx
<Badge variant="success">Baik</Badge>
<Badge variant="destructive">Rusak</Badge>
<Badge variant="warning">Dalam Perbaikan</Badge>
<Badge variant="gray">Tidak Terpakai</Badge>
```

### Dialog
Modal dialog component.

**Components:**
- `Dialog` - Main dialog wrapper
- `DialogContent` - Content container
- `DialogHeader` - Header section
- `DialogTitle` - Title
- `DialogDescription` - Description
- `DialogFooter` - Footer section

**Usage:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    <div>Content here</div>
    <DialogFooter>
      <Button onClick={() => setIsOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Feature Components

### DeviceForm
Form component for adding and editing devices.

**Location:** `components/DeviceForm.tsx`

**Props:**
```typescript
interface DeviceFormProps {
  device?: Device          // Optional: for edit mode
  onSubmit: (data: Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">) => void
  onCancel: () => void
}
```

**Features:**
- All device fields
- Form validation
- Error display
- Support add and edit modes
- Required field indicators

**Usage:**
```tsx
// Add mode
<DeviceForm
  onSubmit={handleAddDevice}
  onCancel={() => setDialogOpen(false)}
/>

// Edit mode
<DeviceForm
  device={selectedDevice}
  onSubmit={handleUpdateDevice}
  onCancel={() => setDialogOpen(false)}
/>
```

### DeviceDetail
Detailed device view component.

**Location:** `components/DeviceDetail.tsx`

**Props:**
```typescript
interface DeviceDetailProps {
  device: Device
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}
```

**Features:**
- Display all device information
- Formatted dates and currency
- Color-coded condition badge
- Action buttons (Edit, Delete, Export PDF, Close)
- Professional layout

**Usage:**
```tsx
<DeviceDetail
  device={selectedDevice}
  onEdit={() => openEditDialog(selectedDevice)}
  onDelete={() => openDeleteDialog(selectedDevice)}
  onClose={() => setDialogOpen(false)}
/>
```

## Utility Functions

### cn() - Class Name Utility
Merge Tailwind classes efficiently.

**Location:** `lib/utils.ts`

**Usage:**
```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-class", condition && "conditional-class")} />
```

## Storage Functions

### getAllDevices()
Get all devices from local storage.

**Returns:** `Device[]`

### getDeviceById(id: string)
Get single device by ID.

**Returns:** `Device | null`

### addDevice(device)
Add new device.

**Params:** `Omit<Device, "id" | "tanggalDibuat" | "tanggalDiupdate">`
**Returns:** `Device`

### updateDevice(id: string, updates)
Update existing device.

**Params:** `id: string`, `updates: Partial<Device>`
**Returns:** `Device`

### deleteDevice(id: string)
Delete device.

**Returns:** `boolean`

### searchDevices(query: string)
Search devices by query.

**Returns:** `Device[]`

### filterDevices(filters)
Filter devices.

**Params:** `{ kondisi?, divisi?, jenisDevice? }`
**Returns:** `Device[]`

### getUniqueValues(field)
Get unique values for a field.

**Returns:** `string[]`

## PDF Export Functions

### exportDevicesToPDF(devices)
Export device list to PDF.

**Location:** `lib/pdf-export.ts`

**Usage:**
```tsx
import { exportDevicesToPDF } from "@/lib/pdf-export"

exportDevicesToPDF(devices)
```

### exportDeviceDetailToPDF(device)
Export single device detail to PDF.

**Usage:**
```tsx
import { exportDeviceDetailToPDF } from "@/lib/pdf-export"

exportDeviceDetailToPDF(device)
```

## Type Definitions

### Device Interface
```typescript
interface Device {
  id: string
  jenisDevice: string
  merek: string
  model: string
  serialNumber: string
  kondisi: DeviceKondisi
  pengguna: string
  divisi: string
  spesifikasi: string
  tanggalPembelian: string
  nilaiAset: number
  lokasi: string
  catatan: string
  tanggalDibuat: string
  tanggalDiupdate: string
}
```

### DeviceKondisi Type
```typescript
type DeviceKondisi = "Baik" | "Rusak" | "Dalam Perbaikan" | "Tidak Terpakai"
```

### DeviceFilters Interface
```typescript
interface DeviceFilters {
  kondisi?: string
  divisi?: string
  jenisDevice?: string
}
```

## Icons (Lucide React)

Commonly used icons:
- `Plus` - Add action
- `Edit` - Edit action
- `Trash2` - Delete action
- `Eye` - View details
- `Search` - Search functionality
- `FileDown` - Download/Export
- `Package` - Total devices
- `CheckCircle` - Good condition
- `XCircle` - Broken
- `Tool` - Under repair
- `Archive` - Not in use

**Usage:**
```tsx
import { Plus, Edit, Trash2 } from "lucide-react"

<Plus className="w-4 h-4" />
```

## Styling with Tailwind

Common utility classes used:
- Spacing: `p-4`, `m-2`, `gap-4`, `space-y-2`
- Sizing: `w-full`, `h-10`, `max-w-7xl`
- Flex: `flex`, `items-center`, `justify-between`
- Grid: `grid`, `grid-cols-2`, `gap-4`
- Colors: `bg-background`, `text-foreground`, `text-muted-foreground`
- Borders: `border`, `rounded-md`, `rounded-lg`
- Typography: `text-sm`, `text-lg`, `font-bold`, `font-medium`

## Responsive Breakpoints

- `sm:` - 640px and up (Small tablets)
- `md:` - 768px and up (Tablets)
- `lg:` - 1024px and up (Laptops)
- `xl:` - 1280px and up (Desktops)
- `2xl:` - 1536px and up (Large desktops)

**Example:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## Theme Variables

CSS variables defined in `app/globals.css`:

- `--background` - Page background
- `--foreground` - Main text color
- `--card` - Card background
- `--primary` - Primary brand color
- `--destructive` - Danger/delete color
- `--muted` - Muted elements
- `--border` - Border color
- `--ring` - Focus ring color

**Usage:**
```tsx
className="bg-background text-foreground border-border"
```
