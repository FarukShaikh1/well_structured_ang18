ALTER PROCEDURE [dbo].[BirthdayInfo_Add]   
@in_BirthDate DATE,                  
@in_PersonName NVARCHAR(MAX),                  
@in_Address NVARCHAR(MAX) = NULL,                  
@In_MobileNumber2 VARCHAR(50) = NULL,                  
@In_MobileNumber VARCHAR(50) = NULL,                  
@in_EmailId VARCHAR(100) = NULL,         
@in_Gender CHAR(1) = 'M',    
@In_DayTypeId UNIQUEIDENTIFIER,                 
@in_UserId UNIQUEIDENTIFIER,                  
@in_assetId UNIQUEIDENTIFIER = NULL,                  
@Out_BirthdayId UNIQUEIDENTIFIER OUT                  
AS                  
BEGIN                  
    DECLARE @IsVerified BIT = 0;                  
    SET @Out_BirthdayId = NEWID();  
                  
    IF @in_UserId IS NULL  
        SET @IsVerified = 1;                  
                  
    BEGIN TRANSACTION BirthdayInfo;                 
                  
    BEGIN TRY                  
        INSERT INTO BirthdayRecords (                  
            BirthdayId,  
            Birthdate,                  
            PersonName,                  
            Address,                  
            MobileNumber2,                  
            MobileNumber,                 
            EmailId,             
            Gender,    
            DayTypeId,                  
            AssetId,                  
            CreatedBy,                  
            CreatedOn,                  
            IsVerified,                  
            IsRestricted                  
        )                  
        VALUES (                  
            @Out_BirthdayId,  
            @in_Birthdate,                  
            @in_PersonName,                  
            @in_Address,                  
            @In_MobileNumber2,                  
            @In_MobileNumber,                 
            @in_EmailId,       
            @in_Gender,    
            @In_DayTypeId,                  
            @in_assetId,                  
            @in_UserId,                  
            GETDATE(),                  
            @IsVerified,                  
            1                  
        );                  
                  
        IF ISNULL(@in_EmailId, '') <> ''                  
        BEGIN                  
            IF @IsVerified = 1                  
            AND NOT EXISTS (SELECT 1 FROM [User] WHERE UserName = @in_EmailId)                  
            BEGIN                  
                EXEC [User_Add] @Out_BirthdayId, @in_EmailId, @in_UserId;                  
            END                  
        END;                    
                  
        COMMIT TRANSACTION BirthdayInfo;                  
    END TRY                  
                  
    BEGIN CATCH                  
        ROLLBACK TRANSACTION BirthdayInfo;                 
    END CATCH;                  
                  
END;  