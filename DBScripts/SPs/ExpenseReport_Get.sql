ALTER PROCEDURE [dbo].[ExpenseReport_Get]                                                            
    @in_UserId UNIQUEIDENTIFIER,                                                            
    @in_FromDate DATETIME = NULL,                                                            
    @in_ToDate DATETIME = NULL,                                                          
    @in_SourceOrReason VARCHAR(MAX) = NULL,                                                          
    @in_Purpose VARCHAR(200) = NULL,                                                          
    @in_MinAmount DECIMAL = 0,                                                          
    @in_MaxAmount DECIMAL = 0,                                      
 @in_ModeOfTransaction VARCHAR(MAX)='',                                   
 --@in_SearchText VARCHAR(MAX)=''             ,                      
 @in_IsDownload BIT = 0                      
AS                                                            
BEGIN                                                            
    SET NOCOUNT ON                                           
    SELECT                                         
 dbo.ExpenseFirstDate(@in_UserId,@in_FromDate,@in_ToDate,SourceOrReason,@in_MinAmount,@in_MaxAmount,@in_ModeOfTransaction) AS FirstDate,            
 dbo.ExpenseLastDate(@in_UserId,@in_FromDate,@in_ToDate,SourceOrReason,@in_MinAmount,@in_MaxAmount,@in_ModeOfTransaction) AS LastDate,            
 SourceOrReason,            
 --Purpose,      
 SUM(CASE WHEN Cash>0 then Cash else 0 END             
 + CASE WHEN  SBIAccount > 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  CBIAccount > 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  Other > 0 THEN Other ELSE 0 END) AS TakenAmount,            
            
 SUM(CASE WHEN Cash < 0 then Cash else 0 END             
 + CASE WHEN  SBIAccount < 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  CBIAccount < 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  Other < 0 THEN Other ELSE 0 END) AS GivenAmount,            
            
 (SUM(CASE WHEN Cash>0 then Cash else 0 END             
 + CASE WHEN  SBIAccount > 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  CBIAccount > 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  Other > 0 THEN Other ELSE 0 END)            
 +SUM(CASE WHEN Cash < 0 then Cash else 0 END             
 + CASE WHEN  SBIAccount < 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  CBIAccount < 0 THEN SBIAccount ELSE 0 END            
 + CASE WHEN  Other < 0 THEN Other ELSE 0 END)) AS TotalAmount,            
 --COALESCE(Description + ',', '')            
 dbo.GetExpenseDescriptions(@in_UserId,@in_FromDate,@in_ToDate,SourceOrReason,@in_MinAmount,@in_MaxAmount,@in_ModeOfTransaction) AS Descriptions,  
 --'' AS Descriptions       ,     
 --dbo.GetExpensePurposes(@in_UserId,@in_FromDate,@in_ToDate,SourceOrReason,@in_MinAmount,@in_MaxAmount,@in_ModeOfTransaction) AS Purpose            
'' AS Purpose  
    FROM Expenses (NOLOCK)                                                      
    WHERE CreatedBy = @in_UserId                            
    AND (@in_FromDate IS NULL OR ExpenseDate >= @in_FromDate)                                     
    AND (@in_ToDate IS NULL OR ExpenseDate <= @in_ToDate)                                    
    AND ISNULL(IsDeleted,0)=0            
    AND ((ISNULL(@in_SourceOrReason,'')='') OR SourceOrReason IN (SELECT items FROM dbo.SplitWithIndex(@in_SourceOrReason, ',')) OR SourceOrReason LIKE '%'+@in_SourceOrReason+'%')                          
    AND (ISNULL(@in_MinAmount,0)=0 OR @in_MinAmount <= ABS(TotalAmount))                                    
    AND (ISNULL(@in_MaxAmount,0)=0 OR @in_MaxAmount >= ABS(TotalAmount))                             
    --GROUP BY SourceOrReason,(Cash+SBIAccount+CBIAccount+Other)            
    GROUP BY SourceOrReason--,Cash,SBIAccount,CBIAccount,Other          
           
 ORDER BY LastDate DESC            
                               
END 