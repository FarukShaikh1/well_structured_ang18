ALTER PROCEDURE [dbo].[Roles_Get]          
@in_UserId  UNIQUEIDENTIFIER         
AS          
BEGIN          
           
    DECLARE @NASystemAdmin NVARCHAR(120) = 'Super Admin,System Admin'          
    DECLARE @NARoles NVARCHAR(500) = IIF(@in_UserId IS NOT NULL, IIF(@in_UserId = null, @NASystemAdmin, ''), '')           
           
    SELECT    DISTINCT       
    --r.RoleId,          
    r.RoleName,          
    r.RoleDescription          
    FROM [dbo].[Roles] r WITH(NOLOCK)          
    --INNER JOIN UserRoles ur      
    --ON r.RoleId = ur.RoleId      
    WHERE   
 --ur.UserId = @in_UserId AND   
 ISNULL(r.IsDeleted,0) = 0           
    AND r.RoleName NOT IN(SELECT items FROM dbo.SplitWithIndex(@NARoles, ','))          
          
END   