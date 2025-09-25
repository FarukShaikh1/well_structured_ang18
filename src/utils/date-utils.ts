import { DatePipe } from "@angular/common";

import { formatDate } from '@angular/common';
export class DateUtils {
  datePipe = new DatePipe("en-US");
  formatTimestamp(date: Date | null | string, forChat?: boolean): string {
    const now = new Date();
    if (date === null) {
      return "";
    }
    
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    
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

    
    if (date.getFullYear() === now.getFullYear()) {
      return this.datePipe.transform(date, "d MMM - hh:mm a") || "";
    }
    return this.datePipe.transform(date, "d MMM yyyy - hh:mm a") || "";
  }

  
  timeStampForChat(
    date: Date | null | string,
    divider: boolean = false
  ): string {
    if (date === null) {
      return "";
    }

    
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    
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

    
    if (dateToCheck.getTime() === today.getTime() && divider) {
      return "Today";
    }

    
    else if (dateToCheck.getTime() === today.getTime()) {
      return `${this.datePipe.transform(date, "hh:mm a")}`;
    }

    
    if (dateToCheck.getTime() === yesterday.getTime()) {
      return "Yesterday";
    }

    
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);

    if (dateToCheck > lastWeek) {
      return date.toLocaleDateString("en-US", { weekday: "long" }); 
    }

    
    if (date.getFullYear() !== now.getFullYear()) {
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  }

  
  static formatDateString(
    dateString: string | null | undefined
  ): string | null {
    if (!dateString) {
      return null; 
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null; 
    }

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); 
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  

  static formatDateToDateTime(inputDate: string): string {
    
    const [month, day, year] = inputDate.split("/").map(Number);

    
    const date = new Date(year, month - 1, day);

    
    const isoDateTime = date.toISOString();

    return isoDateTime;
  }

  static strFormatToDDMMYYYY(inputDateStr: string): string {
    const date = new Date(inputDateStr);
    
    if (isNaN(date.getTime())) {
      
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
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  static IstDate(dateValue: any) {
    return formatDate(dateValue, 'yyyy-MM-ddTHH:mm:ss', 'en-IN');
  }

  static CorrectedDate(dateValue: any) { 
    
    const selectedDate1 = new Date(
      
      
      dateValue);
    
    if (!isNaN(selectedDate1.getTime())) {
      const day = selectedDate1.getDate().toString().padStart(2, "0");
      const month = (selectedDate1.getMonth() + 1)
        .toString()
        .padStart(2, "0"); 
      const year = selectedDate1.getFullYear();

      
      const returnDate = new Date(`${year}-${day}-${month}T00:00:00`);
      returnDate.setHours(0, 0, 0, 0);
      return DateUtils.IstDate(returnDate);

    } else {
      
      const [day, month, year] = dateValue
        .split("/")
        .map(Number);
      const returnDate = new Date(new Date(year, month - 1, day)); 
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
