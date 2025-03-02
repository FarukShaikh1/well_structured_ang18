ALTER PROCEDURE [dbo].[Expense_Adjustment]   
@in_expenseDateSbi DATETIME,  
@in_expenseDateCbi DATETIME,  
@in_expenseDateCash DATETIME,  
@in_expenseDateOther DATETIME,  
@in_SourceOrReasonSbi NVARCHAR(2000)              
,@in_SourceOrReasonCbi NVARCHAR(2000)              
,@in_SourceOrReasonCash NVARCHAR(2000)              
,@in_SourceOrReasonOther NVARCHAR(2000)              
,@in_AmountCash MONEY = 0              
,@in_AccountSbi MONEY = 0              
,@in_AccountCbi MONEY = 0              
,@in_AmountOther MONEY = 0              
,@in_Description VARCHAR(MAX) = ''              
,@in_UserId UNIQUEIDENTIFIER              
,@out_ReportStatus BIGINT OUT              
AS              
BEGIN              
 DECLARE @ExpenseId BIGINT = 0              
IF(ISNULL(@in_SourceOrReasonSbi,'')<>'')  
BEGIN  
 INSERT INTO Expenses               
 (ExpenseDate, SourceOrReason, SBIAccount, TotalAmount, Description, CreatedOn, CreatedBy)              
 VALUES               
 (@in_ExpenseDateSbi,@in_SourceOrReasonSbi,@in_AccountSbi,ISNULL(@in_AccountSbi, 0)               
 ,@in_Description,GETDATE(),@in_UserId)              
END              
  
  
IF(ISNULL(@in_SourceOrReasonCbi,'')<>'')  
BEGIN  
 INSERT INTO Expenses               
 (ExpenseDate, SourceOrReason, SBIAccount, TotalAmount, Description, CreatedOn, CreatedBy)              
 VALUES               
 (@in_ExpenseDateCbi,@in_SourceOrReasonCbi,@in_AccountCbi,ISNULL(@in_AccountCbi, 0)               
 ,@in_Description,GETDATE(),@in_UserId)              
END              
  
IF(ISNULL(@in_SourceOrReasonCash,'')<>'')  
BEGIN  
 INSERT INTO Expenses               
 (ExpenseDate, SourceOrReason, Cash, TotalAmount, Description, CreatedOn, CreatedBy)              
 VALUES               
 (@in_expenseDateCash,@in_SourceOrReasonCash,@in_AmountCash,ISNULL(@in_AmountCash, 0)               
 ,@in_Description,GETDATE(),@in_UserId)              
END              
              
IF(ISNULL(@in_SourceOrReasonOther,'')<>'')  
BEGIN  
 INSERT INTO Expenses               
 (ExpenseDate, SourceOrReason, Other, TotalAmount, Description, CreatedOn, CreatedBy)              
 VALUES               
 (@in_expenseDateOther,@in_SourceOrReasonOther,@in_AmountOther,ISNULL(@in_AmountOther, 0)               
 ,@in_Description,GETDATE(),@in_UserId)              
END              
  
 SET @out_ReportStatus = SCOPE_IDENTITY()  
END    