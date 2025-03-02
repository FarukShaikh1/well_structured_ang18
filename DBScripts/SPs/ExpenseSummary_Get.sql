CREATE  PROCEDURE [dbo].[ExpenseSummary_Get]                                                        
    @in_UserId UNIQUEIDENTIFIER,                                                        
    @in_FromDate DATETIME = NULL,                                                        
    @in_ToDate DATETIME = NULL,                                                      
    @in_SourceOrReason VARCHAR(MAX) = NULL,                                                      
    @in_Purpose VARCHAR(200) = NULL,                                                      
    @in_MinAmount DECIMAL = 0,                                                      
    @in_MaxAmount DECIMAL = 0,                                  
 @in_ModeOfTransaction VARCHAR(MAX)=NULL,                               
 --@in_SearchText VARCHAR(MAX)=''             ,                  
 @in_IsDownload BIT = 0                  
AS                                                        
BEGIN                                                        
    SET NOCOUNT ON                                       
    SELECT                                     
    ExpenseId, ExpenseDate, SourceOrReason,Purpose, Description , Cash, SBIAccount, CBIAccount, Other,                            
 CashBalance, SBIBalance,CBIBalance,OtherBalance, TotalAmount, TotalAvailable AS TotalAvailable,                                     
    CreatedBy, ModifiedBy, CreatedOn, ModifiedOn                                    
    FROM Expenses (NOLOCK)                                                  
    WHERE CreatedBy = @in_UserId                        
 AND (@in_FromDate IS NULL OR ExpenseDate >= @in_FromDate)                                 
 AND (@in_ToDate IS NULL OR ExpenseDate <= @in_ToDate)                                
 AND ISNULL(IsDeleted,0)=0                                
 AND ((ISNULL(@in_SourceOrReason,'')='')       
 OR SourceOrReason IN (SELECT items FROM dbo.SplitWithIndex(@in_SourceOrReason, ','))       
 OR SourceOrReason LIKE '%'+@in_SourceOrReason+'%'                                                    
 OR ISNULL(@in_SourceOrReason,'')=''       
 OR Description LIKE '%'+@in_SourceOrReason+'%'       
 OR SourceOrReason LIKE '%'+@in_SourceOrReason+'%')                      
 AND (ISNULL(@in_MinAmount,0)=0 OR @in_MinAmount <= ABS(TotalAmount))                                
 AND (ISNULL(@in_MaxAmount,0)=0 OR @in_MaxAmount >= ABS(TotalAmount))                         
 AND (ISNULL(@in_ModeOfTransaction,'')=''      
 OR ('SBIAccount' IN (SELECT items FROM dbo.SplitWithIndex(@in_ModeOfTransaction,',')) AND SBIAccount <>0)      
 OR ('CBIAccount' IN (SELECT items FROM dbo.SplitWithIndex(@in_ModeOfTransaction,',')) AND CBIAccount <>0)      
 OR ('Cash' IN (SELECT items FROM dbo.SplitWithIndex(@in_ModeOfTransaction,',')) AND Cash <>0)      
 OR ('Other' IN (SELECT items FROM dbo.SplitWithIndex(@in_ModeOfTransaction,',')) AND Other <>0))      
      
 --ELSE 1                                  
 --END                                  
 --<> 0                                
 ORDER BY ExpenseDate DESC, ExpenseId DESC                                    
END 