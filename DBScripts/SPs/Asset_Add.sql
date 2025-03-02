CREATE PROCEDURE [dbo].[Asset_Add]  
(  
  @in_AssetType NVARCHAR(50),  
  @in_UploadedFileName NVARCHAR(200),  
  @in_OriginalPath NVARCHAR(500),  
  @in_ThumbailImagePath NVARCHAR(200),    
  @in_PreviewImagePath NVARCHAR(200),  
  @in_ContentType NVARCHAR(100),  
  @in_IsNonSecuredFile BIT = NULL,    
  @in_UserId UNIQUEIDENTIFIER,    
  @out_AssetId UNIQUEIDENTIFIER OUT    
) AS  
BEGIN  

SET @out_AssetId = NEWID()

INSERT INTO [dbo].[Asset]  
           (
		   AssetId,
		   [AssetType]  
           ,[UploadedFileName]  
           ,[OriginalPath]  
           ,[ThumbailPath]             
           ,[PreviewPath]  
     ,[ContentType]       
           ,[CreatedOn]  
     ,[CreatedBy]  
           ,[ModifiedOn]  
     ,[ModifiedBy]  
     ,[IsNonSecuredFile])  
     VALUES  
           (
		   @out_AssetId,
		   @in_AssetType  
           ,@in_UploadedFileName  
           ,@in_OriginalPath  
           ,@in_ThumbailImagePath  
           ,@in_PreviewImagePath             
     ,@in_ContentType       
           ,SYSDATETIMEOFFSET()  
     ,@in_UserId  
           ,NULL  
     ,NULL  
     ,@in_IsNonSecuredFile)    
END  