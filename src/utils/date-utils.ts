import { DatePipe } from '@angular/common';

export class DateUtils {
  datePipe = new DatePipe('en-US');
  formatTimestamp(date: Date | null | string, forChat?: boolean): string {
    const now = new Date();
    if (date === null) {
      return '';
    }
    // Convert to Date if the input is not a Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    // Check if date is still not a valid Date object after conversion
    if (isNaN(date.getTime())) {
      console.error('Invalid date provided:', date);
      return '';
    }

    const timeDiff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // Check if date is today
    if (dateToCheck.getTime() === today.getTime()) {
      if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      } else if (minutes > 0) {
        return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
      } else {
        return 'just now';
      }
    } else if (forChat) {
      return this.datePipe.transform(date, 'hh:mm a') || '';
    }

    // If the date is from a same  year
    if (date.getFullYear() === now.getFullYear()) {
      return this.datePipe.transform(date, 'd MMM - hh:mm a') || '';
    }
    return this.datePipe.transform(date, 'd MMM yyyy - hh:mm a') || '';
  }

  // Format timestamp for chat UserList and ChatScreen
  timeStampForChat(date: Date | null | string, divider: boolean = false): string {
    if (date === null) {
      return '';
    }

    // Convert to Date if the input is not a Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    // Check if date is still not a valid Date object after conversion
    if (isNaN(date.getTime())) {
      console.error('Invalid date provided:', date);
      return '';
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateToCheck = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    // If the date is today and not a divider
    if (dateToCheck.getTime() === today.getTime() && divider) {
      return 'Today';
    }

    // If the date is today and is a divider
    else if (dateToCheck.getTime() === today.getTime()) {
      return `${this.datePipe.transform(date, 'hh:mm a')}`;
    }

    // If the date is yesterday
    if (dateToCheck.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }

    // If the date is within the last 7 days but not today or yesterday
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    if (dateToCheck > lastWeek) {
      return date.toLocaleDateString('en-US', { weekday: 'long' }); // Return day name
    }

    // If the date is from a different year
    if (date.getFullYear() !== now.getFullYear()) {
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    // For dates that are not today, yesterday, or within the last week
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }

  /**
   * Converts a date string in the format "YYYY-MM-DDTHH:MM:SS.SSSZ" to "YYYY-MM-DD".
   * @param dateString The date string to format.
   * @returns The formatted date string.
   */
  static formatDateString(dateString: string | null | undefined): string | null {
    if (!dateString) {
      return null; // return null if input is null, empty, or undefined
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; // return null if input string is not a valid date
    }

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  /**
   * Converts a date string in the format "YYYY-MM-DDTHH:MM:SS.SSSZ" to "YYYY-MM-DD".
   * Returns an empty string if the input is null or undefined.
   * @param {string | null | undefined} dateString The date string to convert
   * @returns {string} The converted date string
   */
  static formatDateStringToYYYYMMDD(dateString: string | null | undefined): string {
    if (!dateString) {
      return '';
    }

    if (!dateString.includes('T')) {
      return ''; // date string without "T" separator
    }

    const dateParts = dateString.split('T')[0].split('-');
    if (dateParts.length !== 3) {
      return ''; // invalid date string
    }

    const [year, month, day] = dateParts;
    if (!year || !month || !day) {
      return ''; // invalid date string
    }

    return `${year}-${month}-${day}`;
  }

static formatDateToDateTime(inputDate: string): string {
  // Split the input date string into components
  const [month, day, year] = inputDate.split('/').map(Number);

  // Create a new Date object using the extracted components
  const date = new Date(year, month - 1, day);

  // Convert the Date object to ISO 8601 format
  const isoDateTime = date.toISOString();

  return isoDateTime;
}

convertDDMMYYYYToDate(dateString: string): Date {
  const [day, mon, year] = dateString.split('/').map(Number);
  // Months are 0-based in JavaScript Date objects, so subtract 1 from month
  return new Date(year, mon - 1, day);
}
  formatDateToMMDDYYYY(date: Date): string {
    // Check if the provided date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
    // If invalid, set date to 60 days ago
    // date.setDate(date.getDate() - 60);
  }
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const dd = ('0' + date.getDate()).slice(-2);
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  }


}
