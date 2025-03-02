CREATE PROC [dbo].[Expense_Update] @in_ExpenseId BIGINT                  
 ,@in_ExpenseDate DATETIME                  
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
 DECLARE @PreviousExpenseIdByDate BIGINT = 0                  
 DECLARE @ExpenseId BIGINT = 0                  
             
INSERT INTO Expense_Audit_For_Log(        
[ExpenseId],[ExpenseDate],[SourceOrReason],Purpose,[Cash],[SBIAccount] ,[CBIAccount],[Other],[TotalAmount],[CashBalance],[SBIBalance],        
 [CBIBalance],[OtherBalance],[TotalAvailable] ,[CreatedBy],[ModifiedBy],[CreatedOn] ,[ModifiedOn],[Description],        
 [ReferenceNumber] ,[IsInvoiceAvailable],[AssetId] ,[IsDeleted],[TransactionStatusId] ,[Operation] ,[AuditCreateDate]        
 )        
SELECT  [ExpenseId],[ExpenseDate],[SourceOrReason],Purpose,[Cash],[SBIAccount] ,[CBIAccount],[Other],[TotalAmount],[CashBalance],[SBIBalance],        
 [CBIBalance],[OtherBalance],[TotalAvailable] ,[CreatedBy],[ModifiedBy],[CreatedOn] ,[ModifiedOn],[Description],        
 [ReferenceNumber] ,[IsInvoiceAvailable],[AssetId] ,[IsDeleted],[TransactionStatusId] ,'Updated By User',GETDATE()         
 FROM Expenses WHERE ExpenseId = @in_ExpenseId        
        
        
        
 --DECLARE @IsSuccess BIT = 0                              
 UPDATE Expenses                   
 SET ExpenseDate = @in_ExpenseDate                  
  ,SourceOrReason = @in_SourceOrReason       
  ,Purpose = @in_Purpose      
  ,Cash = @in_Cash                  
  ,SBIAccount = @in_SbiAccount                  
  ,CBIAccount = @in_CbiAccount                  
  ,Other = @in_Other                  
  ,TotalAmount = (ISNULL(@in_Cash, 0) + ISNULL(@in_SbiAccount, 0) + ISNULL(@in_CbiAccount, 0) + ISNULL(@in_Other, 0))                  
  ,Description = @in_Description                  
  ,ModifiedBy = @in_UserId                  
  ,ModifiedOn = GETDATE()                  
 WHERE ExpenseId = @in_ExpenseId                  
                  
   SELECT TOP 1 @PreviousExpenseIdByDate = ExpenseId                    
   FROM Expenses WHERE CreatedBy = @in_UserId AND ExpenseId < @in_ExpenseId AND ExpenseDate <= @in_ExpenseDate AND IsDeleted = 0 ORDER BY ExpenseDate DESC, ExpenseId DESC                  
                  
 UPDATE e1                  
   SET e1.CashBalance = ISNULL(e2.CashBalance, 0) + ISNULL(e1.Cash, 0)                  
    ,e1.SBIBalance = ISNULL(e2.SBIBalance, 0) + ISNULL(e1.SBIAccount, 0)                  
    ,e1.CBIBalance = ISNULL(e2.CBIBalance, 0) + ISNULL(e1.CBIAccount, 0)                  
    ,e1.OtherBalance = ISNULL(e2.OtherBalance, 0) + ISNULL(e1.Other, 0)                  
 ,e1.TotalAvailable = ISNULL(e2.TotalAvailable, 0) + ISNULL(e1.TotalAmount, 0)                  
   FROM Expenses e1                  
   INNER JOIN Expenses e2 ON e2.ExpenseId = @PreviousExpenseIdByDate                  
   WHERE e1.ExpenseId = @in_ExpenseId                  
    AND e1.IsDeleted = 0                  
    AND e2.IsDeleted = 0                  
                  
 IF (@in_ExpenseId > 4093) -- this value can be changed while pushing on live server                      
 BEGIN                  
                  
   SET @PreviousExpenseIdByDate = @in_ExpenseId                  
                
SELECT * INTO #TempExpenses FROM                  
(                
 SELECT ExpenseId , ExpenseDate, CreatedBy                
 FROM Expenses                  
 WHERE CreatedBy = @in_UserId                  
 AND ExpenseDate > @in_ExpenseDate                  
 AND IsDeleted = 0                  
 UNION                
 SELECT ExpenseId  ,ExpenseDate, CreatedBy                
 FROM Expenses        
 WHERE CreatedBy = @in_UserId                  
 AND ExpenseDate = @in_ExpenseDate                  
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
 ,e1.TotalAvailable = ISNULL(e2.TotalAvailable, 0) + ISNULL(e1.TotalAmount, 0)                  
   FROM Expenses e1                  
   INNER JOIN Expenses e2 ON e2.ExpenseId = @PreviousExpenseIdByDate                  
   WHERE e1.ExpenseId = @ExpenseId                  
    AND e1.IsDeleted = 0                  
    AND e2.IsDeleted = 0                  
                  
   SET @PreviousExpenseIdByDate = @ExpenseId                  
                  
   FETCH NEXT                  
   FROM Cursor_ExpenseId                  
   INTO @ExpenseId                  
  END                  
                  
  CLOSE Cursor_ExpenseId;                 
                  
  DEALLOCATE Cursor_ExpenseId;                  
 END                  
 SELECT @out_ReportStatus = @in_ExpenseId                  
                  
 SELECT @out_ReportStatus AS Result                  
END 