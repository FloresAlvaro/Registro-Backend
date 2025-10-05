-- CreateTable
CREATE TABLE "public"."Role" (
    "roleId" SERIAL NOT NULL,
    "roleName" VARCHAR(255) NOT NULL,
    "roleStatus" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "public"."Grade" (
    "gradeId" SERIAL NOT NULL,
    "gradeLevel" VARCHAR(255) NOT NULL,
    "gradeDescription" VARCHAR(255) NOT NULL,
    "gradeStatus" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("gradeId")
);

-- CreateTable
CREATE TABLE "public"."Subject" (
    "subjectID" SERIAL NOT NULL,
    "subjectName" VARCHAR(255) NOT NULL,
    "subjectDescription" VARCHAR(255) NOT NULL,
    "subjectStatus" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("subjectID")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "userId" SERIAL NOT NULL,
    "userFirstName" VARCHAR(255) NOT NULL,
    "userSecondName" VARCHAR(255),
    "userFirstLastName" VARCHAR(255) NOT NULL,
    "userSecondLastName" VARCHAR(255),
    "userEmail" VARCHAR(255) NOT NULL,
    "userCI" INTEGER NOT NULL,
    "userPassword" VARCHAR(255) NOT NULL,
    "userDateOfBirth" DATE NOT NULL,
    "userAddress" TEXT,
    "userPhoneNumber" VARCHAR(20),
    "userRoleId" INTEGER NOT NULL,
    "userStatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "studentId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "public"."Teacher" (
    "teacherId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "teacherExperienceYears" INTEGER NOT NULL,
    "teacherLicenseNumber" VARCHAR(50) NOT NULL,
    "teacherHours" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacherId")
);

-- CreateTable
CREATE TABLE "public"."TeacherGrade" (
    "teacherGradeId" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,

    CONSTRAINT "TeacherGrade_pkey" PRIMARY KEY ("teacherGradeId")
);

-- CreateTable
CREATE TABLE "public"."GradeSubject" (
    "gradeSubjectId" SERIAL NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "GradeSubject_pkey" PRIMARY KEY ("gradeSubjectId")
);

-- CreateTable
CREATE TABLE "public"."TeacherSubject" (
    "teacherSubjectId" SERIAL NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY ("teacherSubjectId")
);

-- CreateTable
CREATE TABLE "public"."Grade_Record" (
    "gradeRecordId" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "score" DECIMAL(5,2) NOT NULL,
    "maxScore" DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    "gradeType" VARCHAR(50) NOT NULL,
    "evaluationDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "academicPeriod" VARCHAR(50) NOT NULL,
    "comments" TEXT,
    "recordStatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Grade_Record_pkey" PRIMARY KEY ("gradeRecordId")
);

-- CreateTable
CREATE TABLE "public"."StudentTeacherSubject" (
    "studentTeacherSubjectId" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "academicPeriod" VARCHAR(50) NOT NULL,
    "assignmentDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "StudentTeacherSubject_pkey" PRIMARY KEY ("studentTeacherSubjectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "public"."User"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_userCI_key" ON "public"."User"("userCI");

-- CreateIndex
CREATE INDEX "user_userroleid_index" ON "public"."User"("userRoleId");

-- CreateIndex
CREATE INDEX "user_userci_index" ON "public"."User"("userCI");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "public"."Student"("userId");

-- CreateIndex
CREATE INDEX "student_userid_index" ON "public"."Student"("userId");

-- CreateIndex
CREATE INDEX "student_gradeid_index" ON "public"."Student"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "public"."Teacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_teacherLicenseNumber_key" ON "public"."Teacher"("teacherLicenseNumber");

-- CreateIndex
CREATE INDEX "teacher_userid_index" ON "public"."Teacher"("userId");

-- CreateIndex
CREATE INDEX "teacher_license_index" ON "public"."Teacher"("teacherLicenseNumber");

-- CreateIndex
CREATE INDEX "teachergrade_teacherid_index" ON "public"."TeacherGrade"("teacherId");

-- CreateIndex
CREATE INDEX "teachergrade_gradeid_index" ON "public"."TeacherGrade"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherGrade_teacherId_gradeId_key" ON "public"."TeacherGrade"("teacherId", "gradeId");

-- CreateIndex
CREATE INDEX "gradesubject_gradeid_index" ON "public"."GradeSubject"("gradeId");

-- CreateIndex
CREATE INDEX "gradesubject_subjectid_index" ON "public"."GradeSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "GradeSubject_gradeId_subjectId_key" ON "public"."GradeSubject"("gradeId", "subjectId");

-- CreateIndex
CREATE INDEX "teachersubject_teacherid_index" ON "public"."TeacherSubject"("teacherId");

-- CreateIndex
CREATE INDEX "teachersubject_subjectid_index" ON "public"."TeacherSubject"("subjectId");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubject_teacherId_subjectId_key" ON "public"."TeacherSubject"("teacherId", "subjectId");

-- CreateIndex
CREATE INDEX "graderecord_studentid_index" ON "public"."Grade_Record"("studentId");

-- CreateIndex
CREATE INDEX "graderecord_subjectid_index" ON "public"."Grade_Record"("subjectId");

-- CreateIndex
CREATE INDEX "graderecord_gradeid_index" ON "public"."Grade_Record"("gradeId");

-- CreateIndex
CREATE INDEX "studentteachersubject_studentid_index" ON "public"."StudentTeacherSubject"("studentId");

-- CreateIndex
CREATE INDEX "studentteachersubject_teacherid_index" ON "public"."StudentTeacherSubject"("teacherId");

-- CreateIndex
CREATE INDEX "studentteachersubject_subjectid_index" ON "public"."StudentTeacherSubject"("subjectId");

-- CreateIndex
CREATE INDEX "studentteachersubject_gradeid_index" ON "public"."StudentTeacherSubject"("gradeId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentTeacherSubject_studentId_teacherId_subjectId_academi_key" ON "public"."StudentTeacherSubject"("studentId", "teacherId", "subjectId", "academicPeriod");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "public"."Role"("roleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeacherGrade" ADD CONSTRAINT "TeacherGrade_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeacherGrade" ADD CONSTRAINT "TeacherGrade_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GradeSubject" ADD CONSTRAINT "GradeSubject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GradeSubject" ADD CONSTRAINT "GradeSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeacherSubject" ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TeacherSubject" ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Grade_Record" ADD CONSTRAINT "Grade_Record_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Grade_Record" ADD CONSTRAINT "Grade_Record_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Grade_Record" ADD CONSTRAINT "Grade_Record_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTeacherSubject" ADD CONSTRAINT "StudentTeacherSubject_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("studentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTeacherSubject" ADD CONSTRAINT "StudentTeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."Teacher"("teacherId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTeacherSubject" ADD CONSTRAINT "StudentTeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("subjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentTeacherSubject" ADD CONSTRAINT "StudentTeacherSubject_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "public"."Grade"("gradeId") ON DELETE RESTRICT ON UPDATE CASCADE;
