-- =====================================================
-- Parent Additional Emails Feature
-- Allows admins to assign additional email addresses for parents
-- Part of The Goddard School Enrollment Management System
-- =====================================================

-- =====================================================
-- 1. PARENT ADDITIONAL EMAILS TABLE
-- =====================================================
-- Stores additional email addresses for parents that admins can manage

DROP TABLE IF EXISTS parent_additional_emails CASCADE;
CREATE TABLE parent_additional_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) NOT NULL,
    parent_id UUID REFERENCES users(id) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    email_type VARCHAR(50) DEFAULT 'additional', -- 'additional', 'emergency', 'work', 'backup'
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    added_by UUID REFERENCES users(id), -- Admin who added this email
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email_format CHECK (email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT unique_school_parent_email UNIQUE(school_id, parent_id, email_address)
);

-- Indexes for performance
CREATE INDEX idx_parent_additional_emails_school_id ON parent_additional_emails(school_id);
CREATE INDEX idx_parent_additional_emails_parent_id ON parent_additional_emails(parent_id);
CREATE INDEX idx_parent_additional_emails_email ON parent_additional_emails(email_address);
CREATE INDEX idx_parent_additional_emails_active ON parent_additional_emails(school_id, is_active);

-- =====================================================
-- 2. ROW LEVEL SECURITY POLICIES
-- =====================================================
-- Ensure multi-tenant isolation for additional emails

-- Enable RLS
ALTER TABLE parent_additional_emails ENABLE ROW LEVEL SECURITY;

-- School isolation policy
CREATE POLICY parent_additional_emails_school_isolation ON parent_additional_emails
    FOR ALL
    USING (school_id = (current_setting('app.current_school_id'))::uuid);

-- Parent access policy (parents can view their own additional emails)
CREATE POLICY parent_additional_emails_parent_access ON parent_additional_emails
    FOR SELECT
    TO authenticated
    USING (
        parent_id = auth.uid() 
        AND school_id = (current_setting('app.current_school_id'))::uuid
    );

-- Admin management policy (admins can manage all additional emails in their school)
CREATE POLICY parent_additional_emails_admin_management ON parent_additional_emails
    FOR ALL
    TO authenticated
    USING (
        school_id = (current_setting('app.current_school_id'))::uuid
        AND EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.school_id = parent_additional_emails.school_id
            AND u.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- 3. HELPER FUNCTIONS
-- =====================================================

-- Function to add an additional email for a parent
CREATE OR REPLACE FUNCTION add_parent_additional_email(
    p_parent_id UUID,
    p_email_address VARCHAR(255),
    p_email_type VARCHAR(50) DEFAULT 'additional',
    p_notes TEXT DEFAULT NULL,
    p_added_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_school_id UUID;
    v_email_id UUID;
BEGIN
    -- Get the school_id from the parent
    SELECT school_id INTO v_school_id
    FROM users 
    WHERE id = p_parent_id AND role = 'parent';
    
    IF v_school_id IS NULL THEN
        RAISE EXCEPTION 'Parent not found or invalid parent ID';
    END IF;
    
    -- Insert the additional email
    INSERT INTO parent_additional_emails (
        school_id,
        parent_id,
        email_address,
        email_type,
        notes,
        added_by
    ) VALUES (
        v_school_id,
        p_parent_id,
        LOWER(TRIM(p_email_address)),
        p_email_type,
        p_notes,
        COALESCE(p_added_by, auth.uid())
    ) RETURNING id INTO v_email_id;
    
    RETURN v_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all email addresses for a parent (primary + additional)
CREATE OR REPLACE FUNCTION get_parent_all_emails(p_parent_id UUID)
RETURNS TABLE (
    email_id UUID,
    email_address VARCHAR(255),
    email_type VARCHAR(50),
    is_primary BOOLEAN,
    is_verified BOOLEAN,
    is_active BOOLEAN,
    added_by UUID,
    added_by_name TEXT,
    notes TEXT,
    created_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    -- Primary email from users table
    SELECT 
        u.id as email_id,
        u.email as email_address,
        'primary'::VARCHAR(50) as email_type,
        true as is_primary,
        true as is_verified, -- Assuming primary email is always verified
        true as is_active,
        NULL::UUID as added_by,
        NULL::TEXT as added_by_name,
        NULL::TEXT as notes,
        u.created_at
    FROM users u
    WHERE u.id = p_parent_id AND u.role = 'parent'
    
    UNION ALL
    
    -- Additional emails
    SELECT 
        pae.id as email_id,
        pae.email_address,
        pae.email_type,
        false as is_primary,
        pae.is_verified,
        pae.is_active,
        pae.added_by,
        admin_user.email as added_by_name,
        pae.notes,
        pae.created_at
    FROM parent_additional_emails pae
    LEFT JOIN users admin_user ON pae.added_by = admin_user.id
    WHERE pae.parent_id = p_parent_id 
    AND pae.is_active = true
    
    ORDER BY is_primary DESC, created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all active email addresses for notifications
CREATE OR REPLACE FUNCTION get_parent_notification_emails(p_parent_id UUID)
RETURNS TABLE (email_address VARCHAR(255)) AS $$
BEGIN
    RETURN QUERY
    -- Primary email
    SELECT u.email
    FROM users u
    WHERE u.id = p_parent_id AND u.role = 'parent'
    
    UNION
    
    -- Additional active emails
    SELECT pae.email_address
    FROM parent_additional_emails pae
    WHERE pae.parent_id = p_parent_id 
    AND pae.is_active = true 
    AND pae.is_verified = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update additional email status
CREATE OR REPLACE FUNCTION update_additional_email_status(
    p_email_id UUID,
    p_is_active BOOLEAN DEFAULT NULL,
    p_is_verified BOOLEAN DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_updated_count INTEGER;
BEGIN
    UPDATE parent_additional_emails 
    SET 
        is_active = COALESCE(p_is_active, is_active),
        is_verified = COALESCE(p_is_verified, is_verified),
        notes = COALESCE(p_notes, notes),
        updated_at = NOW()
    WHERE id = p_email_id
    AND school_id = (current_setting('app.current_school_id'))::uuid;
    
    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    
    RETURN v_updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove additional email
CREATE OR REPLACE FUNCTION remove_additional_email(p_email_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    -- Soft delete by setting is_active = false
    UPDATE parent_additional_emails 
    SET 
        is_active = false,
        updated_at = NOW()
    WHERE id = p_email_id
    AND school_id = (current_setting('app.current_school_id'))::uuid;
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    RETURN v_deleted_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. TRIGGERS FOR AUDIT AND MAINTENANCE
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_parent_additional_emails_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_parent_additional_emails_timestamp
    BEFORE UPDATE ON parent_additional_emails
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_additional_emails_timestamp();

-- =====================================================
-- 5. ADMIN DASHBOARD QUERIES
-- =====================================================

-- Get summary of additional emails per school
/*
SELECT 
    s.name as school_name,
    COUNT(pae.id) as total_additional_emails,
    COUNT(CASE WHEN pae.is_active THEN 1 END) as active_emails,
    COUNT(CASE WHEN pae.is_verified THEN 1 END) as verified_emails,
    COUNT(DISTINCT pae.parent_id) as parents_with_additional_emails
FROM schools s
LEFT JOIN parent_additional_emails pae ON s.id = pae.school_id
WHERE s.id = current_setting('app.current_school_id')::uuid
GROUP BY s.id, s.name;
*/

-- Get parents with additional emails for admin dashboard
/*
SELECT 
    u.email as primary_email,
    u.first_name || ' ' || u.last_name as parent_name,
    COUNT(pae.id) as additional_email_count,
    COUNT(CASE WHEN pae.is_active THEN 1 END) as active_additional_emails,
    MAX(pae.created_at) as latest_addition
FROM users u
JOIN parent_additional_emails pae ON u.id = pae.parent_id
WHERE u.school_id = current_setting('app.current_school_id')::uuid
AND u.role = 'parent'
GROUP BY u.id, u.email, u.first_name, u.last_name
ORDER BY parent_name;
*/

-- Get notification email distribution for a specific enrollment/child
/*
SELECT 
    c.first_name || ' ' || c.last_name as child_name,
    u.email as primary_email,
    array_agg(pae.email_address) FILTER (WHERE pae.is_active AND pae.is_verified) as additional_emails
FROM children c
JOIN users u ON c.parent_id = u.id
LEFT JOIN parent_additional_emails pae ON u.id = pae.parent_id
WHERE c.school_id = current_setting('app.current_school_id')::uuid
AND c.id = 'specific-child-id'
GROUP BY c.id, c.first_name, c.last_name, u.email;
*/

-- =====================================================
-- 6. SAMPLE DATA FOR TESTING
-- =====================================================
-- Note: This would be populated in development/testing environments

/*
-- Assuming we have test users and schools
INSERT INTO parent_additional_emails (school_id, parent_id, email_address, email_type, notes, added_by) VALUES
-- Example data (replace with actual UUIDs)
('school-uuid-1', 'parent-uuid-1', 'backup@example.com', 'backup', 'Backup email for emergencies', 'admin-uuid-1'),
('school-uuid-1', 'parent-uuid-1', 'work@example.com', 'work', 'Work email address', 'admin-uuid-1'),
('school-uuid-1', 'parent-uuid-2', 'grandmother@example.com', 'emergency', 'Emergency contact - grandmother', 'admin-uuid-1');
*/

-- =====================================================
-- 7. INTEGRATION WITH NOTIFICATION SYSTEM
-- =====================================================

-- Enhanced notification function that uses all parent emails
CREATE OR REPLACE FUNCTION get_enrollment_notification_emails(p_enrollment_id UUID)
RETURNS TABLE (email_address VARCHAR(255), email_type VARCHAR(50)) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        notification_emails.email_address,
        CASE 
            WHEN notification_emails.email_address = u.email THEN 'primary'
            ELSE pae.email_type
        END as email_type
    FROM enrollments e
    JOIN users u ON e.parent_id = u.id
    CROSS JOIN LATERAL (
        -- Get all notification emails for this parent
        SELECT email_address FROM get_parent_notification_emails(u.id)
    ) AS notification_emails
    LEFT JOIN parent_additional_emails pae ON pae.parent_id = u.id 
        AND pae.email_address = notification_emails.email_address
    WHERE e.id = p_enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;