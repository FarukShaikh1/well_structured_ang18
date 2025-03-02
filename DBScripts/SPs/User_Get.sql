ALTER PROCEDURE [dbo].[User_Get] --  0,Null,'SuperAdmin'                  
 @in_UserName NVARCHAR(120) = NULL,                                      
 @in_PassWord    NVARCHAR(120) = NULL                                      
AS                                      
BEGIN                                      
 DECLARE @Err INTEGER, @IsActive BIT = 1;                             
 DECLARE @UserName NVARCHAR(120),@Password NVARCHAR(120)                                      
 DECLARE @ReturnMsg NVARCHAR(100)                                      
                                      
                                          
 SET @UserName = (SELECT TOP 1 UserName from [User](NOLOCK) WHERE UserName = @in_UserName AND IsDeleted = 0);                                      
 SET @Password = (SELECT TOP 1 password from [User](NOLOCK) WHERE UserName = @in_UserName AND IsDeleted = 0);                                      
                                      
IF (ISNULL(@in_UserName,'') <> ISNULL(@UserName,'')) AND (isnull(@in_PassWord,'') <> ISNULL(@Password,''))                                     
BEGIN                                      
  SET @ReturnMsg = 'Invalid logon credentials, Try again.'                                      
End                              
        
BEGIN                                       
 SELECT TOP 1                                    
u.UserId as UserId,                                      
   birthdayId as BirthdayId,                                      
   u.FirstName,                                      
   u.LastName,                                      
   u.EmailAddr,                                      
   u.UserName,                                      
   u.password,                                      
   u.PasswordLastChangedOn As PasswordLastChangeDate,                                      
   ISNULL(NULL,0) AS ProfilePicAssetId,                                      
   ISNULL(NULL,0) AS GroupLogoAssetId,                                     
   0 AS GroupCountryId,                                 
   CAST(1 AS BIT) AS IsActive ,        
   Lower(r.RoleName) RoleName        
  FROM [dbo].[User] u WITH(NOLOCK)         
  INNER JOIN UserRoles ur WITH(NOLOCK) ON u.UserId = ur.UserId        
  INNER JOIN Roles r ON ur.RoleId = r.RoleId        
  WHERE u.UserName = @in_UserName --AND u.Password = @in_PassWord       
  AND u.IsDeleted = 0                                      
END                                      
                                       
SET @Err = @@Error                                      
IF @Err <> 0                                      
 BEGIN                                       
 RAISERROR (@Err,16,1)                                      
  RETURN -100                                      
END                                      
 SELECT  @ReturnMsg as Msg;                                      
END 