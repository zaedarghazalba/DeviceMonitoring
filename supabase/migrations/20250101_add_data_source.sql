-- Add data_source column to devices table
-- This column will store whether the device belongs to 'Akselera' or 'Eduprima'

-- Create enum type for data source
CREATE TYPE data_source_type AS ENUM ('Akselera', 'Eduprima');

-- Add data_source column to devices table
ALTER TABLE devices
ADD COLUMN data_source data_source_type DEFAULT 'Akselera' NOT NULL;

-- Create index for better query performance when filtering by data source
CREATE INDEX IF NOT EXISTS idx_devices_data_source ON devices(data_source);

-- Update RLS policies to include data_source awareness (optional, if needed)
-- The existing policies already allow authenticated users to read/write all data
-- If you want to restrict access based on data_source, you can modify the policies here

-- Example: Allow users to see devices from both sources
-- The existing policies are already sufficient, but we're adding a comment for clarity
COMMENT ON COLUMN devices.data_source IS 'Source of the device data: either Akselera or Eduprima';
