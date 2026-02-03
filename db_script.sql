USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PatientDB')
BEGIN
    CREATE DATABASE PatientDB;
END
GO

USE PatientDB;
GO

-- Create Patient Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Patient')
BEGIN
    CREATE TABLE Patient (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FirstName VARCHAR(50) NULL,
        MiddleName VARCHAR(50) NULL,
        LastName VARCHAR(50) NOT NULL,
        SuffixName VARCHAR(10) NULL,
        BirthDate DATETIME NULL,
        Gender VARCHAR(10) NULL,
        InitialDiagnosis VARCHAR(500) NOT NULL,
        PatientNo VARCHAR(8) NULL UNIQUE -- Will be populated by SP
    );
END
GO

-- SP: Get All Patients
CREATE OR ALTER PROCEDURE sp_GetAllPatients
AS
BEGIN
    SELECT * FROM Patient ORDER BY Id DESC;
END
GO

-- SP: Get Patient By Id
CREATE OR ALTER PROCEDURE sp_GetPatientById
    @Id INT
AS
BEGIN
    SELECT * FROM Patient WHERE Id = @Id;
END
GO

-- SP: Create Patient
CREATE OR ALTER PROCEDURE sp_CreatePatient
    @FirstName VARCHAR(50),
    @MiddleName VARCHAR(50) = NULL,
    @LastName VARCHAR(50),
    @SuffixName VARCHAR(10) = NULL,
    @BirthDate DATETIME = NULL,
    @Gender VARCHAR(10) = NULL,
    @InitialDiagnosis VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @NewId INT;

    -- Insert without PatientNo first
    INSERT INTO Patient (FirstName, MiddleName, LastName, SuffixName, BirthDate, Gender, InitialDiagnosis)
    VALUES (@FirstName, @MiddleName, @LastName, @SuffixName, @BirthDate, @Gender, @InitialDiagnosis);

    -- Get the generated Identity
    SET @NewId = SCOPE_IDENTITY();

    -- Update PatientNo based on the new ID (Format 00000000)
    UPDATE Patient
    SET PatientNo = RIGHT('00000000' + CAST(@NewId AS VARCHAR(10)), 8)
    WHERE Id = @NewId;

    -- Return the created record
    SELECT * FROM Patient WHERE Id = @NewId;
END
GO

-- SP: Update Patient
CREATE OR ALTER PROCEDURE sp_UpdatePatient
    @Id INT,
    @FirstName VARCHAR(50),
    @MiddleName VARCHAR(50) = NULL,
    @LastName VARCHAR(50),
    @SuffixName VARCHAR(10) = NULL,
    @BirthDate DATETIME = NULL,
    @Gender VARCHAR(10) = NULL,
    @InitialDiagnosis VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Patient
    SET FirstName = @FirstName,
        MiddleName = @MiddleName,
        LastName = @LastName,
        SuffixName = @SuffixName,
        BirthDate = @BirthDate,
        Gender = @Gender,
        InitialDiagnosis = @InitialDiagnosis
    WHERE Id = @Id;
END
GO

-- SP: Delete Patient
CREATE OR ALTER PROCEDURE sp_DeletePatient
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Patient WHERE Id = @Id;
END
GO
