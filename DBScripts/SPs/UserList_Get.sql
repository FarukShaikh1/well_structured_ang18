ALTER PROCEDURE [dbo].[UserList_Get]                
AS                
                
 DECLARE @Err INTEGER                
 --DECLARE @showUnlockFeature INT =1                
 SELECT                
   usr.UserId                 
  ,ISNULL(usr.FirstName,'') AS FirstName    
  ,ISNULL(usr.LastName,'') AS LastName    
  ,usr.EmailAddr AS EmailAddress                
  ,usr.Password                
  ,usr.UserName                
  ,r.RoleDescription AS RoleName                
  ,[u].[FirstName] +' ' + [u].[LastName] As ModifiedBy                
  ,usr.ModifiedOn                
  ,CAST(CASE WHEN usr.LockExpiryDate IS NOT NULL THEN 1 ELSE 0 END AS BIT) As IsLocked --IsUserLocked                
  --,CAST(CASE  WHEN @showUnlockFeature =1 THEN  1 ELSE 0 END AS BIT ) AS ShowUnlockOpt                 
 FROM [dbo].[User] usr                
  LEFT JOIN dbo.BirthdayRecords emp WITH(NOLOCK) ON emp.BirthdayId = usr.BirthdayId                
  LEFT JOIN dbo.UserRoles role WITH(NOLOCK) ON role.UserId = usr.UserId                
  LEFT JOIN dbo.Roles r WITH(NOLOCK) ON r.RoleId = role.RoleId                
  LEFT JOIN [dbo].[User] [u] WITH(NOLOCK) ON [usr].[ModifiedBy] = [u].[UserId]                
 WHERE usr.IsDeleted = 0                
 ORDER BY emp.PersonName ASC                
                 
SET @Err = @@Error                
IF @Err <> 0                
BEGIN                
 RAISERROR (@Err,16,1)                
 RETURN -100                
END                
RETURN 