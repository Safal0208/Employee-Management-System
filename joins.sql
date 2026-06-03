-- =============================================
-- SQL JOIN Queries (as specified in the task)
-- =============================================

-- Join 1: Employee names with their department names
SELECT u.name, d.department_name
FROM employee_profiles ep
INNER JOIN users u ON ep.user_id = u.id
INNER JOIN departments d ON ep.department_id = d.id;

-- Join 2: Employee names with their assigned skills
SELECT u.name, s.skill_name
FROM employee_skills es
INNER JOIN employee_profiles ep ON es.employee_id = ep.id
INNER JOIN users u ON ep.user_id = u.id
INNER JOIN skills s ON es.skill_id = s.id;