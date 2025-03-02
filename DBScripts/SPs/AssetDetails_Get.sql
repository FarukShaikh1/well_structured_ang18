CREATE PROCEDURE [dbo].[AssetDetails_Get]    
(    
  @in_AssetId UNIQUEIDENTIFIER      
) AS    
BEGIN    
    
SELECT [AssetID]    
      ,[AssetType]    
      ,[UploadedFileName]    
      ,[OriginalPath]    
      ,[ThumbailPath]          
      ,[PreviewPath]    
   ,[ContentType]    
      ,[CreatedOn]    
   ,[CreatedBy]    
      ,[ModifiedOn]    
   ,[ModifiedBy]    
   ,[IsNonSecuredFile]    
  FROM [dbo].[Asset] WITH(NOLOCK)    
  WHERE AssetID = @in_AssetId    
    
END 