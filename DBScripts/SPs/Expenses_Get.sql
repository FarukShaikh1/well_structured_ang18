ALTER PROCEDURE [dbo].[Expenses_Get]                        
@in_UserId UNIQUEIDENTIFIER,                        
    @in_FromDate DATETIME = NULL,                                              
    @in_ToDate DATETIME = NULL,                                            
    @in_SourceOrReason VARCHAR(MAX) = NULL,                                            
    @in_Purpose VARCHAR(200) = NULL,                                            
    @in_MinAmount DECIMAL = 0,                                            
    @in_MaxAmount DECIMAL = 0,                                            
    @in_ModeOfTransaction VARCHAR(200)= NULL,                                    
    @in_TransactionStatusIds VARCHAR(100)= NULL,                      
 @in_IsDownload BIT = 0              
AS                                              
BEGIN                                              
IF @in_FromDate IS NULL                  
SET @in_FromDate = '01-Jan-2000'                  
                  
IF @in_ToDate IS NULL                  
SET @in_ToDate = '31-Dec-2100'                  
                  
                  
SET NOCOUNT ON                                            
SELECT * INTO #TempExpenseResult FROM (              
--SELECT ExpenseId, ExpenseDate, SourceOrReason,Cash,SBIAccount,CBIAccount,Other, TotalAmount, TotalAvailable FROM Expenses ORDER BY ExpenseDate DESC                                                
    SELECT ExpenseId                                              
    ,ExpenseDate                                              
    ,SourceOrReason                                              
 ,Purpose    
    ,Description                                              
    ,Amount                                              
    ,ModeOfTransaction                                           
    ,TransactionStatusId                                      
    ,CASE WHEN Amount > 0 THEN Amount ELSE 0 END AS Credit                
    ,CASE WHEN Amount < 0 THEN Amount ELSE 0 END AS Debit                
    FROM Expenses                                           
    UNPIVOT(Amount FOR ModeOfTransaction IN (                                              
    CASh                                              
    ,SBIAccount                                              
    ,CBIAccount                                              
    ,Other                                              
    )) AS PivotTable                                              
    WHERE ( ExpenseDate >= @in_FromDate AND ExpenseDate <= @in_ToDate AND                             
 CreatedBy = @in_UserId                        
    AND ISNULL(IsDeleted,0)=0                            
    AND                            
    Amount <> 0                                             
    AND Amount IS NOT NULL)                                              
    AND ((ISNULL(@in_SourceOrReason,'')='') OR SourceOrReason IN (SELECT items FROM dbo.SplitWithIndex(@in_SourceOrReason, ','))        
 OR SourceOrReason LIKE '%'+@in_SourceOrReason+'%'                                                  
 OR ISNULL(@in_SourceOrReason,'')='' OR Description LIKE '%'+@in_SourceOrReason+'%' OR SourceOrReason LIKE '%'+@in_SourceOrReason+'%')                    
    AND (ISNULL(@in_MinAmount,0) = 0 OR ABS(Amount) >= @in_MinAmount)                                            
    AND (ISNULL(@in_MaxAmount,0) = 0 OR ABS(Amount) <= @in_MaxAmount)                                            
    AND (ISNULL(@in_ModeOfTransaction, '')='' OR ModeOfTransaction IN (SELECT items FROM dbo.SplitWithIndex(@in_ModeOfTransaction,','))                                            
    )) expense              
               
 IF @in_IsDownload = 0              
 SELECT * FROM #TempExpenseResult ORDER BY CAST(ExpenseDate AS DATE) DESC, ExpenseId DESC, ModeOfTransaction ASC                                              
 ELSE              
 SELECT               
 ExpenseId,              
 CONVERT(Date,ExpenseDate,103) AS ExpenseDate              
    ,SourceOrReason       
 ,Purpose    
    ,Description                                              
    ,Amount           
    ,ModeOfTransaction                                           
    ,Credit                
    ,Debit                
  FROM #TempExpenseResult ORDER BY CAST(ExpenseDate AS DATE) ASC, ExpenseId ASC, ModeOfTransaction ASC              
              
 DROP TABLE #TempExpenseResult              
              
END 