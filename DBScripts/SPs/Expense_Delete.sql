ALTER PROC [dbo].[Expense_Delete]            
@in_ExpenseId BIGINT,            
@in_UserId UNIQUEIDENTIFIER            
AS            
BEGIN            
DECLARE @isSuccess BIT  = 0        
UPDATE Expenses SET IsDeleted = 1,            
ModifiedBy = @in_UserId,            
ModifiedOn = GETDATE()            
WHERE ExpenseId = @in_ExpenseId        
AND CreatedBy = @in_UserId      
        
DECLARE @PreviousExpenseId BIGINT = 0      
DECLARE @ExpenseId BIGINT = 0      
DECLARE @ExpenseDate DATETIME;    
    
SELECT @ExpenseDate = ExpenseDate FROM Expenses WHERE ExpenseId = @in_ExpenseId    
    
SELECT TOP 1 @PreviousExpenseId = ExpenseId        
FROM Expenses WHERE CreatedBy = @in_UserId AND ExpenseId < @in_ExpenseId AND ExpenseDate <= @ExpenseDate AND IsDeleted = 0 ORDER BY ExpenseDate DESC, ExpenseId DESC      
    
 IF (@in_ExpenseId > 4093) -- this value can be changed while pushing on live server          
 BEGIN      
      
SELECT * INTO #TempExpenses FROM      
(    
 SELECT ExpenseId , ExpenseDate, CreatedBy    
 FROM Expenses      
 WHERE CreatedBy = @in_UserId      
 AND ExpenseDate > @ExpenseDate      
 AND IsDeleted = 0      
 UNION    
 SELECT ExpenseId  ,ExpenseDate, CreatedBy    
 FROM Expenses      
 WHERE CreatedBy = @in_UserId      
 AND ExpenseDate = @ExpenseDate      
 AND ExpenseId > @in_ExpenseId      
 AND IsDeleted = 0       
)t    
    
  DECLARE Cursor_ExpenseId CURSOR      
  FOR      
  SELECT ExpenseId      
  FROM #TempExpenses      
    ORDER BY ExpenseDate ASC      
   ,ExpenseId ASC    
    
    
  OPEN Cursor_ExpenseId;      
      
  FETCH NEXT      
  FROM Cursor_ExpenseId      
  INTO @ExpenseId      
      
  WHILE @@FETCH_STATUS = 0      
  BEGIN      
      
   UPDATE e1    
   SET e1.CashBalance = ISNULL(e2.CashBalance, 0) + ISNULL(e1.Cash, 0)      
    ,e1.SBIBalance = ISNULL(e2.SBIBalance, 0) + ISNULL(e1.SBIAccount, 0)      
    ,e1.CBIBalance = ISNULL(e2.CBIBalance, 0) + ISNULL(e1.CBIAccount, 0)      
    ,e1.OtherBalance = ISNULL(e2.OtherBalance, 0) + ISNULL(e1.Other, 0)      
   FROM Expenses e1      
   INNER JOIN Expenses e2 ON e2.ExpenseId = @PreviousExpenseId      
   WHERE e1.ExpenseId = @ExpenseId      
    AND e1.IsDeleted = 0      
    AND e2.IsDeleted = 0      
      
   SET @PreviousExpenseId = @ExpenseId      
      
   FETCH NEXT      
   FROM Cursor_ExpenseId      
   INTO @ExpenseId      
  END      
      
  CLOSE Cursor_ExpenseId;      
      
  DEALLOCATE Cursor_ExpenseId;      
 END      
     
SET @isSuccess = 1        
        
SELECT @isSuccess        
        
END   