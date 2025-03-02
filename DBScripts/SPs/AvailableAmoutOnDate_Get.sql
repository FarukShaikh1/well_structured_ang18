ALTER proc [dbo].[AvailableAmoutOnDate_Get]      
@in_Date varchar(20)=NULL,                          
@in_AccountType Varchar(10)=NULL,                  
@in_UserId UNIQUEIDENTIFIER                  
AS                          
begin               
        
select TOP 1     
CASE     
WHEN @in_AccountType = 'sbi' THEN    
SBIBalance     
WHEN @in_AccountType = 'cbi' THEN    
CBIBalance     
WHEN @in_AccountType = 'cash' THEN    
CashBalance     
WHEN @in_AccountType = 'other' THEN    
OtherBalance    
END    
AS Amount from Expenses(NOlock)                          
where ExpenseDate<=@in_Date     
AND ISNULL(IsDeleted,0) = 0  AND CreatedBy = @in_UserId                  
ORDER BY ExpenseDate DESC, ExpenseId DESC;    
    
end   