-- ==========================================
-- DATOS DE PRUEBA PARA SISTEMA EDUCATIVO
-- ==========================================

-- Deshabilitar triggers temporalmente durante la inserción
SET session_replication_role = replica;

BEGIN;

-- ==================================
-- 1. ROLES DEL SISTEMA
-- ==================================
INSERT INTO "Role" ("roleName", "roleStatus") VALUES
('Administrador', true),
('Profesor', true),
('Estudiante', true),
('Director', true),
('Coordinador', true)
ON CONFLICT DO NOTHING;

-- ==================================
-- 2. GRADOS ACADÉMICOS
-- ==================================
INSERT INTO "Grade" ("gradeLevel", "gradeDescription", "gradeStatus") VALUES
('1ro Primaria', 'Primer grado de educación primaria', true),
('2do Primaria', 'Segundo grado de educación primaria', true),
('3ro Primaria', 'Tercer grado de educación primaria', true),
('4to Primaria', 'Cuarto grado de educación primaria', true),
('5to Primaria', 'Quinto grado de educación primaria', true),
('6to Primaria', 'Sexto grado de educación primaria', true),
('1ro Secundaria', 'Primer año de educación secundaria', true),
('2do Secundaria', 'Segundo año de educación secundaria', true),
('3ro Secundaria', 'Tercer año de educación secundaria', true),
('4to Secundaria', 'Cuarto año de educación secundaria', true),
('5to Secundaria', 'Quinto año de educación secundaria', true)
ON CONFLICT DO NOTHING;

-- ==================================
-- 3. MATERIAS/ASIGNATURAS
-- ==================================
INSERT INTO "Subject" ("subjectName", "subjectDescription", "subjectStatus") VALUES
('Matemática', 'Matemática básica y avanzada', true),
('Comunicación', 'Lenguaje y literatura', true),
('Ciencias Naturales', 'Biología, química y física', true),
('Ciencias Sociales', 'Historia, geografía y cívica', true),
('Educación Física', 'Actividades deportivas y recreativas', true),
('Arte', 'Expresión artística y cultural', true),
('Inglés', 'Idioma extranjero', true),
('Religión', 'Educación religiosa', true),
('Informática', 'Computación y tecnología', true),
('Tutoría', 'Orientación y consejería estudiantil', true),
('Física', 'Física avanzada para secundaria', true),
('Química', 'Química para secundaria', true),
('Biología', 'Biología para secundaria', true),
('Historia', 'Historia del Perú y universal', true),
('Geografía', 'Geografía nacional e internacional', true)
ON CONFLICT DO NOTHING;

-- ==================================
-- 4. USUARIOS DEL SISTEMA
-- ==================================

-- Administradores
INSERT INTO "User" (
    "userFirstName", "userSecondName", "userFirstLastName", "userSecondLastName",
    "userEmail", "userCI", "userPassword", "userDateOfBirth", "userAddress",
    "userPhoneNumber", "userRoleId", "userStatus"
) VALUES
('Carlos', 'Alberto', 'Rodríguez', 'García', 'admin@colegio.edu.pe', 12345678, 
 '$2b$10$example.hash.password', '1985-03-15', 'Av. Principal 123, Lima', 
 '987654321', 1, true),
('Ana', 'María', 'López', 'Silva', 'director@colegio.edu.pe', 23456789, 
 '$2b$10$example.hash.password', '1980-07-22', 'Jr. Educación 456, Lima', 
 '987654322', 4, true)
ON CONFLICT DO NOTHING;

-- Profesores
INSERT INTO "User" (
    "userFirstName", "userSecondName", "userFirstLastName", "userSecondLastName",
    "userEmail", "userCI", "userPassword", "userDateOfBirth", "userAddress",
    "userPhoneNumber", "userRoleId", "userStatus"
) VALUES
('José', 'Luis', 'Mendoza', 'Vargas', 'jmendoza@colegio.edu.pe', 34567890, 
 '$2b$10$example.hash.password', '1988-01-10', 'Calle Los Profesores 789', 
 '987654323', 2, true),
('María', 'Elena', 'Fernández', 'Torres', 'mfernandez@colegio.edu.pe', 45678901, 
 '$2b$10$example.hash.password', '1985-05-20', 'Av. Educadores 321', 
 '987654324', 2, true),
('Roberto', 'Carlos', 'Sánchez', 'Morales', 'rsanchez@colegio.edu.pe', 56789012, 
 '$2b$10$example.hash.password', '1982-09-15', 'Jr. Maestros 654', 
 '987654325', 2, true),
('Patricia', 'Isabel', 'González', 'Ruiz', 'pgonzalez@colegio.edu.pe', 67890123, 
 '$2b$10$example.hash.password', '1987-11-03', 'Calle Docentes 987', 
 '987654326', 2, true),
('Miguel', 'Ángel', 'Herrera', 'Castro', 'mherrera@colegio.edu.pe', 78901234, 
 '$2b$10$example.hash.password', '1984-04-12', 'Av. Pedagogía 159', 
 '987654327', 2, true),
('Carmen', 'Rosa', 'Díaz', 'Flores', 'cdiaz@colegio.edu.pe', 89012345, 
 '$2b$10$example.hash.password', '1989-08-25', 'Jr. Enseñanza 753', 
 '987654328', 2, true)
ON CONFLICT DO NOTHING;

-- Estudiantes
INSERT INTO "User" (
    "userFirstName", "userSecondName", "userFirstLastName", "userSecondLastName",
    "userEmail", "userCI", "userPassword", "userDateOfBirth", "userAddress",
    "userPhoneNumber", "userRoleId", "userStatus"
) VALUES
('Diego', 'Alexander', 'Pérez', 'Martín', 'diego.perez@estudiante.edu.pe', 10111213, 
 '$2b$10$example.hash.password', '2010-03-15', 'Calle Estudiantes 101', 
 '987654329', 3, true),
('Sofía', 'Valentina', 'García', 'López', 'sofia.garcia@estudiante.edu.pe', 11121314, 
 '$2b$10$example.hash.password', '2011-07-22', 'Av. Juventud 202', 
 '987654330', 3, true),
('Mateo', 'Sebastian', 'Rodríguez', 'Silva', 'mateo.rodriguez@estudiante.edu.pe', 12131415, 
 '$2b$10$example.hash.password', '2009-01-10', 'Jr. Aprendices 303', 
 '987654331', 3, true),
('Isabella', 'Camila', 'Mendoza', 'Torres', 'isabella.mendoza@estudiante.edu.pe', 13141516, 
 '$2b$10$example.hash.password', '2010-05-20', 'Calle Futuro 404', 
 '987654332', 3, true),
('Alejandro', 'Nicolás', 'Fernández', 'Morales', 'alejandro.fernandez@estudiante.edu.pe', 14151617, 
 '$2b$10$example.hash.password', '2011-09-15', 'Av. Esperanza 505', 
 '987654333', 3, true),
('Valentina', 'Lucía', 'Sánchez', 'Ruiz', 'valentina.sanchez@estudiante.edu.pe', 15161718, 
 '$2b$10$example.hash.password', '2009-11-03', 'Jr. Sueños 606', 
 '987654334', 3, true),
('Sebastián', 'Andrés', 'González', 'Castro', 'sebastian.gonzalez@estudiante.edu.pe', 16171819, 
 '$2b$10$example.hash.password', '2010-04-12', 'Calle Metas 707', 
 '987654335', 3, true),
('Emma', 'Gabriela', 'Herrera', 'Flores', 'emma.herrera@estudiante.edu.pe', 17181920, 
 '$2b$10$example.hash.password', '2011-08-25', 'Av. Logros 808', 
 '987654336', 3, true),
('Leonardo', 'Emilio', 'Díaz', 'Vargas', 'leonardo.diaz@estudiante.edu.pe', 18192021, 
 '$2b$10$example.hash.password', '2009-12-08', 'Jr. Éxito 909', 
 '987654337', 3, true),
('Mía', 'Antonella', 'López', 'García', 'mia.lopez@estudiante.edu.pe', 19202122, 
 '$2b$10$example.hash.password', '2010-06-18', 'Calle Triunfo 1010', 
 '987654338', 3, true)
ON CONFLICT DO NOTHING;

-- ==================================
-- 5. DATOS DE PROFESORES
-- ==================================
INSERT INTO "Teacher" (
    "userId", "teacherExperienceYears", "teacherLicenseNumber", "teacherHours"
) VALUES
(3, 8, 'LIC-MAT-001', 40),  -- José Luis (Matemática)
(4, 12, 'LIC-COM-002', 35), -- María Elena (Comunicación)
(5, 15, 'LIC-CIE-003', 30), -- Roberto Carlos (Ciencias)
(6, 6, 'LIC-SOC-004', 40),  -- Patricia Isabel (Sociales)
(7, 10, 'LIC-EDF-005', 25), -- Miguel Ángel (Ed. Física)
(8, 7, 'LIC-ART-006', 30)   -- Carmen Rosa (Arte)
ON CONFLICT DO NOTHING;

-- ==================================
-- 6. DATOS DE ESTUDIANTES
-- ==================================
INSERT INTO "Student" ("userId", "gradeId") VALUES
(9, 3),   -- Diego - 3ro Primaria
(10, 3),  -- Sofía - 3ro Primaria
(11, 4),  -- Mateo - 4to Primaria
(12, 4),  -- Isabella - 4to Primaria
(13, 5),  -- Alejandro - 5to Primaria
(14, 5),  -- Valentina - 5to Primaria
(15, 6),  -- Sebastián - 6to Primaria
(16, 6),  -- Emma - 6to Primaria
(17, 7),  -- Leonardo - 1ro Secundaria
(18, 7)   -- Mía - 1ro Secundaria
ON CONFLICT DO NOTHING;

-- ==================================
-- 7. RELACIÓN PROFESORES-GRADOS
-- ==================================
INSERT INTO "TeacherGrade" ("teacherId", "gradeId") VALUES
(1, 3), (1, 4), (1, 5),  -- José Luis (Matemática) - 3ro, 4to, 5to Primaria
(2, 3), (2, 4), (2, 5),  -- María Elena (Comunicación) - 3ro, 4to, 5to Primaria
(3, 6), (3, 7),          -- Roberto Carlos (Ciencias) - 6to Primaria, 1ro Secundaria
(4, 6), (4, 7),          -- Patricia Isabel (Sociales) - 6to Primaria, 1ro Secundaria
(5, 3), (5, 4), (5, 5), (5, 6), (5, 7),  -- Miguel Ángel (Ed. Física) - Todos
(6, 3), (6, 4), (6, 5)   -- Carmen Rosa (Arte) - 3ro, 4to, 5to Primaria
ON CONFLICT DO NOTHING;

-- ==================================
-- 8. RELACIÓN GRADOS-MATERIAS
-- ==================================
INSERT INTO "GradeSubject" ("gradeId", "subjectId") VALUES
-- 3ro Primaria
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 8), (3, 10),
-- 4to Primaria  
(4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 10),
-- 5to Primaria
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9), (5, 10),
-- 6to Primaria
(6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8), (6, 9), (6, 10),
-- 1ro Secundaria
(7, 1), (7, 2), (7, 11), (7, 12), (7, 13), (7, 14), (7, 15), (7, 5), (7, 6), (7, 7), (7, 8), (7, 9), (7, 10)
ON CONFLICT DO NOTHING;

-- ==================================
-- 9. RELACIÓN PROFESORES-MATERIAS
-- ==================================
INSERT INTO "TeacherSubject" ("teacherId", "subjectId") VALUES
(1, 1),  -- José Luis - Matemática
(2, 2),  -- María Elena - Comunicación
(3, 3), (3, 11), (3, 12), (3, 13),  -- Roberto Carlos - Ciencias, Física, Química, Biología
(4, 4), (4, 14), (4, 15),  -- Patricia Isabel - Sociales, Historia, Geografía
(5, 5),  -- Miguel Ángel - Educación Física
(6, 6)   -- Carmen Rosa - Arte
ON CONFLICT DO NOTHING;

-- ==================================
-- 10. ASIGNACIONES ESTUDIANTE-PROFESOR-MATERIA
-- ==================================
INSERT INTO "StudentTeacherSubject" (
    "studentId", "teacherId", "subjectId", "gradeId", "academicPeriod", "isActive"
) VALUES
-- Diego (3ro Primaria)
(1, 1, 1, 3, '2024-I', true),  -- Matemática
(1, 2, 2, 3, '2024-I', true),  -- Comunicación
(1, 6, 6, 3, '2024-I', true),  -- Arte
(1, 5, 5, 3, '2024-I', true),  -- Ed. Física

-- Sofía (3ro Primaria)
(2, 1, 1, 3, '2024-I', true),  -- Matemática
(2, 2, 2, 3, '2024-I', true),  -- Comunicación
(2, 6, 6, 3, '2024-I', true),  -- Arte
(2, 5, 5, 3, '2024-I', true),  -- Ed. Física

-- Mateo (4to Primaria)
(3, 1, 1, 4, '2024-I', true),  -- Matemática
(3, 2, 2, 4, '2024-I', true),  -- Comunicación
(3, 6, 6, 4, '2024-I', true),  -- Arte
(3, 5, 5, 4, '2024-I', true),  -- Ed. Física

-- Isabella (4to Primaria)
(4, 1, 1, 4, '2024-I', true),  -- Matemática
(4, 2, 2, 4, '2024-I', true),  -- Comunicación
(4, 6, 6, 4, '2024-I', true),  -- Arte
(4, 5, 5, 4, '2024-I', true),  -- Ed. Física

-- Leonardo (1ro Secundaria)
(9, 1, 1, 7, '2024-I', true),  -- Matemática
(9, 2, 2, 7, '2024-I', true),  -- Comunicación
(9, 3, 11, 7, '2024-I', true), -- Física
(9, 4, 14, 7, '2024-I', true), -- Historia
(9, 5, 5, 7, '2024-I', true),  -- Ed. Física

-- Mía (1ro Secundaria)
(10, 1, 1, 7, '2024-I', true), -- Matemática
(10, 2, 2, 7, '2024-I', true), -- Comunicación
(10, 3, 11, 7, '2024-I', true),-- Física
(10, 4, 14, 7, '2024-I', true),-- Historia
(10, 5, 5, 7, '2024-I', true)  -- Ed. Física
ON CONFLICT DO NOTHING;

-- ==================================
-- 11. REGISTROS DE CALIFICACIONES DE EJEMPLO
-- ==================================
INSERT INTO "Grade_Record" (
    "studentId", "subjectId", "gradeId", "score", "maxScore", "gradeType",
    "evaluationDate", "academicPeriod", "comments", "recordStatus"
) VALUES
-- Diego - 3ro Primaria
(1, 1, 3, 18.5, 20.0, 'Examen', '2024-03-15', '2024-I', 'Excelente trabajo en matemática', true),
(1, 2, 3, 16.0, 20.0, 'Tarea', '2024-03-18', '2024-I', 'Buena comprensión lectora', true),
(1, 6, 3, 19.0, 20.0, 'Proyecto', '2024-03-20', '2024-I', 'Creatividad excepcional', true),

-- Sofía - 3ro Primaria
(2, 1, 3, 17.5, 20.0, 'Examen', '2024-03-15', '2024-I', 'Muy buena en cálculos', true),
(2, 2, 3, 18.0, 20.0, 'Tarea', '2024-03-18', '2024-I', 'Excelente expresión oral', true),
(2, 6, 3, 17.0, 20.0, 'Proyecto', '2024-03-20', '2024-I', 'Buen trabajo artístico', true),

-- Mateo - 4to Primaria
(3, 1, 4, 15.5, 20.0, 'Examen', '2024-03-15', '2024-I', 'Necesita práctica en fracciones', true),
(3, 2, 4, 16.5, 20.0, 'Tarea', '2024-03-18', '2024-I', 'Buena redacción', true),

-- Leonardo - 1ro Secundaria
(9, 1, 7, 14.5, 20.0, 'Examen', '2024-03-15', '2024-I', 'Debe mejorar en álgebra', true),
(9, 11, 7, 16.0, 20.0, 'Laboratorio', '2024-03-22', '2024-I', 'Buen trabajo experimental', true),
(9, 14, 7, 17.5, 20.0, 'Ensayo', '2024-03-25', '2024-I', 'Análisis histórico adecuado', true),

-- Mía - 1ro Secundaria
(10, 1, 7, 18.0, 20.0, 'Examen', '2024-03-15', '2024-I', 'Excelente en matemáticas', true),
(10, 11, 7, 17.0, 20.0, 'Laboratorio', '2024-03-22', '2024-I', 'Muy buena experimentación', true),
(10, 14, 7, 16.5, 20.0, 'Ensayo', '2024-03-25', '2024-I', 'Buena investigación histórica', true)
ON CONFLICT DO NOTHING;

-- Rehabilitar triggers
SET session_replication_role = DEFAULT;

COMMIT;

-- ==================================
-- 12. VERIFICAR DATOS INSERTADOS
-- ==================================
SELECT 
    'Roles' as tabla, COUNT(*) as registros FROM "Role"
UNION ALL
SELECT 
    'Grados' as tabla, COUNT(*) as registros FROM "Grade"
UNION ALL
SELECT 
    'Materias' as tabla, COUNT(*) as registros FROM "Subject"
UNION ALL
SELECT 
    'Usuarios' as tabla, COUNT(*) as registros FROM "User"
UNION ALL
SELECT 
    'Profesores' as tabla, COUNT(*) as registros FROM "Teacher"
UNION ALL
SELECT 
    'Estudiantes' as tabla, COUNT(*) as registros FROM "Student"
UNION ALL
SELECT 
    'Calificaciones' as tabla, COUNT(*) as registros FROM "Grade_Record";

-- Mostrar algunos datos de ejemplo
SELECT 
    u."userFirstName" || ' ' || u."userFirstLastName" as nombre,
    r."roleName" as rol,
    u."userEmail" as email
FROM "User" u
JOIN "Role" r ON u."userRoleId" = r."roleId"
ORDER BY r."roleId", u."userFirstName";