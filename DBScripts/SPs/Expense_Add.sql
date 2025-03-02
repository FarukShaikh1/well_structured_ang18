CREATE  PROCEDURE [dbo].[Expense_Add] @in_ExpenseDate DATETIME                
,@in_SourceOrReason NVARCHAR(2000)                
,@in_Purpose NVARCHAR(200)                
,@in_Cash MONEY = 0                
,@in_SbiAccount MONEY = 0                
,@in_CbiAccount MONEY = 0                
,@in_Other MONEY = 0                
,@in_Description VARCHAR(MAX) = ''                
,@in_UserId UNIQUEIDENTIFIER                
,@out_ReportStatus BIGINT OUT                
AS                
BEGIN                
 DECLARE @ExpenseId BIGINT = 0                
                
 INSERT INTO Expenses                 
 (ExpenseDate, SourceOrReason,Purpose, Cash, SBIAccount, CBIAccount, Other, TotalAmount, Description, CreatedOn, CreatedBy)                
 VALUES                 
 (@in_ExpenseDate,@in_SourceOrReason,@in_Purpose,@in_Cash,@in_SbiAccount,@in_CbiAccount,@in_Other                
 ,(ISNULL(@in_Cash, 0) + ISNULL(@in_SbiAccount, 0) + ISNULL(@in_CbiAccount, 0) + ISNULL(@in_Other, 0))                
 --,(SELECT TOP 1 TotalAvailable + ISNULL(@in_Cash, 0) + ISNULL(@in_SbiAccount, 0) + ISNULL(@in_CbiAccount, 0) + ISNULL(@in_Other, 0) FROM Expenses ORDER BY ExpenseId DESC)                
 ,@in_Description,GETDATE(),@in_UserId)                
                
                
 SET @out_ReportStatus = SCOPE_IDENTITY()                
 DECLARE @PreviousExpenseIdByDate BIGINT = 0                
                
 DECLARE @PrevExpenseId BIGINT = 0                
                
 SELECT TOP 1 @PrevExpenseId = ExpenseId FROM Expenses WHERE ExpenseDate <= @in_ExpenseDate AND ExpenseId != @out_ReportStatus  ORDER BY ExpenseDate DESC, ExpenseId DESC                
                
 UPDATE e1                
 SET e1.CashBalance = ISNULL(e2.CashBalance, 0) + ISNULL(e1.Cash, 0)                
 ,e1.SBIBalance = ISNULL(e2.SBIBalance, 0) + ISNULL(e1.SBIAccount, 0)                
 ,e1.CBIBalance = ISNULL(e2.CBIBalance, 0) + ISNULL(e1.CBIAccount, 0)                
 ,e1.OtherBalance = ISNULL(e2.OtherBalance, 0) + ISNULL(e1.Other, 0)                
 ,e1.TotalAvailable = ISNULL(e2.TotalAvailable, 0) + ISNULL(e1.TotalAmount, 0)                
 FROM Expenses e1                
 INNER JOIN Expenses e2 ON e2.ExpenseId = @PrevExpenseId                
 WHERE e1.ExpenseId = @out_ReportStatus --AND e1.IsDeleted = 0 AND e2.IsDeleted = 0                
                
                
  DECLARE @LastId BIGINT               
  SET @LastId = @out_ReportStatus              
                 
 IF EXISTS(SELECT 1 FROM Expenses WHERE ExpenseDate > @in_ExpenseDate AND ExpenseDate > '2023-01-17 00:00:00.000')                
 BEGIN                
                
  DECLARE Cursor_ExpenseId CURSOR                
  FOR                
  SELECT ExpenseId FROM Expenses                
  WHERE CreatedBy = @in_UserId AND ExpenseDate > @in_ExpenseDate AND IsDeleted = 0                
  ORDER BY ExpenseDate ASC, ExpenseId ASC                
                
  OPEN Cursor_ExpenseId;                
                
  FETCH NEXT                
  FROM Cursor_ExpenseId                
  INTO @ExpenseId                
                
  WHILE @@FETCH_STATUS = 0                
  BEGIN                
  SET @PreviousExpenseIdByDate = @LastId              
   UPDATE e1                
   SET e1.CashBalance = ISNULL(e2.CashBalance, 0) + ISNULL(e1.Cash, 0)                
   ,e1.SBIBalance = ISNULL(e2.SBIBalance, 0) + ISNULL(e1.SBIAccount, 0)                
   ,e1.CBIBalance = ISNULL(e2.CBIBalance, 0) + ISNULL(e1.CBIAccount, 0)                
   ,e1.OtherBalance = ISNULL(e2.OtherBalance, 0) + ISNULL(e1.Other, 0)                
 ,e1.TotalAvailable = ISNULL(e2.TotalAvailable, 0) + ISNULL(e1.TotalAmount, 0)                
   FROM Expenses e1                
   INNER JOIN Expenses e2 ON e2.ExpenseId = @PreviousExpenseIdByDate                
   WHERE e1.ExpenseId = @ExpenseId AND e1.IsDeleted = 0 AND e2.IsDeleted = 0                
                
  SET @LastId = @ExpenseId              
   FETCH NEXT                
   FROM Cursor_ExpenseId                
   INTO @ExpenseId                
  END                
                
  CLOSE Cursor_ExpenseId;                
                
  DEALLOCATE Cursor_ExpenseId;                
                
 END                
END 