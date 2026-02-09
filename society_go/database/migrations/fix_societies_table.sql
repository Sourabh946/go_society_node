-- Fix society table by adding missing columns
-- Run this SQL directly in your MySQL database

-- First, update existing columns to match the model
ALTER TABLE society 
MODIFY COLUMN name VARCHAR(100) NOT NULL,
MODIFY COLUMN address VARCHAR(255) NOT NULL;

-- Add missing columns
ALTER TABLE society 
ADD COLUMN city VARCHAR(100) NOT NULL DEFAULT '' AFTER address,
ADD COLUMN state VARCHAR(100) NOT NULL DEFAULT '' AFTER city,
ADD COLUMN pin_code INT NOT NULL DEFAULT 0 AFTER state,
ADD COLUMN total_blocks INT NOT NULL DEFAULT 0 AFTER pin_code,
ADD COLUMN total_flats INT NOT NULL DEFAULT 0 AFTER total_blocks,
ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'active' AFTER total_flats;
