--SP_HELPTEXT BirthdayInfo_Delete    
    
ALTER PROC [dbo].[BirthdayInfo_Approve]  
@in_BirthdayId UNIQUEIDENTIFIER,    
@in_UserId UNIQUEIDENTIFIER
AS    
BEGIN     
DECLARE @IsSuccess BIT = 0    
    
UPDATE BirthdayRecords SET IsVerified = 1, ModifiedBy = @in_UserId, ModifiedOn = GETDATE()    
WHERE BirthdayId = @in_BirthdayId    
SET @IsSuccess = 1    
SELECT @IsSuccess AS IsSuccess    
END    
    
    