ALTER PROCEDURE [dbo].[UserDetails_Get]                
    @in_UserId  UNIQUEIDENTIFIER
AS                
                
DECLARE @Err INTEGER                
 SELECT                 
   u.UserId                
  ,emp.BirthdayId AS PersonId         
  ,CONCAT(emp.PersonName, ' (', FORMAT(emp.Birthdate,'dd-MMMM'), ')') AS NameWithDob        
  ,u.UserName                
  ,u.Password                
  ,u.EmailAddr As EmailAddress                
  ,MobileNumber As MobileNumber                
  ,ISNULL(emp.PersonName,'') As PersonName                
  ,ISNULL(u.FirstName,'') As FirstName                
  ,ISNULL(u.LastName,'') As LastName                
  ,ISNULL(r.RoleName,'') As RoleName                
  ,ISNULL(MobileNumber2,'') AS MobileNumber2  
  ,ISNULL(m.FirstName,'') + ' ' + ISNULL(m.LastName,'') As "ModifiedBy"                
  ,u.ModifiedOn                
 FROM [dbo].[User] u WITH(NOLOCK)                
 LEFT JOIN [dbo].BirthdayRecords emp WITH(NOLOCK) ON emp.BirthdayId = u.BirthdayId
 LEFT JOIN [dbo].[User] m WITH(NOLOCK) ON m.UserId = u.ModifiedBy                
 LEFT JOIN [dbo].[UserRoles] ur WITH(NOLOCK) ON ur.UserId = u.UserId                
 LEFT JOIN [dbo].[Roles] r WITH(NOLOCK) ON r.RoleId = ur.RoleId AND r.IsDeleted = 0                
 WHERE u.UserId  = @in_UserId AND u.IsDeleted = 0                
 --AND m.UserId = @in_UserId       
SET @Err = @@Error                
IF @Err <> 0                
BEGIN                
 RAISERROR (@Err,16,1)                
 RETURN -100                
END                
RETURN    