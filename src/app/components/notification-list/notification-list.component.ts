import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { SystemNotifications } from '../../interfaces/system-notifications';
import { LoaderService } from '../../services/loader/loader.service';
// import { LocalStorageService } from '../../services/local-storage/local-storage.service';
// import { NotificationSignalRService } from '../../services/notification-signal-r/notification-signal-r.service';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css'],
})
export class NotificationListComponent implements OnInit {
  notifications: SystemNotifications[] = [];
  categorizedNotifications: { [key: string]: SystemNotifications[] } = {};
  objectKeys = Object.keys;

  private maxCacheSize = 50;
  private currentPage = 1;
  private pageSize = 20;
  public isLoading = false;
  private pagesInMemory: Set<number> = new Set();
  public hasMoreDown = true; // For downward scrolling
  private hasMoreUp = false; // For upward scrolling
  isLoadingInitialPage: boolean = false;
  // loggedInUser: any;

  constructor(
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    // private localStorageService: LocalStorageService,
    // private signalRService: NotificationSignalRService
  ) {}

  ngOnInit(): void {
    this.isLoadingInitialPage = true;
    this.loaderService.showLoader();
    this.loadPage(this.currentPage);
    // this.loggedInUser = this.localStorageService.getLoggedInUserData();
    // this.signalRService.NotificationReceived$.subscribe((message) => {
    //   if (message) {
    //     this.loadPage(1);
    //   }
    // });
  }

  /**
   * Fetch notifications for a specific page.
   */
  loadPage(page: number): void {
    if (this.isLoading || this.pagesInMemory.has(page)) {
      return;
    }

    this.isLoading = true;
    this.notificationService
      .getAllNotifications(page, this.pageSize)
      .subscribe({
        next: (response) => {
          const newNotifications = response.data.data || [];

          if (newNotifications.length > 0) {
            // Add new notifications to the appropriate position
            if (page < this.currentPage) {
              this.notifications = [...newNotifications, ...this.notifications];
            } else {
              this.notifications = [...this.notifications, ...newNotifications];
            }

            // Categorize notifications
            this.categorizeNotifications(this.notifications);

            // Update state
            this.pagesInMemory.add(page);
            this.currentPage = page;
            this.hasMoreUp = page > 1; // If not on the first page, upward scrolling is possible
            this.hasMoreDown = newNotifications.length === this.pageSize; // Check if more data is available below
          }

          this.isLoading = false;
          this.loaderService.hideLoader();
          this.isLoadingInitialPage = false;
        },
        error: () => {
          console.error(`Failed to fetch notifications for page ${page}`);
          this.isLoading = false;
          this.loaderService.hideLoader();
          this.isLoadingInitialPage = false;
        },
      });
  }

  /**
   * Purge data to maintain cache size.
   */
  purgeData(): void {
    if (this.notifications.length > this.maxCacheSize) {
      const pages = Array.from(this.pagesInMemory).sort((a, b) => a - b);
      const oldestPage = pages[0];
      const newestPage = pages[pages.length - 1];

      if (this.currentPage === oldestPage) {
        // Purge from the end
        const startIndex = (newestPage - 1) * this.pageSize;
        this.notifications = this.notifications.slice(0, startIndex);
        this.pagesInMemory.delete(newestPage);
      } else if (this.currentPage === newestPage) {
        // Purge from the beginning
        const endIndex = this.pageSize;
        this.notifications = this.notifications.slice(endIndex);
        this.pagesInMemory.delete(oldestPage);
      }

      // Re-categorize notifications after purging
      this.categorizeNotifications(this.notifications);
    }
  }

  /**
   * Categorize notifications based on date (Today, Yesterday, etc.).
   */
  categorizeNotificationsOld(notifications: SystemNotifications[]): void {
    const categorized: { [key: string]: SystemNotifications[] } = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.createdOn);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let dateKey: string;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }

      if (!categorized[dateKey]) {
        categorized[dateKey] = [];
      }
      categorized[dateKey].push(notification);
    });

    this.categorizedNotifications = categorized;
  }

  categorizeNotifications(notifications: SystemNotifications[]): void {
    const categorized: { [key: string]: SystemNotifications[] } = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.createdOn);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      let dateKey: string;

      // Check if the notification date is today
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      }

      // Check if the notification date is yesterday
      else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      }
      // For other dates, format as "Day, dd-MMM-yyyy"
      else {
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayNumber = date.toLocaleDateString('en-US', { day: '2-digit' });
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.toLocaleDateString('en-US', { year: 'numeric' });

        dateKey = `${day}, ${dayNumber}-${month}-${year}`;
      }

      // Initialize the array for the dateKey if it doesn't exist
      if (!categorized[dateKey]) {
        categorized[dateKey] = [];
      }
      // Push the notification into the categorized array
      categorized[dateKey].push(notification);
    });

    this.categorizedNotifications = categorized;
  }

  /**
   * Scroll handler for infinite scrolling.
   */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.scrollY;
    const scrollBottom = window.scrollY + window.innerHeight;
    const threshold = 200;

    // Load previous page when scrolling up
    if (scrollTop < threshold && this.hasMoreUp && !this.isLoading) {
      const previousPage = Math.max(...this.pagesInMemory) - 1;
      this.loadPage(previousPage);
      this.purgeData();
    }

    // Load next page when scrolling down
    if (
      scrollBottom > document.documentElement.scrollHeight - threshold &&
      this.hasMoreDown &&
      !this.isLoading
    ) {
      const nextPage = Math.min(...this.pagesInMemory) + 1;
      this.loadPage(nextPage);
      this.purgeData();
    }
  }

  /**
   * View More Button handler to load the next page explicitly.
   */
  onViewMore(): void {
    if (this.hasMoreDown) {
      const nextPage = Math.min(...this.pagesInMemory) + 1;
      this.loadPage(nextPage);
    }
  }

  markSystemNotificationAsRead(notification: SystemNotifications): void {
    if (notification.hasRead || notification.isLoading) {
      return; // Already marked as read, no action needed
    }

    notification.isLoading = true;

    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => {
        // Update local state to mark the notification as read
        notification.hasRead = true;
        notification.isLoading = false;

        this.notificationService.notifyNotificationUpdate();
      },
      error: (err) => {
        notification.isLoading = false;
        console.error(`Failed to mark notification as read: ${err.message}`);
      },
    });
  }

  getRelativeTimeOld(createdOn: Date): string {
    return formatDistanceToNow(createdOn, { addSuffix: false }).replace(
      'about ',
      ''
    );
  }

  getRelativeTime(createdOn: Date): string {
    const date = new Date(createdOn);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Set to false if you want 24-hour format
    });
  }
}
