import { DatePipe } from "@angular/common";

import { formatDate } from '@angular/common';
export class DateUtils {
  datePipe = new DatePipe("en-US");
  formatTimestamp(date: Date | null | string, forChat?: boolean): string {
    const now = new Date();
    if (date === null) {
      return "";
    }
    // Convert to Date if the input is not a Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    // Check if date is still not a valid Date object after conversion
    if (isNaN(date.getTime())) {
      console.error("Invalid date provided:", date);
      return "";
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
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
      } else if (minutes > 0) {
        return minutes === 1 ? "1 min ago" : `${minutes} mins ago`;
      } else {
        return "just now";
      }
    } else if (forChat) {
      return this.datePipe.transform(date, "hh:mm a") || "";
    }

    // If the date is from a same  year
    if (date.getFullYear() === now.getFullYear()) {
      return this.datePipe.transform(date, "d MMM - hh:mm a") || "";
    }
    return this.datePipe.transform(date, "d MMM yyyy - hh:mm a") || "";
  }

  // Format timestamp for chat UserList and ChatScreen
  timeStampForChat(
    date: Date | null | string,
    divider: boolean = false
  ): string {
    if (date === null) {
      return "";
    }

    // Convert to Date if the input is not a Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    // Check if date is still not a valid Date object after conversion
    if (isNaN(date.getTime())) {
      console.error("Invalid date provided:", date);
      return "";
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
      return "Today";
    }

    // If the date is today and is a divider
    else if (dateToCheck.getTime() === today.getTime()) {
      return `${this.datePipe.transform(date, "hh:mm a")}`;
    }

    // If the date is yesterday
    if (dateToCheck.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }

    // If the date is within the last 7 days but not today or yesterday
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    if (dateToCheck > lastWeek) {
      return date.toLocaleDateString("en-US", { weekday: "long" }); // Return day name
    }

    // If the date is from a different year
    if (date.getFullYear() !== now.getFullYear()) {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    // For dates that are not today, yesterday, or within the last week
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  }

  /**
   * Converts a date string in the format "YYYY-MM-DDTHH:MM:SS.SSSZ" to "YYYY-MM-DD".
   * @param dateString The date string to format.
   * @returns The formatted date string.
   */
  static formatDateString(
    dateString: string | null | undefined
  ): string | null {
    if (!dateString) {
      return null; // return null if input is null, empty, or undefined
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; // return null if input string is not a valid date
    }

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  /**
   * Converts a date string in the format "YYYY-MM-DDTHH:MM:SS.SSSZ" to "YYYY-MM-DD".
   * Returns an empty string if the input is null or undefined.
   * @param {string | null | undefined} dateString The date string to convert
   * @returns {string} The converted date string
   */

  static formatDateToDateTime(inputDate: string): string {
    // Split the input date string into components
    const [month, day, year] = inputDate.split("/").map(Number);

    // Create a new Date object using the extracted components
    const date = new Date(year, month - 1, day);

    // Convert the Date object to ISO 8601 format
    const isoDateTime = date.toISOString();

    return isoDateTime;
  }

  static strFormatToDDMMYYYY(inputDateStr: string): string {
    const date = new Date(inputDateStr);
    // Check for invalid date
    if (isNaN(date.getTime())) {
      // Use today's date if invalid
      const today = new Date();
      return DateUtils.DDMMYYYY(today);
    }
    return DateUtils.DDMMYYYY(date);
  }

  static DDMMYYYY(date: Date): string {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  static formatStringDate(dateString: string) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  static IstDate(dateValue: any) {
    return formatDate(dateValue, 'yyyy-MM-ddTHH:mm:ss', 'en-IN');
  }

  static CorrectedDate(dateValue: any) { // use only when you are sending date to api/backend
    
    const selectedDate1 = new Date(
      // this.expen
      // seDetailsForm.value["expenseDate"]
      dateValue);
    // // Ensure the date is valid
    if (!isNaN(selectedDate1.getTime())) {
      const day = selectedDate1.getDate().toString().padStart(2, "0");
      const month = (selectedDate1.getMonth() + 1)
        .toString()
        .padStart(2, "0"); // Months are 0-based
      const year = selectedDate1.getFullYear();

      // Format the date as DD/MM/YYYY
      const returnDate = new Date(`${year}-${day}-${month}T00:00:00`);
      returnDate.setHours(0, 0, 0, 0);
      return DateUtils.IstDate(returnDate);

    } else {
      // Split the string and create a Date object in 'yyyy-MM-dd' format.
      const [day, month, year] = dateValue
        .split("/")
        .map(Number);
      const returnDate = new Date(new Date(year, month - 1, day)); // month is 0-indexed
      returnDate.setHours(0, 0, 0, 0);
      return DateUtils.IstDate(returnDate);
    }
  }

  static GetDateBeforeDays(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return DateUtils.IstDate(date);
  }
}
