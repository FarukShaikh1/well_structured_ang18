ALTER FUNCTION [dbo].[ExpenseLastDate](          
    @in_UserId UNIQUEIDENTIFIER,                                                          
    @in_FromDate DATETIME = NULL,                                                          
    @in_ToDate DATETIME = NULL,                                                        
    @in_SourceOrReason VARCHAR(MAX),                                                        
    @in_MinAmount DECIMAL = 0,                                                        
    @in_MaxAmount DECIMAL = 0,                                    
 @in_ModeOfTransaction VARCHAR(MAX)='')          
 RETURNS DATETIME    
 AS          
 BEGIN           
DECLARE @minExpenseDate DATETIME;        
        
        
 SELECT @minExpenseDate = MAX(ExpenseDate)         
 FROM Expenses        
 WHERE CreatedBy = @in_UserId                          
 AND (@in_FromDate IS NULL OR ExpenseDate >= @in_FromDate)                                   
 AND (@in_ToDate IS NULL OR ExpenseDate <= @in_ToDate)                                  
 AND ISNULL(IsDeleted,0)=0          
 AND SourceOrReason =@in_SourceOrReason  
  AND (ISNULL(@in_MinAmount,0)=0 OR @in_MinAmount <= ABS(TotalAmount))                                  
 AND (ISNULL(@in_MaxAmount,0)=0 OR @in_MaxAmount >= ABS(TotalAmount))        
          
  RETURN @minExpenseDate        
 END   