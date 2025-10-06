import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';
import { SystemNotifications } from '../../interfaces/system-notifications';
import { LoaderService } from '../../services/loader/loader.service';


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
  public hasMoreDown = true; 
  private hasMoreUp = false; 
  isLoadingInitialPage: boolean = false;
  

  constructor(
    private notificationService: NotificationService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.isLoadingInitialPage = true;
    this.loaderService.showLoader();
    this.loadPage(this.currentPage);
  }

  
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
            
            if (page < this.currentPage) {
              this.notifications = [...newNotifications, ...this.notifications];
            } else {
              this.notifications = [...this.notifications, ...newNotifications];
            }            
            this.categorizeNotifications(this.notifications);
            this.pagesInMemory.add(page);
            this.currentPage = page;
            this.hasMoreUp = page > 1; 
            this.hasMoreDown = newNotifications.length === this.pageSize; 
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

  purgeData(): void {
    if (this.notifications.length > this.maxCacheSize) {
      const pages = Array.from(this.pagesInMemory).sort((a, b) => a - b);
      const oldestPage = pages[0];
      const newestPage = pages[pages.length - 1];

      if (this.currentPage === oldestPage) {
        
        const startIndex = (newestPage - 1) * this.pageSize;
        this.notifications = this.notifications.slice(0, startIndex);
        this.pagesInMemory.delete(newestPage);
      } else if (this.currentPage === newestPage) {
        
        const endIndex = this.pageSize;
        this.notifications = this.notifications.slice(endIndex);
        this.pagesInMemory.delete(oldestPage);
      }

      
      this.categorizeNotifications(this.notifications);
    }
  }

  
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

      
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      }

      
      else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      }
      
      else {
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const dayNumber = date.toLocaleDateString('en-US', { day: '2-digit' });
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const year = date.toLocaleDateString('en-US', { year: 'numeric' });

        dateKey = `${day}, ${dayNumber}-${month}-${year}`;
      }

      
      if (!categorized[dateKey]) {
        categorized[dateKey] = [];
      }
      
      categorized[dateKey].push(notification);
    });

    this.categorizedNotifications = categorized;
  }

  
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.scrollY;
    const scrollBottom = window.scrollY + window.innerHeight;
    const threshold = 200;

    
    if (scrollTop < threshold && this.hasMoreUp && !this.isLoading) {
      const previousPage = Math.max(...this.pagesInMemory) - 1;
      this.loadPage(previousPage);
      this.purgeData();
    }
    
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

  
  onViewMore(): void {
    if (this.hasMoreDown) {
      const nextPage = Math.min(...this.pagesInMemory) + 1;
      this.loadPage(nextPage);
    }
  }

  markSystemNotificationAsRead(notification: SystemNotifications): void {
    if (notification.hasRead || notification.isLoading) {
      return; 
    }

    notification.isLoading = true;

    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => {
        
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
      hour12: false, 
    });
  }
}
