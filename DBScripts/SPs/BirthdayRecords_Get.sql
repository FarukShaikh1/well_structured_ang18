ALTER PROCEDURE [dbo].[BirthdayRecords_Get] @in_UserId UNIQUEIDENTIFIER
	,@in_SearchText NVARCHAR(100) = NULL
	,@in_Months VARCHAR(MAX) = NULL
	,@in_dayType VARCHAR(MAX) = NULL
	,@in_IsToday BIT = 0
	,@in_IsTomorrow BIT = 0
	,@in_IsYesterday BIT = 0
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @Today DATE = GETDATE();
	DECLARE @Yesterday DATE = DATEADD(DAY, - 1, @Today);
	DECLARE @Tomorrow DATE = DATEADD(DAY, 1, @Today);
	DECLARE @MonthList TABLE (MonthId INT);
	DECLARE @DayTypeList TABLE (DayTypeId UNIQUEIDENTIFIER);

	IF @in_Months IS NOT NULL
	BEGIN
		INSERT INTO @MonthList (MonthId)
		SELECT items
		FROM dbo.SplitWithIndex(@in_Months, ',');
	END

	IF @in_dayType IS NOT NULL
	BEGIN
		INSERT INTO @DayTypeList (DayTypeId)
		SELECT items
		FROM dbo.SplitWithIndex(@in_dayType, ',');
	END

	SELECT br.BirthdayId
		,CONVERT(DATETIME, br.Birthdate, 103) AS Birthdate
		,FORMAT(br.Birthdate, 'dd - MMM') AS DATE
		,FORMAT(br.Birthdate, 'MMM') AS Month
		,dbo.TitleCase(br.PersonName) AS PersonName
		,br.EmailId
		,br.Address
		,CASE 
			WHEN br.AssetId IS NULL
				THEN NULL
			ELSE br.AssetId
			END AS AssetId
		,CASE 
			WHEN @in_UserId IS NULL
				THEN '-'
			ELSE CAST(br.MobileNumber2 AS VARCHAR(20))
			END AS MobileNumber2
		,CASE 
			WHEN @in_UserId IS NULL
				THEN '-'
			ELSE CAST(br.MobileNumber AS VARCHAR(20))
			END AS MobileNumber
		,br.DayTypeId
		,cli.ListItemDescription AS Type
		,br.CreatedBy
		,br.CreatedOn
		,br.IsRestricted
		,br.IsDeleted
		,br.IsVerified
		,dbo.IsEditable('Birthday', @in_UserId, br.BirthdayId) AS IsEditable
		,dbo.IsApprovable('Birthday', @in_UserId, br.BirthdayId) AS IsApprovable
	FROM BirthdayRecords br
	LEFT JOIN CommonListItem cli ON cli.CommonListItemId = br.DayTypeId
	WHERE br.IsDeleted = 0
		AND (
			br.IsVerified = 1
			OR dbo.IsEditable('Birthday', @in_UserId, br.BirthdayId) = 1
			)
		AND (
			@in_dayType IS NULL
			OR EXISTS (
				SELECT 1
				FROM @DayTypeList
				WHERE DayTypeId = br.DayTypeId
				)
			)
		AND (
			@in_Months IS NULL
			OR EXISTS (
				SELECT 1
				FROM @MonthList
				WHERE MonthId = MONTH(br.Birthdate)
				)
			)
		AND (
			(
				@in_IsToday = 1
				AND CONVERT(DATE, br.Birthdate) = @Today
				)
			OR (
				@in_IsYesterday = 1
				AND CONVERT(DATE, br.Birthdate) = @Yesterday
				)
			OR (
				@in_IsTomorrow = 1
				AND CONVERT(DATE, br.Birthdate) = @Tomorrow
				)
			OR (
				@in_IsToday = 0
				AND @in_IsYesterday = 0
				AND @in_IsTomorrow = 0
				)
			)
	ORDER BY MONTH(br.Birthdate)
		,DAY(br.Birthdate)
		,br.PersonName;

	SET NOCOUNT OFF;
END