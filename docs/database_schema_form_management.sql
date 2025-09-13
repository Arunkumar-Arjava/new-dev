-- =====================================================
-- Form Management Database Schema for Goddard School
-- Multi-tenant enrollment system with Fillout integration
-- =====================================================

-- =====================================================
-- 1. ENHANCED FORM TEMPLATES TABLE
-- =====================================================
-- Manages all forms at school level with state management

DROP TABLE IF EXISTS form_templates CASCADE;
CREATE TABLE form_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) NOT NULL,
    form_name VARCHAR(255) NOT NULL,
    form_description TEXT,
    form_type VARCHAR(50), -- 'admission', 'medical', 'emergency', 'authorization', etc.
    fillout_form_id VARCHAR(255) NOT NULL,
    fillout_form_url TEXT NOT NULL,
    status VARCHAR(20) NOT NULL 
        CHECK (status IN ('active', 'school_default', 'draft', 'archive')),
    is_required BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_school_fillout_form UNIQUE(school_id, fillout_form_id),
    CONSTRAINT unique_school_form_name UNIQUE(school_id, form_name)
);

-- Indexes for performance
CREATE INDEX idx_form_templates_school_id ON form_templates(school_id);
CREATE INDEX idx_form_templates_status ON form_templates(school_id, status);
CREATE INDEX idx_form_templates_type ON form_templates(school_id, form_type);

-- =====================================================
-- 2. CLASS FORM OVERRIDES TABLE
-- =====================================================
-- Manages class-level form assignments (include/exclude from school defaults)

DROP TABLE IF EXISTS class_form_overrides CASCADE;
CREATE TABLE class_form_overrides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) NOT NULL,
    classroom_id UUID REFERENCES classrooms(id) NOT NULL,
    form_template_id UUID REFERENCES form_templates(id) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('include', 'exclude')),
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_classroom_form_override UNIQUE(classroom_id, form_template_id)
);

-- Indexes for performance
CREATE INDEX idx_class_overrides_classroom ON class_form_overrides(classroom_id);
CREATE INDEX idx_class_overrides_school ON class_form_overrides(school_id);

-- =====================================================
-- 3. STUDENT FORM ASSIGNMENTS TABLE (MATERIALIZED)
-- =====================================================
-- Explicit records for each student-form combination

DROP TABLE IF EXISTS student_form_assignments CASCADE;
CREATE TABLE student_form_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) NOT NULL,
    enrollment_id UUID REFERENCES enrollments(id) NOT NULL,
    child_id UUID REFERENCES children(id) NOT NULL,
    form_template_id UUID REFERENCES form_templates(id) NOT NULL,
    assignment_source VARCHAR(20) NOT NULL 
        CHECK (assignment_source IN ('school_default', 'class_override', 'individual')),
    is_required BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_enrollment_form UNIQUE(enrollment_id, form_template_id)
);

-- Indexes for performance
CREATE INDEX idx_student_assignments_enrollment ON student_form_assignments(enrollment_id);
CREATE INDEX idx_student_assignments_child ON student_form_assignments(child_id);
CREATE INDEX idx_student_assignments_school ON student_form_assignments(school_id);

-- =====================================================
-- 4. UPDATED FORM SUBMISSIONS TABLE
-- =====================================================
-- Links to materialized assignments and stores Fillout webhook data

DROP TABLE IF EXISTS form_submissions CASCADE;
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) NOT NULL,
    enrollment_id UUID REFERENCES enrollments(id),
    student_form_assignment_id UUID REFERENCES student_form_assignments(id),
    form_template_id UUID REFERENCES form_templates(id) NOT NULL,
    fillout_submission_id VARCHAR(255) NOT NULL UNIQUE,
    form_data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    submitted_at TIMESTAMP NOT NULL,
    processed_at TIMESTAMP DEFAULT NOW(),
    
    -- Ensure we can track submissions even if assignment is deleted
    CONSTRAINT form_submissions_check_assignment_or_template 
        CHECK (student_form_assignment_id IS NOT NULL OR form_template_id IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX idx_form_submissions_enrollment ON form_submissions(enrollment_id);
CREATE INDEX idx_form_submissions_fillout_id ON form_submissions(fillout_submission_id);
CREATE INDEX idx_form_submissions_school ON form_submissions(school_id);
CREATE INDEX idx_form_submissions_template ON form_submissions(form_template_id);

-- =====================================================
-- 5. ENROLLMENT APPROVAL & FORM LOCKING TABLES
-- =====================================================
-- Admin approval workflow and audit trail

-- Add admin approval columns to enrollments table
-- (Assumes enrollments table exists as per system architecture)
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS admin_approval_status VARCHAR(20) 
    DEFAULT 'pending' CHECK (admin_approval_status IN ('pending', 'approved', 'rejected', 'needs_revision'));
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id);
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS approval_notes TEXT;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS forms_locked_at TIMESTAMP;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS revision_requested_at TIMESTAMP;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS revision_notes TEXT;

-- Create enrollment approval audit trail table
DROP TABLE IF EXISTS enrollment_approval_audit CASCADE;
CREATE TABLE enrollment_approval_audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) NOT NULL,
    enrollment_id UUID REFERENCES enrollments(id) NOT NULL,
    admin_id UUID REFERENCES profiles(id) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('approve', 'reject', 'request_revision', 'unlock_forms')),
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    notes TEXT,
    affected_forms JSONB DEFAULT '[]', -- List of form IDs affected by action
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT fk_audit_school FOREIGN KEY (school_id) REFERENCES schools(id),
    CONSTRAINT fk_audit_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments(id),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES profiles(id)
);

-- Indexes for enrollment approval audit
CREATE INDEX idx_approval_audit_enrollment ON enrollment_approval_audit(enrollment_id);
CREATE INDEX idx_approval_audit_school ON enrollment_approval_audit(school_id);
CREATE INDEX idx_approval_audit_admin ON enrollment_approval_audit(admin_id);
CREATE INDEX idx_approval_audit_created ON enrollment_approval_audit(created_at);

-- =====================================================
-- 6. ROW LEVEL SECURITY POLICIES
-- =====================================================
-- Ensure multi-tenant isolation for all form-related tables

-- Enable RLS on all tables
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_form_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_form_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_approval_audit ENABLE ROW LEVEL SECURITY;

-- Form Templates RLS
CREATE POLICY form_templates_school_isolation ON form_templates
    FOR ALL
    USING (school_id = (current_setting('app.current_school_id'))::uuid);

-- Class Form Overrides RLS
CREATE POLICY class_form_overrides_school_isolation ON class_form_overrides
    FOR ALL
    USING (school_id = (current_setting('app.current_school_id'))::uuid);

-- Student Form Assignments RLS
CREATE POLICY student_form_assignments_school_isolation ON student_form_assignments
    FOR ALL
    USING (school_id = (current_setting('app.current_school_id'))::uuid);

-- Form Submissions RLS
CREATE POLICY form_submissions_school_isolation ON form_submissions
    FOR ALL
    USING (school_id = (current_setting('app.current_school_id'))::uuid);

-- Enrollment Approval Audit RLS
CREATE POLICY enrollment_approval_audit_school_isolation ON enrollment_approval_audit
    FOR ALL
    USING (school_id = (current_setting('app.current_school_id'))::uuid);

-- =====================================================
-- 7. ADMIN APPROVAL HELPER FUNCTIONS
-- =====================================================

-- Function to approve enrollment and lock forms
CREATE OR REPLACE FUNCTION approve_enrollment(
    p_enrollment_id UUID,
    p_admin_id UUID,
    p_approval_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    v_school_id UUID;
    v_current_status VARCHAR(20);
    v_required_forms_count INTEGER;
    v_completed_forms_count INTEGER;
BEGIN
    -- Get enrollment details and verify it exists
    SELECT e.school_id, e.admin_approval_status 
    INTO v_school_id, v_current_status
    FROM enrollments e 
    WHERE e.id = p_enrollment_id;
    
    IF v_school_id IS NULL THEN
        RAISE EXCEPTION 'Enrollment not found';
    END IF;
    
    -- Verify admin has permission for this school
    IF NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = p_admin_id 
        AND p.school_id = v_school_id 
        AND p.role IN ('admin', 'super_admin')
    ) THEN
        RAISE EXCEPTION 'Admin does not have permission for this school';
    END IF;
    
    -- Check if all required forms are completed
    SELECT 
        COUNT(*) FILTER (WHERE sfa.is_required = true),
        COUNT(*) FILTER (WHERE sfa.is_required = true AND fs.id IS NOT NULL)
    INTO v_required_forms_count, v_completed_forms_count
    FROM student_form_assignments sfa
    LEFT JOIN form_submissions fs ON sfa.id = fs.student_form_assignment_id
    WHERE sfa.enrollment_id = p_enrollment_id;
    
    IF v_completed_forms_count < v_required_forms_count THEN
        RAISE EXCEPTION 'Cannot approve enrollment: % of % required forms are incomplete', 
            (v_required_forms_count - v_completed_forms_count), v_required_forms_count;
    END IF;
    
    -- Update enrollment status
    UPDATE enrollments 
    SET 
        admin_approval_status = 'approved',
        approved_at = NOW(),
        approved_by = p_admin_id,
        approval_notes = p_approval_notes,
        forms_locked_at = NOW()
    WHERE id = p_enrollment_id;
    
    -- Create audit record
    INSERT INTO enrollment_approval_audit (
        school_id,
        enrollment_id,
        admin_id,
        action,
        previous_status,
        new_status,
        notes
    ) VALUES (
        v_school_id,
        p_enrollment_id,
        p_admin_id,
        'approve',
        v_current_status,
        'approved',
        p_approval_notes
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to reject enrollment
CREATE OR REPLACE FUNCTION reject_enrollment(
    p_enrollment_id UUID,
    p_admin_id UUID,
    p_rejection_notes TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_school_id UUID;
    v_current_status VARCHAR(20);
BEGIN
    -- Get enrollment details
    SELECT e.school_id, e.admin_approval_status 
    INTO v_school_id, v_current_status
    FROM enrollments e 
    WHERE e.id = p_enrollment_id;
    
    IF v_school_id IS NULL THEN
        RAISE EXCEPTION 'Enrollment not found';
    END IF;
    
    -- Verify admin permission
    IF NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = p_admin_id 
        AND p.school_id = v_school_id 
        AND p.role IN ('admin', 'super_admin')
    ) THEN
        RAISE EXCEPTION 'Admin does not have permission for this school';
    END IF;
    
    -- Update enrollment status
    UPDATE enrollments 
    SET 
        admin_approval_status = 'rejected',
        approved_by = p_admin_id,
        approval_notes = p_rejection_notes,
        forms_locked_at = NULL -- Unlock forms for potential resubmission
    WHERE id = p_enrollment_id;
    
    -- Create audit record
    INSERT INTO enrollment_approval_audit (
        school_id,
        enrollment_id,
        admin_id,
        action,
        previous_status,
        new_status,
        notes
    ) VALUES (
        v_school_id,
        p_enrollment_id,
        p_admin_id,
        'reject',
        v_current_status,
        'rejected',
        p_rejection_notes
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to request enrollment revision (unlock specific forms)
CREATE OR REPLACE FUNCTION request_enrollment_revision(
    p_enrollment_id UUID,
    p_admin_id UUID,
    p_revision_notes TEXT,
    p_form_ids UUID[] DEFAULT NULL -- Specific forms to unlock, NULL for all
) RETURNS BOOLEAN AS $$
DECLARE
    v_school_id UUID;
    v_current_status VARCHAR(20);
    form_id UUID;
BEGIN
    -- Get enrollment details
    SELECT e.school_id, e.admin_approval_status 
    INTO v_school_id, v_current_status
    FROM enrollments e 
    WHERE e.id = p_enrollment_id;
    
    IF v_school_id IS NULL THEN
        RAISE EXCEPTION 'Enrollment not found';
    END IF;
    
    -- Verify admin permission
    IF NOT EXISTS (
        SELECT 1 FROM profiles p 
        WHERE p.id = p_admin_id 
        AND p.school_id = v_school_id 
        AND p.role IN ('admin', 'super_admin')
    ) THEN
        RAISE EXCEPTION 'Admin does not have permission for this school';
    END IF;
    
    -- Update enrollment status
    UPDATE enrollments 
    SET 
        admin_approval_status = 'needs_revision',
        revision_requested_at = NOW(),
        revision_notes = p_revision_notes,
        forms_locked_at = NULL -- Unlock forms for revision
    WHERE id = p_enrollment_id;
    
    -- Create audit record
    INSERT INTO enrollment_approval_audit (
        school_id,
        enrollment_id,
        admin_id,
        action,
        previous_status,
        new_status,
        notes,
        affected_forms
    ) VALUES (
        v_school_id,
        p_enrollment_id,
        p_admin_id,
        'request_revision',
        v_current_status,
        'needs_revision',
        p_revision_notes,
        COALESCE(array_to_json(p_form_ids), '[]'::jsonb)
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to check if enrollment forms are locked
CREATE OR REPLACE FUNCTION are_enrollment_forms_locked(p_enrollment_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_forms_locked_at TIMESTAMP;
    v_approval_status VARCHAR(20);
BEGIN
    SELECT forms_locked_at, admin_approval_status 
    INTO v_forms_locked_at, v_approval_status
    FROM enrollments 
    WHERE id = p_enrollment_id;
    
    -- Forms are locked if approved and forms_locked_at is set
    RETURN (v_approval_status = 'approved' AND v_forms_locked_at IS NOT NULL);
END;
$$ LANGUAGE plpgsql;

-- Function to get enrollment approval status with details
CREATE OR REPLACE FUNCTION get_enrollment_approval_status(p_enrollment_id UUID)
RETURNS TABLE (
    enrollment_id UUID,
    approval_status VARCHAR(20),
    approved_at TIMESTAMP,
    approved_by_name TEXT,
    approval_notes TEXT,
    forms_locked BOOLEAN,
    forms_locked_at TIMESTAMP,
    revision_notes TEXT,
    required_forms_count INTEGER,
    completed_forms_count INTEGER,
    can_be_approved BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id as enrollment_id,
        e.admin_approval_status as approval_status,
        e.approved_at,
        CASE 
            WHEN p.first_name IS NOT NULL AND p.last_name IS NOT NULL 
            THEN CONCAT(p.first_name, ' ', p.last_name)
            ELSE NULL
        END as approved_by_name,
        e.approval_notes,
        (e.admin_approval_status = 'approved' AND e.forms_locked_at IS NOT NULL) as forms_locked,
        e.forms_locked_at,
        e.revision_notes,
        COUNT(*) FILTER (WHERE sfa.is_required = true)::INTEGER as required_forms_count,
        COUNT(*) FILTER (WHERE sfa.is_required = true AND fs.id IS NOT NULL)::INTEGER as completed_forms_count,
        (COUNT(*) FILTER (WHERE sfa.is_required = true) = 
         COUNT(*) FILTER (WHERE sfa.is_required = true AND fs.id IS NOT NULL)) as can_be_approved
    FROM enrollments e
    LEFT JOIN profiles p ON e.approved_by = p.id
    LEFT JOIN student_form_assignments sfa ON e.id = sfa.enrollment_id
    LEFT JOIN form_submissions fs ON sfa.id = fs.student_form_assignment_id
    WHERE e.id = p_enrollment_id
    GROUP BY e.id, e.admin_approval_status, e.approved_at, p.first_name, p.last_name, 
             e.approval_notes, e.forms_locked_at, e.revision_notes;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. HELPER FUNCTIONS (ORIGINAL)
-- =====================================================

-- Function to automatically assign forms to new enrollment
CREATE OR REPLACE FUNCTION assign_forms_to_enrollment(
    p_enrollment_id UUID,
    p_school_id UUID,
    p_child_id UUID,
    p_classroom_id UUID
) RETURNS INTEGER AS $$
DECLARE
    form_record RECORD;
    assignment_count INTEGER := 0;
BEGIN
    -- Get all school default forms that are not excluded by class
    -- Plus any forms that are explicitly included by class
    
    FOR form_record IN
        WITH school_defaults AS (
            -- Get all school default forms
            SELECT ft.id, ft.is_required, 'school_default'::text as source
            FROM form_templates ft
            WHERE ft.school_id = p_school_id 
            AND ft.status = 'school_default'
        ),
        class_exclusions AS (
            -- Get forms excluded by class
            SELECT cfo.form_template_id
            FROM class_form_overrides cfo
            WHERE cfo.classroom_id = p_classroom_id 
            AND cfo.action = 'exclude'
        ),
        class_inclusions AS (
            -- Get forms explicitly included by class
            SELECT ft.id, COALESCE(cfo.is_required, ft.is_required) as is_required, 'class_override'::text as source
            FROM class_form_overrides cfo
            JOIN form_templates ft ON cfo.form_template_id = ft.id
            WHERE cfo.classroom_id = p_classroom_id 
            AND cfo.action = 'include'
            AND ft.status IN ('active', 'school_default')
        ),
        final_forms AS (
            -- School defaults minus exclusions
            SELECT sd.id, sd.is_required, sd.source
            FROM school_defaults sd
            WHERE sd.id NOT IN (SELECT form_template_id FROM class_exclusions)
            
            UNION
            
            -- Class inclusions
            SELECT ci.id, ci.is_required, ci.source
            FROM class_inclusions ci
        )
        SELECT ff.id, ff.is_required, ff.source
        FROM final_forms ff
    LOOP
        -- Insert the assignment
        INSERT INTO student_form_assignments (
            school_id,
            enrollment_id,
            child_id,
            form_template_id,
            assignment_source,
            is_required
        ) VALUES (
            p_school_id,
            p_enrollment_id,
            p_child_id,
            form_record.id,
            form_record.source,
            form_record.is_required
        ) ON CONFLICT (enrollment_id, form_template_id) DO NOTHING;
        
        assignment_count := assignment_count + 1;
    END LOOP;
    
    RETURN assignment_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get all forms assigned to an enrollment
CREATE OR REPLACE FUNCTION get_enrollment_forms(p_enrollment_id UUID)
RETURNS TABLE (
    assignment_id UUID,
    form_template_id UUID,
    form_name VARCHAR(255),
    form_type VARCHAR(50),
    fillout_form_url TEXT,
    fillout_form_id VARCHAR(255),
    is_required BOOLEAN,
    assignment_source VARCHAR(20),
    submission_id UUID,
    submitted_at TIMESTAMP,
    form_status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sfa.id as assignment_id,
        ft.id as form_template_id,
        ft.form_name,
        ft.form_type,
        ft.fillout_form_url,
        ft.fillout_form_id,
        sfa.is_required,
        sfa.assignment_source,
        fs.id as submission_id,
        fs.submitted_at,
        CASE 
            WHEN fs.id IS NOT NULL THEN 'completed'
            ELSE 'pending'
        END as form_status
    FROM student_form_assignments sfa
    JOIN form_templates ft ON sfa.form_template_id = ft.id
    LEFT JOIN form_submissions fs ON sfa.id = fs.student_form_assignment_id
    WHERE sfa.enrollment_id = p_enrollment_id
    ORDER BY ft.display_order ASC, ft.form_name ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to add individual form to student
CREATE OR REPLACE FUNCTION assign_individual_form(
    p_enrollment_id UUID,
    p_form_template_id UUID,
    p_is_required BOOLEAN DEFAULT FALSE
) RETURNS BOOLEAN AS $$
DECLARE
    v_school_id UUID;
    v_child_id UUID;
BEGIN
    -- Get school_id and child_id from enrollment
    SELECT e.school_id, e.child_id 
    INTO v_school_id, v_child_id
    FROM enrollments e 
    WHERE e.id = p_enrollment_id;
    
    IF v_school_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Insert the individual assignment
    INSERT INTO student_form_assignments (
        school_id,
        enrollment_id,
        child_id,
        form_template_id,
        assignment_source,
        is_required
    ) VALUES (
        v_school_id,
        p_enrollment_id,
        v_child_id,
        p_form_template_id,
        'individual',
        p_is_required
    ) ON CONFLICT (enrollment_id, form_template_id) DO UPDATE SET
        assignment_source = 'individual',
        is_required = p_is_required;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. TRIGGERS FOR AUTOMATED FORM ASSIGNMENT & APPROVAL NOTIFICATIONS
-- =====================================================

-- Trigger function to automatically assign forms when enrollment is created
CREATE OR REPLACE FUNCTION trigger_assign_forms_to_new_enrollment()
RETURNS TRIGGER AS $$
BEGIN
    -- Only assign forms for new enrollments
    IF TG_OP = 'INSERT' THEN
        PERFORM assign_forms_to_enrollment(
            NEW.id,
            NEW.school_id,
            NEW.child_id,
            NEW.classroom_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on enrollments table
DROP TRIGGER IF EXISTS trigger_new_enrollment_form_assignment ON enrollments;
CREATE TRIGGER trigger_new_enrollment_form_assignment
    AFTER INSERT ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_assign_forms_to_new_enrollment();

-- Trigger function for approval status changes (for notifications)
CREATE OR REPLACE FUNCTION trigger_enrollment_approval_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Only trigger on approval status changes
    IF TG_OP = 'UPDATE' AND OLD.admin_approval_status != NEW.admin_approval_status THEN
        -- Insert notification record (to be processed by notification service)
        INSERT INTO notifications (
            school_id,
            enrollment_id,
            notification_type,
            recipient_type,
            message,
            metadata
        ) VALUES (
            NEW.school_id,
            NEW.id,
            CASE NEW.admin_approval_status
                WHEN 'approved' THEN 'enrollment_approved'
                WHEN 'rejected' THEN 'enrollment_rejected'
                WHEN 'needs_revision' THEN 'enrollment_needs_revision'
                ELSE 'enrollment_status_changed'
            END,
            'parent',
            CASE NEW.admin_approval_status
                WHEN 'approved' THEN 'Your enrollment application has been approved!'
                WHEN 'rejected' THEN 'Your enrollment application requires attention.'
                WHEN 'needs_revision' THEN 'Please review and update your enrollment application.'
                ELSE 'Your enrollment status has been updated.'
            END,
            jsonb_build_object(
                'approval_status', NEW.admin_approval_status,
                'approved_by', NEW.approved_by,
                'approval_notes', NEW.approval_notes,
                'forms_locked', NEW.forms_locked_at IS NOT NULL
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for enrollment approval notifications
DROP TRIGGER IF EXISTS trigger_enrollment_approval_notification ON enrollments;
CREATE TRIGGER trigger_enrollment_approval_notification
    AFTER UPDATE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_enrollment_approval_notification();

-- =====================================================
-- 10. SAMPLE DATA FOR TESTING
-- =====================================================

-- Note: This would be populated by actual school setup
-- Sample form templates for a school
/*
INSERT INTO form_templates (school_id, form_name, form_type, fillout_form_id, fillout_form_url, status, is_required, display_order) VALUES
-- Assuming school_id exists
('school-uuid-here', 'Admission Application', 'admission', 'fillout-form-1', 'https://forms.brookside.goddard.com/admission', 'school_default', true, 1),
('school-uuid-here', 'Medical Information', 'medical', 'fillout-form-2', 'https://forms.brookside.goddard.com/medical', 'school_default', true, 2),
('school-uuid-here', 'Emergency Contacts', 'emergency', 'fillout-form-3', 'https://forms.brookside.goddard.com/emergency', 'school_default', true, 3),
('school-uuid-here', 'Photo Release', 'authorization', 'fillout-form-4', 'https://forms.brookside.goddard.com/photo-release', 'active', false, 4);
*/

-- =====================================================
-- 11. USEFUL QUERIES FOR ADMIN DASHBOARD & APPROVAL MANAGEMENT
-- =====================================================

-- Get all forms with their current assignments count
/*
SELECT 
    ft.form_name,
    ft.status,
    ft.form_type,
    COUNT(sfa.id) as assigned_count,
    COUNT(fs.id) as completed_count
FROM form_templates ft
LEFT JOIN student_form_assignments sfa ON ft.id = sfa.form_template_id
LEFT JOIN form_submissions fs ON sfa.id = fs.student_form_assignment_id
WHERE ft.school_id = 'school-uuid'
GROUP BY ft.id, ft.form_name, ft.status, ft.form_type
ORDER BY ft.display_order;
*/

-- Get class-specific form overrides
/*
SELECT 
    c.name as classroom_name,
    ft.form_name,
    cfo.action,
    cfo.is_required
FROM class_form_overrides cfo
JOIN classrooms c ON cfo.classroom_id = c.id
JOIN form_templates ft ON cfo.form_template_id = ft.id
WHERE cfo.school_id = 'school-uuid'
ORDER BY c.name, ft.form_name;
*/

-- Get enrollment progress for a student
/*
SELECT * FROM get_enrollment_forms('enrollment-uuid-here');
*/

-- Get enrollments pending admin approval
/*
SELECT 
    e.id,
    c.first_name || ' ' || c.last_name as child_name,
    e.created_at as submitted_at,
    COUNT(*) FILTER (WHERE sfa.is_required = true) as required_forms,
    COUNT(*) FILTER (WHERE sfa.is_required = true AND fs.id IS NOT NULL) as completed_forms,
    CASE 
        WHEN COUNT(*) FILTER (WHERE sfa.is_required = true) = 
             COUNT(*) FILTER (WHERE sfa.is_required = true AND fs.id IS NOT NULL)
        THEN true ELSE false 
    END as ready_for_approval
FROM enrollments e
JOIN children c ON e.child_id = c.id
LEFT JOIN student_form_assignments sfa ON e.id = sfa.enrollment_id
LEFT JOIN form_submissions fs ON sfa.id = fs.student_form_assignment_id
WHERE e.school_id = 'school-uuid' 
AND e.admin_approval_status = 'pending'
GROUP BY e.id, c.first_name, c.last_name, e.created_at
ORDER BY e.created_at DESC;
*/

-- Get enrollment approval history
/*
SELECT 
    eaa.action,
    eaa.previous_status,
    eaa.new_status,
    eaa.notes,
    p.first_name || ' ' || p.last_name as admin_name,
    eaa.created_at
FROM enrollment_approval_audit eaa
JOIN profiles p ON eaa.admin_id = p.id
WHERE eaa.enrollment_id = 'enrollment-uuid'
ORDER BY eaa.created_at DESC;
*/

-- Get approval statistics for school dashboard
/*
SELECT 
    COUNT(*) FILTER (WHERE admin_approval_status = 'pending') as pending_approvals,
    COUNT(*) FILTER (WHERE admin_approval_status = 'approved') as approved_enrollments,
    COUNT(*) FILTER (WHERE admin_approval_status = 'rejected') as rejected_enrollments,
    COUNT(*) FILTER (WHERE admin_approval_status = 'needs_revision') as needs_revision,
    AVG(EXTRACT(EPOCH FROM (approved_at - created_at))/86400) as avg_approval_time_days
FROM enrollments
WHERE school_id = 'school-uuid'
AND created_at >= CURRENT_DATE - INTERVAL '30 days';
*/