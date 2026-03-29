-- =====================================================================
-- TEST DATA INSERTION - Run this in Supabase SQL Editor
-- =====================================================================

-- =====================================================================
-- 1. INSERT TEST ADMIN USER
-- =====================================================================
INSERT INTO admins (
  email, 
    password_hash, 
      first_name, 
        last_name, 
          designation
          )
          VALUES (
            'rajeshpulluri333@gmail.com',
              '$2a$10$nrKu62UzdywhQqEm/MzIveTbCqiE0M2pxKkbYjqpedO.fvZ2KywGO',
                'Rajesh',
                  'Pulluri',
                    'DMHO'
                    )
                    ON CONFLICT (email) DO NOTHING;

                    -- =====================================================================
                    -- 2. INSERT TEST MEDICAL OFFICER
                    -- =====================================================================
                    INSERT INTO medical_officers (
                      email,
                        password_hash,
                          first_name,
                            last_name,
                              license_number,
                                specialization,
                                  phc_code,
                                    phc_name,
                                      phone,
                                        is_active
                                        )
                                        VALUES (
                                          'doctor@example.com',
                                            '$2a$10$jSkhkjNMBZIhJwoWJzO20O9Rr4SwONrGxfIDj6da.yp4saE64deUO',
                                              'Dr.',
                                                'Smith',
                                                  'LIC123456',
                                                    'General Practitioner',
                                                      'PHC-001',
                                                        'Primary Health Center 001',
                                                          '9876543210',
                                                            true
                                                            )
                                                            ON CONFLICT (email) DO NOTHING;

                                                            -- =====================================================================
                                                            -- 3. INSERT TEST STUDENT 
                                                            -- =====================================================================
                                                            INSERT INTO students (
                                                              unique_student_id,
                                                                first_name,
                                                                  last_name,
                                                                    email,
                                                                      phone,
                                                                        date_of_birth,
                                                                          school_code,
                                                                            phc_code,
                                                                              state_code,
                                                                                district_code,
                                                                                  parent_name,
                                                                                    parent_phone,
                                                                                      is_active
                                                                                      )
                                                                                      VALUES (
                                                                                        'TG-01-1968-0001',
                                                                                          'John',
                                                                                            'Doe',
                                                                                              'john.doe@example.com',
                                                                                                '9876543211',
                                                                                                  '2010-05-15',
                                                                                                    '1968',
                                                                                                      'PHC-001',
                                                                                                        'TG',
                                                                                                          '01',
                                                                                                            'Jane Doe',
                                                                                                              '9876543212',
                                                                                                                true
                                                                                                                )
                                                                                                                ON CONFLICT (unique_student_id) DO NOTHING;

                                                                                                                -- =====================================================================
                                                                                                                -- 4. INSERT SAMPLE HEALTH RECORDS FOR STUDENT
                                                                                                                -- =====================================================================
                                                                                                                INSERT INTO health_records (
                                                                                                                  student_id,
                                                                                                                    medical_officer_id,
                                                                                                                      consultation_type,
                                                                                                                        consultation_date,
                                                                                                                          symptoms,
                                                                                                                            diagnosis,
                                                                                                                              prescription,
                                                                                                                                notes
                                                                                                                                )
                                                                                                                                SELECT 
                                                                                                                                  s.id,
                                                                                                                                    m.id,
                                                                                                                                      'Regular Checkup',
                                                                                                                                        NOW() - INTERVAL '7 days',
                                                                                                                                          'No symptoms, routine checkup',
                                                                                                                                            'Healthy',
                                                                                                                                              'Continue routine diet and exercise',
                                                                                                                                                'Student is in good health condition'
                                                                                                                                                FROM students s
                                                                                                                                                CROSS JOIN medical_officers m
                                                                                                                                                WHERE s.unique_student_id = 'TG-01-1968-0001'
                                                                                                                                                AND m.email = 'doctor@example.com'
                                                                                                                                                ON CONFLICT DO NOTHING;

                                                                                                                                                -- =====================================================================
                                                                                                                                                -- 5. INSERT SAMPLE NOTIFICATION FOR STUDENT
                                                                                                                                                -- =====================================================================
                                                                                                                                                INSERT INTO notifications (
                                                                                                                                                  recipient_id,
                                                                                                                                                    recipient_type,
                                                                                                                                                      title,
                                                                                                                                                        message,
                                                                                                                                                          notification_type
                                                                                                                                                          )
                                                                                                                                                          SELECT 
                                                                                                                                                            s.id,
                                                                                                                                                              'student',
                                                                                                                                                                'Health Checkup Completed',
                                                                                                                                                                  'Your annual health checkup has been completed. All vitals are normal.',
                                                                                                                                                                    'health_record'
                                                                                                                                                                    FROM students s
                                                                                                                                                                    WHERE s.unique_student_id = 'TG-01-1968-0001'
                                                                                                                                                                    ON CONFLICT DO NOTHING;

                                                                                                                                                                    -- =====================================================================
                                                                                                                                                                    -- VERIFICATION QUERIES
                                                                                                                                                                    -- =====================================================================
                                                                                                                                                                    -- Check admins
                                                                                                                                                                    SELECT COUNT(*) as admin_count, 
                                                                                                                                                                           STRING_AGG(email, ', ') as admin_emails
                                                                                                                                                                           FROM admins;

                                                                                                                                                                           -- Check medical officers
                                                                                                                                                                           SELECT COUNT(*) as medical_officer_count,
                                                                                                                                                                                  STRING_AGG(email, ', ') as mo_emails
                                                                                                                                                                                  FROM medical_officers;

                                                                                                                                                                                  -- Check students
                                                                                                                                                                                  SELECT COUNT(*) as student_count,
                                                                                                                                                                                         STRING_AGG(unique_student_id, ', ') as student_ids
                                                                                                                                                                                         FROM students;

                                                                                                                                                                                         -- Check health records
                                                                                                                                                                                         SELECT COUNT(*) as health_record_count
                                                                                                                                                                                         FROM health_records;

                                                                                                                                                                                         -- Check notifications
                                                                                                                                                                                         SELECT COUNT(*) as notification_count
                                                                                                                                                                                         FROM notifications;

                                                                                                                                                                                         -- =====================================================================
                                                                                                                                                                                         -- SUCCESS MESSAGE
                                                                                                                                                                                         -- =====================================================================
                                                                                                                                                                                         -- If you see all the verification queries returning non-zero counts,
                                                                                                                                                                                         -- all test data has been successfully created!
                                                                                                                                                                                         --
                                                                                                                                                                                         -- TEST CREDENTIALS:
                                                                                                                                                                                         -- Admin:
                                                                                                                                                                                         --   Email: rajeshpulluri333@gmail.com
                                                                                                                                                                                         --   Password: admin123
                                                                                                                                                                                         --
                                                                                                                                                                                         -- Medical Officer:
                                                                                                                                                                                         --   Email: doctor@example.com
                                                                                                                                                                                         --   Password: doctor123
                                                                                                                                                                                         --
                                                                                                                                                                                         -- Student:
                                                                                                                                                                                         --   Health ID: TG-01-1968-0001
                                                                                                                                                                                         --   (No password needed)
                                                                                                                                                                                         