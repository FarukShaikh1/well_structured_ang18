ALTER proc [dbo].[SourceAndReason_Get]              
@in_fromDate varchar(20)=NULL,                        
@in_toDate Varchar(20)=NULL,                
@in_searchText VARCHAR(50)=null,              
@in_UserId UNIQUEIDENTIFIER                
AS                        
begin             
IF @in_fromDate IS NULL      
SET @in_fromDate = '01-01-2001'      
IF @in_toDate IS NULL      
SET @in_toDate = '12-31-9999'      
      
select DISTINCT                 
NULL AS ExpenseId,                
SourceOrReason from Expenses(NOlock)                        
where ExpenseDate>=@in_fromDate AND ExpenseDate<=@in_toDate                        
AND (ISNULL(@in_searchText,'')='' OR SourceOrReason LIKE '%'+@in_searchText+'%' OR Description LIKE '%'+@in_searchText+'%' )              
AND ISNULL(IsDeleted,0) = 0  AND CreatedBy = @in_UserId                
end 