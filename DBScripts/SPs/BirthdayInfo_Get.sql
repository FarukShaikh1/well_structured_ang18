CREATE PROCEDURE [dbo].[BirthdayInfo_Get]                               
@in_BirthdayId UNIQUEIDENTIFIER,                                
@in_UserId UNIQUEIDENTIFIER  
AS                                
BEGIN                                
    SELECT br.BirthdayId,                                 
    Birthdate,                                 
    PersonName,                              
    ISNULL(Address, '') AS Address,                                 
    SuperAdminRelationId,                              
 RelationShipName,                              
 MobileNumber2,                              
 MobileNumber,                              
 EmailId,                
 Gender,      
 br.DayTypeId AS DayTypeId,                               
 cli.listItemName,                             
 br.AssetId AS AssetId,                        
 ISNULL(a.AssetType, '') AS AssetType,                        
    IsVerified,                                
    IsRestricted,                               
 dbo.IsEditable('Birthday', @in_UserId, br.BirthdayId) AS IsEditable,                
 dbo.IsApprovable('Birthday', @in_UserId, br.BirthdayId) AS IsApprovable,                                       
br.CreatedOn AS CreatedOn,                    
  u.UserName AS CreatedBy,                    
  br.ModifiedOn AS ModifiedOn,                    
  u2.UserName AS ModifiedBy                    
 FROM BirthdayRecords br                              
 LEFT  JOIN CommonListItem cli                              
 ON br.DayTypeId = cli.CommonListItemId                              
 LEFT JOIN Asset a ON a.AssetId = br.AssetId                        
  LEFT JOIN [User] u                    
 ON u.UserId = br.CreatedBy                    
 LEFT JOIN [user] u2                    
 ON u2.UserId = br.ModifiedBy                    
 WHERE br.BirthdayId = @in_BirthdayId                                
END 