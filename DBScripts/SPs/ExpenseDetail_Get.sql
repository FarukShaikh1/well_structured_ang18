ALTER PROC [dbo].[ExpenseDetail_Get]                         
@in_ExpenseId BIGINT,          
@in_UserId UNIQUEIDENTIFIER  
AS                          
BEGIN                          
SELECT ExpenseId, ExpenseDate,                          
SourceOrReason,      
Purpose,      
ISNULL(Cash, 0) AS Cash,                      
ISNULL(SBIAccount,0) AS SBIAccount,                      
ISNULL(CBIAccount, 0) AS CBIAccount,                      
ISNULL(Other, 0) AS Other,                    
e.AssetId,                    
Description, ReferenceNumber, IsInvoiceAvailable,                      
a.AssetType,              
0 AS TransactionStatusId,              
'' AS TransactionStatus              
              
FROM Expenses e              
LEFT JOIN                   
Asset a                  
ON e.AssetId = a.AssetId                  
                  
WHERE e.ExpenseId = @in_ExpenseId             
AND e.CreatedBy = @in_UserId           
AND ISNULL(e.IsDeleted, 0) = 0              
END                      
                      
----SELECT * FROM Expenses                    
--ALTER TABLE Expenses DROP Column RecieptId                     
--ALTER TABLE Expenses ADD IsDeleted BIT 