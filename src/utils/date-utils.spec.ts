// import { TestBed } from '@angular/core/testing';
// import { DateUtils } from './date-utils';
// import { DatePipe } from '@angular/common';

// describe('DateUtils', () => {
//   let dateUtils: DateUtils;

//   // beforeEach(() => {
//   //   dateUtils = new DateUtils();
//   // });

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       providers: [DatePipe]
//     });
//   });

//   it('should create an instance', () => {
//     expect(new DateUtils()).toBeTruthy();
//   });

//   describe('formatTimestamp', () => {
//     it('should return empty string if date is null', () => {
//       expect(dateUtils.formatTimestamp(null as any)).toBe('');
//     });

//     it('should return empty string if date is invalid', () => {
//       expect(dateUtils.formatTimestamp('invalid-date' as any)).toBe('');
//     });

//     it('should return "just now" for a date that is the current time', () => {
//       const now = new Date();
//       expect(dateUtils.formatTimestamp(now)).toBe('just now');
//     });

//     it('should return "1 min ago" for a date that is 1 minute ago', () => {
//       const date = new Date(new Date().getTime() - 60 * 1000);
//       expect(dateUtils.formatTimestamp(date)).toBe('1 min ago');
//     });

//     it('should return "2 hours ago" for a date that is 2 hours ago', () => {
//       const date = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
//       expect(dateUtils.formatTimestamp(date)).toBe('2 hours ago');
//     });

//     // fit('should return the formatted time for a date earlier today in chat format', () => {
//     //   const date = new Date(new Date().setHours(9, 30, 0));
//     //   expect(dateUtils.formatTimestamp(date, true)).toBe('09:30 AM');
//     // });

//     it('should return the formatted date and time for a date this year', () => {
//       const date = new Date(new Date().setMonth(2, 15)); // March 15th
//       expect(dateUtils.formatTimestamp(date)).toContain('15 Mar - ');
//     });

//     it('should return the formatted date and time for a date in a different year', () => {
//       const date = new Date(2020, 5, 20); // June 20, 2020
//       expect(dateUtils.formatTimestamp(date)).toContain('20 Jun 2020 - ');
//     });
//   });

//   describe('timeStampForChat', () => {
//     it('should return empty string if date is null', () => {
//       expect(dateUtils.timeStampForChat(null as any)).toBe('');
//     });

//     it('should return empty string if date is invalid', () => {
//       expect(dateUtils.timeStampForChat('invalid-date' as any)).toBe('');
//     });

//     it('should return "Today" if the date is today and divider is true', () => {
//       const today = new Date();
//       expect(dateUtils.timeStampForChat(today, true)).toBe('Today');
//     });

//     it('should return the formatted time if the date is today and divider is false', () => {
//       const today = new Date(new Date().setHours(10, 15, 0));
//       expect(dateUtils.timeStampForChat(today)).toBe('10:15 AM');
//     });

//     it('should return "Yesterday" if the date is yesterday', () => {
//       const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
//       expect(dateUtils.timeStampForChat(yesterday)).toBe('Yesterday');
//     });

//     it('should return the day name for a date within the last 7 days', () => {
//       const lastWeek = new Date(new Date().setDate(new Date().getDate() - 3)); // 3 days ago
//       const options = { weekday: 'long' } as const;
//       expect(dateUtils.timeStampForChat(lastWeek)).toBe(lastWeek.toLocaleDateString('en-US', options));
//     });

//     it('should return the formatted date for a date from a different year', () => {
//       const date = new Date(2020, 0, 10); // January 10, 2020
//       expect(dateUtils.timeStampForChat(date)).toBe('Jan 10, 2020');
//     });

//     // fit('should return the formatted date for a date that is not today, yesterday, or within the last week', () => {
//     //   const date = new Date(new Date().setDate(new Date().getDate() - 10)); // 10 days ago
//     //   expect(dateUtils.timeStampForChat(date)).toBe('22 Aug'); // Assuming today is August 31st
//     // });
//   });

//   describe('formatDateString', () => {
//     it('should format a valid date string', () => {
//       const input = '2022-07-25T14:30:00.000Z';
//       const expectedOutput = '2022-07-25';
//       expect(DateUtils.formatDateString(input)).toBe(expectedOutput);
//     });

//     it('should handle an invalid date string (non-ISO format)', () => {
//       const input = 'July 25, 2022';
//       expect(() => DateUtils.formatDateString(input)).toThrowError();
//     });

//     it('should handle an edge case - January 1st', () => {
//       const input = '2022-01-01T00:00:00.000Z';
//       const expectedOutput = '2022-01-01';
//       expect(DateUtils.formatDateString(input)).toBe(expectedOutput);
//     });

//     it('should handle an edge case - December 31st', () => {
//       const input = '2022-12-31T23:59:59.999Z';
//       const expectedOutput = '2022-12-31';
//       expect(DateUtils.formatDateString(input)).toBe(expectedOutput);
//     });

//     it('should handle a single-digit day/month', () => {
//       const input = '2022-05-05T12:00:00.000Z';
//       const expectedOutput = '2022-05-05';
//       expect(DateUtils.formatDateString(input)).toBe(expectedOutput);
//     });

//     it('should handle a date string with timezone offset', () => {
//       const input = '2022-07-25T14:30:00.000+02:00';
//       const expectedOutput = '2022-07-25';
//       expect(DateUtils.formatDateString(input)).toBe(expectedOutput);
//     });

//     // it('should handle a null input', () => {
//     //   const input = null;
//     //   expect(() => DateUtils.formatDateString(input)).toThrowError();
//     // });

//     // it('should handle an undefined input', () => {
//     //   const input = undefined;
//     //   expect(() => DateUtils.formatDateString(input)).toThrowError();
//     // });
//   });

//   describe('formatDateStringToYYYYMonDD', () => {
//     it('should format a valid date string', () => {
//       const input = '2022-07-25T14:30:00.000Z';
//       const expectedOutput = '2022-07-25';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//     it('should handle an invalid date string (non-ISO format)', () => {
//       const input = 'July 25, 2022';
//       const expectedOutput = 'July 25, 2022';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(input);
//     });

//     it('should handle an edge case - January 1st', () => {
//       const input = '2022-01-01T00:00:00.000Z';
//       const expectedOutput = '2022-01-01';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//     it('should handle an edge case - December 31st', () => {
//       const input = '2022-12-31T23:59:59.999Z';
//       const expectedOutput = '2022-12-31';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//     it('should handle a single-digit day/month', () => {
//       const input = '2022-05-05T12:00:00.000Z';
//       const expectedOutput = '2022-05-05';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//     it('should handle a date string with timezone offset', () => {
//       const input = '2022-07-25T14:30:00.000+02:00';
//       const expectedOutput = '2022-07-25';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//     it('should handle a null input', () => {
//       const input = null;
//       const expectedOutput = '';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//     it('should handle an undefined input', () => {
//       const input = undefined;
//       const expectedOutput = '';
//       expect(DateUtils.formatDateStringToYYYYMonDD(input)).toBe(expectedOutput);
//     });

//   });
// });



import { TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { DateUtils } from './date-utils';

describe('DateUtils', () => {
  let dateUtils: DateUtils;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [DatePipe]
    });
    dateUtils = new DateUtils();
  });

  describe('formatTimestamp', () => {
    it('should return an empty string when date is null', () => {
      expect(dateUtils.formatTimestamp(null)).toBe('');
    });

    it('should return an empty string when date is not a valid Date object', () => {
      expect(dateUtils.formatTimestamp('invalid date')).toBe('');
    });

    it('should return "just now" when date is the current time', () => {
      const now = new Date();
      expect(dateUtils.formatTimestamp(now)).toBe('just now');
    });

    it('should return "1 min ago" when date is 1 minute ago', () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      expect(dateUtils.formatTimestamp(oneMinuteAgo)).toBe('1 min ago');
    });

    it('should return "1 hour ago" when date is 1 hour ago', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(dateUtils.formatTimestamp(oneHourAgo)).toBe('1 hour ago');
    });

    it('should return the time in "hh:mm a" format when date is not today and forChat is true', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateUtils.formatTimestamp(yesterday, true)).not.toBe('');
      expect(dateUtils.formatTimestamp(yesterday, true)).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    });

    it('should return the date in "d MMM - hh:mm a" format when date is in the same year', () => {
      const now = new Date();
      const sameYearDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      expect(dateUtils.formatTimestamp(sameYearDate)).not.toBe('');
      expect(dateUtils.formatTimestamp(sameYearDate)).toMatch(/^\d{1,2} \w{3} - \d{1,2}:\d{2} (AM|PM)$/);
    });

    it('should return the date in "d MMM yyyy - hh:mm a" format when date is in a different year', () => {
      const now = new Date();
      const differentYearDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      expect(dateUtils.formatTimestamp(differentYearDate)).not.toBe('');
      expect(dateUtils.formatTimestamp(differentYearDate)).toMatch(/^\d{1,2} \w{3} \d{4} - \d{1,2}:\d{2} (AM|PM)$/);
    });
  });

  describe('timeStampForChat method', () => {
    it('should return an empty string when date is null', () => {
      expect(dateUtils.timeStampForChat(null)).toBe('');
    });
  
    it('should return an empty string when date is not a valid Date object', () => {
      expect(dateUtils.timeStampForChat('invalid date')).toBe('');
    });
  
    it('should return "Today" when date is today and divider is true', () => {
      const today = new Date();
      expect(dateUtils.timeStampForChat(today, true)).toBe('Today');
    });
  
    it('should return the time in "hh:mm a" format when date is today and divider is false', () => {
      const today = new Date();
      const expectedTime = dateUtils.datePipe.transform(today, 'hh:mm a');
      expect(dateUtils.timeStampForChat(today)).toBe(expectedTime as string);
    });
  
    it('should return "Yesterday" when date is yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(dateUtils.timeStampForChat(yesterday)).toBe('Yesterday');
    });
  
    it('should return the day name when date is within the last 7 days but not today or yesterday', () => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 3);
      const expectedDay = lastWeek.toLocaleDateString('en-US', { weekday: 'long' });
      expect(dateUtils.timeStampForChat(lastWeek)).toBe(expectedDay);
    });
  
    it('should return the date in "day month year" format when date is from a different year', () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      const expectedDate = lastYear.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      expect(dateUtils.timeStampForChat(lastYear)).toBe(expectedDate);
    });
  
    it('should return the date in "day month" format when date is not today, yesterday, or within the last week', () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const expectedDate = twoWeeksAgo.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
      });
      expect(dateUtils.timeStampForChat(twoWeeksAgo)).toBe(expectedDate);
    });
  });

  describe('formatDateString method', () => {
    it('should return null when input is null', () => {
      expect(DateUtils.formatDateString(null)).toBeNull();
    });
  
    it('should return null when input is empty string', () => {
      expect(DateUtils.formatDateString('')).toBeNull();
    });
  
    it('should return null when input is undefined', () => {
      expect(DateUtils.formatDateString(undefined)).toBeNull();
    });
  
    it('should return null when input string is not a valid date', () => {
      expect(DateUtils.formatDateString('invalid date')).toBeNull();
    });
  
    it('should format a valid date string to "YYYY-MM-DD"', () => {
      const dateString = '2022-07-25T14:30:00.000Z';
      const expectedFormattedDate = '2022-07-25';
      expect(DateUtils.formatDateString(dateString)).toBe(expectedFormattedDate);
    });
  });

  describe('DateUtils', () => {
    describe('formatDateStringToYYYYMMDD', () => {
      it('should return an empty string when input is null or undefined', () => {
        expect(DateUtils.formatDateStringToYYYYMMDD(null)).toBe('');
        expect(DateUtils.formatDateStringToYYYYMMDD(undefined)).toBe('');
      });
  
      it('should return a formatted date string when input is a valid date string', () => {
        const input = '2022-07-25T14:30:00.000Z';
        const expectedOutput = '2022-07-25';
        expect(DateUtils.formatDateStringToYYYYMMDD(input)).toBe(expectedOutput);
      });
  
      it('should return a formatted date string when input is a valid date string with different date values', () => {
        const input = '1999-12-31T23:59:59.999Z';
        const expectedOutput = '1999-12-31';
        expect(DateUtils.formatDateStringToYYYYMMDD(input)).toBe(expectedOutput);
      });
  
      it('should return an empty string when input is an invalid date string', () => {
        const input = ' invalid date string ';
        expect(DateUtils.formatDateStringToYYYYMMDD(input)).toBe('');
      });
  
      it('should return an empty string when input is a date string without the "T" separator', () => {
        const input = '2022-07-25 14:30:00.000Z';
        expect(DateUtils.formatDateStringToYYYYMMDD(input)).toBe('');
      });
    });
  });
});