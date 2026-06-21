-- ==============================================
-- Migration: Add custom_category support
-- ==============================================
-- Run this ONCE in Supabase SQL Editor if your database
-- already exists (i.e. you ran schema.sql before this update).
-- Safe to run multiple times — IF NOT EXISTS guards it.
-- ==============================================

ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS custom_category TEXT;

-- ==============================================
-- Done. Existing transactions are unaffected —
-- custom_category will simply be NULL for them.
-- ==============================================
