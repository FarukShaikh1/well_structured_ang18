ALTER PROCEDURE [dbo].[UserDetails_Update]        
(            
    @in_UserId    UNIQUEIDENTIFIER,         
    @in_EmailAddress  NVARCHAR(60),        
    @in_FirstName   NVARCHAR(256),        
    @in_LastName   NVARCHAR(60),        
    @in_MobileNumber  NVARCHAR(60),        
    @in_RoleName   NVARCHAR(120),        
    @in_ModifiedBy UNIQUEIDENTIFIER
)         
AS        
        
DECLARE @IsSuccess BIT = 0, @PersonId UNIQUEIDENTIFIER;        
        
SELECT         
@PersonId = u.BirthdayId      
FROM [User] u      
WHERE u.UserId = @in_UserId      
AND u.IsDeleted = 0       
      
--update user name        
UPDATE [dbo].[User]         
SET          
FirstName = @in_FirstName,        
LastName = @in_LastName,        
ModifiedOn = GETDATE(),        
ModifiedBy  = @in_ModifiedBy        
WHERE UserId = @in_UserId         
AND IsDeleted = 0;        
        
--update employee name        
UPDATE dbo.BirthdayRecords SET PersonName = CONCAT(@in_FirstName, ' ',@in_lastName) WHERE BirthdayId = @PersonId      
        
        
--update the user role        
IF LEN(@in_RoleName) > 0        
BEGIN        
DECLARE @RoleId UNIQUEIDENTIFIER = null;        
SELECT TOP 1 @RoleId = RoleId FROM dbo.Roles WITH(NOLOCK)         
WHERE RoleDescription = @in_RoleName AND IsDeleted = 0;        
        
IF EXISTS(SELECT 1 FROM dbo.UserRoles WITH(NOLOCK) WHERE UserId = @in_UserId)        
BEGIN        
UPDATE dbo.UserRoles SET RoleId = @RoleId        
WHERE UserId = @in_UserId        
END        
ELSE        
BEGIN        
INSERT INTO dbo.UserRoles(UserId, RoleId)        
VALUES(@in_UserId, @RoleId)        
END        
END        
          
SET @IsSuccess = 1        
SELECT  @IsSuccess AS IsSuccess        
        
RETURN  