CREATE PROCEDURE [dbo].[BirthdayInfo_Update] @in_BirthdayId UNIQUEIDENTIFIER,                    
    @in_BirthDate DATE,                    
    @in_PersonName NVARCHAR(MAX),                    
    @in_Address NVARCHAR(MAX)=NULL,                    
    @In_MobileNumber2 VARCHAR(50) = NULL,                    
    @in_MobileNumber VARCHAR(50) = NULL,                    
    @in_EmailId VARCHAR(100) = NULL,                    
 @in_Gender CHAR = 'M',    
    @In_DayTypeId UNIQUEIDENTIFIER = '204C4109-E215-409C-8F73-2A98729D9B75', --by Default Birthday                                         
    @in_UserId UNIQUEIDENTIFIER,                    
    @in_AssetId UNIQUEIDENTIFIER=null             
    --@in_IsRestricted BIT = 0                             
AS                    
BEGIN                    
    DECLARE @UserName VARCHAR(100)                    
    DECLARE @UserId UNIQUEIDENTIFIER = NULL                    
    DECLARE @isVerified BIT = 0                
    --IF @in_UserId <= 0                
    --    SET @isVerified = 1                
                
    SELECT TOP 1 @UserName = EmailId                    
    FROM BirthdayRecords                    
    WHERE BirthdayId = @in_BirthdayId                    
                    
    SELECT TOP 1 @UserId = UserId                    
    FROM [User]                    
    WHERE UserName = @in_EmailId                    
                    
    UPDATE BirthdayRecords                    
    SET Birthdate = @in_BirthDate,                    
    PersonName = @in_PersonName,                    
    Address = @in_Address,                                    
    MobileNumber2 = @In_MobileNumber2,                    
    MobileNumber = @in_MobileNumber,                    
    DayTypeId = @In_DayTypeId,      
 Gender = @in_Gender,    
    ModifiedBy = @in_UserId,                    
    ModifiedOn = GETDATE(),                    
    IsVerified = @isVerified,                    
    --IsRestricted = @in_IsRestricted,                                      
    AssetId = @in_AssetId                    
    WHERE BirthdayId = @in_BirthdayId                    
                    
    IF @UserName IS NULL AND ISNULL(@in_EmailId, '') <> ''      --Add new email in birthday              
    BEGIN                    
        UPDATE BirthdayRecords SET EmailId = @in_EmailId WHERE BirthdayId = @in_BirthdayId                    
                     
        IF @isVerified = 1  AND NOT EXISTS (SELECT 1 FROM [User] WHERE UserName = @in_EmailId)               
        BEGIN                    
            EXEC [User_Add] @in_BirthdayId,@in_EmailId,@in_UserId                    
        END                    
    END                    
    ELSE IF @isVerified = 1               
    AND @UserName IS NOT NULL               
    AND @UserName = @in_EmailId               
    AND NOT EXISTS (SELECT 1 FROM [User] WHERE UserName = @in_EmailId)               
    BEGIN                    
        EXEC [User_Add] @in_BirthdayId,@in_EmailId,@in_UserId                    
    END                    
    ELSE IF @isVerified = 1               
    AND @UserName IS NOT NULL               
    AND @UserName <> @in_EmailId               
    AND NOT EXISTS (SELECT 1 FROM [User] WHERE UserName = @in_EmailId) -- need to verify this condtions with more scenarios              
    BEGIN                    
        UPDATE BirthdayRecords SET EmailId = @in_EmailId WHERE BirthdayId = @in_BirthdayId                    
        UPDATE [User] SET [UserName] = @in_EmailId, EmailAddr = @in_EmailId WHERE UserName = @UserName                  
    END                    
END 