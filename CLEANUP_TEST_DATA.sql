-- ===================================================================
-- CLEANUP: REMOVE ALL TEST DATA FROM DATABASE
-- ===================================================================
-- Purpose: Restore database to clean state with no test/mock data
-- Run this in Supabase SQL Editor to clear all inserted data
-- Schema remains intact for real data entry

-- Disable foreign key constraints temporarily
SET session_replication role = replica;

-- ===================================================================
-- DELETE ALL TEST DATA (in correct order to handle foreign keys)
-- ===================================================================

-- 1. Delete notifications
DELETE FROM notifications;

-- 2. Delete audit logs
DELETE FROM audit_logs;

-- 3. Delete session tokens
DELETE FROM session_tokens;

-- 4. Delete reports
DELETE FROM reports;

-- 5. Delete health records
DELETE FROM health_records;

-- 6. Delete student visits
DELETE FROM student_visits;

-- 7. Delete students
DELETE FROM students;

-- 8. Delete medical officers
DELETE FROM medical_officers;

-- 9. Delete admins
DELETE FROM admins;

-- Re-enable constraints
SET session_replication role = DEFAULT;

-- ===================================================================
-- VERIFY CLEANUP
-- ===================================================================
SELECT 'Admins cleaned: ' || COUNT(*) FROM admins;
SELECT 'Medical Officers cleaned: ' || COUNT(*) FROM medical_officers;
SELECT 'Students cleaned: ' || COUNT(*) FROM students;
SELECT 'Health Records cleaned: ' || COUNT(*) FROM health_records;
SELECT 'Notifications cleaned: ' || COUNT(*) FROM notifications;

-- ===================================================================
-- NEXT STEPS
-- ===================================================================
-- 1. Create real Admin account in Supabase console
-- 2. Login with real credentials
-- 3. Register Medical Officers through Admin panel
-- 4. Register Students and add Health Records through Medical Officer panel
-- 5. Data will now be REAL and not test/mock data
