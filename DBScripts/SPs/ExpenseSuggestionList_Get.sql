ALTER proc [dbo].[ExpenseSuggestionList_Get] --0    
@in_UserId UNIQUEIDENTIFIER                    
AS                            
BEGIN    
SELECT DISTINCT                     
SourceOrReason,     
Purpose,    
Description from Expenses(NOLOCK)                            
WHERE       
ISNULL(IsDeleted,0) = 0  AND CreatedBy = @in_UserId       
ORDER BY sourceOrReason, Description, Purpose     
end 