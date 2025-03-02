ALTER FUNCTION [dbo].[GetExpenseDescriptions](        
    @in_UserId UNIQUEIDENTIFIER,                                                        
    @in_FromDate DATETIME = NULL,                                                        
    @in_ToDate DATETIME = NULL,                                                      
    @in_SourceOrReason VARCHAR(MAX) = NULL,                                                      
    @in_MinAmount DECIMAL = 0,                                                      
    @in_MaxAmount DECIMAL = 0,                                  
 @in_ModeOfTransaction VARCHAR(MAX)='')        
 RETURNS VARCHAR(MAX)        
 AS        
 BEGIN         
DECLARE @Description NVARCHAR(MAX) =''  ;      
      
WITH CTE AS      
(      
 SELECT DISTINCT Description ,0 AS ExpenseId      
 FROM Expenses      
 WHERE CreatedBy = @in_UserId                        
 AND (@in_FromDate IS NULL OR ExpenseDate >= @in_FromDate)                                 
 AND (@in_ToDate IS NULL OR ExpenseDate <= @in_ToDate)                                
 AND ISNULL(IsDeleted,0)=0        
 AND Description <>''    
 AND ((ISNULL(@in_SourceOrReason,'')='') OR SourceOrReason IN (SELECT items FROM dbo.SplitWithIndex(@in_SourceOrReason, ','))     
 OR Description LIKE '%'+@in_SourceOrReason+'%' OR SourceOrReason LIKE '%'+@in_SourceOrReason+'%')                      
 AND (ISNULL(@in_MinAmount,0)=0 OR @in_MinAmount <= ABS(TotalAmount))                                
 AND (ISNULL(@in_MaxAmount,0)=0 OR @in_MaxAmount >= ABS(TotalAmount))      
)      
SELECT @Description = STUFF((SELECT ' '+ CONCAT('   (',ROW_NUMBER() OVER (PARTITION BY ExpenseId ORDER BY Description),')', Description) FROM CTE        
FOR XML PATH('')), 1, 2, '')        
        
RETURN REPLACE(@Description,'&amp;', '&')        
        
 END 