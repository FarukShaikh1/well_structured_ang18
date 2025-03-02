ALTER PROCEDURE [dbo].[CommonListItem_Get]             
 @in_CommonListId UNIQUEIDENTIFIER             
AS            
            
DECLARE @Err INTEGER            
             
 SELECT             
  [cli].[CommonListItemId],            
  [cli].[ListItemName],            
  [cli].ListItemDescription,      
  [cli].SequenceNumber,      
  [u].[FirstName] + ' ' + [u].[LastName] AS UpdatedBy,            
  --[cli].[UpdatedOn],            
  [dbo].[udf_CheckListItemExist](@in_CommonListId, CommonListItemId) AS IsUsed        
        
 FROM [dbo].[CommonListItem] [cli] WITH(NOLOCK)            
 INNER JOIN [dbo].[CommonList] [cl] WITH(NOLOCK) ON [cl].[CommonListId] = [cli].[CommonListId]            
 LEFT JOIN [dbo].[User] [u] WITH(NOLOCK) ON [u].[UserId] = [cli].[UpdatedBy]            
            
 WHERE ISNULL([cl].[IsDeleted],0) = 0 AND ISNULL([cli].[IsDeleted],0) = 0            
    AND [cl].[CommonListId] = @in_CommonListId            
 ORDER BY [cli].[SequenceNumber]            
            
SET @Err = @@Error            
IF @Err <> 0            
BEGIN            
 RAISERROR (@Err,16,1)            
 RETURN -100            
END            
RETURN 