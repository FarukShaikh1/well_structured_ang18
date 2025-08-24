import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { GlobalService } from "../../../services/global/global.service";
import { LocalStorageService } from "../../../services/local-storage/local-storage.service";
import { LogoutService } from "../../../services/logout/logout.service";
// import { SignalRService } from '../../../services/signal-r/signal-r.service';
import { formatDistanceToNow } from "date-fns";
import {
  ApplicationConstants,
  ActionConstant,
  ApplicationModules,
  ApplicationRoles,
  NavigationURLs,
} from "../../../../utils/application-constants";
import { ModuleResponse } from "../../../interfaces/module-response";
import { SystemNotifications } from "../../../interfaces/system-notifications";
import { NotificationService } from "../../../services/notification/notification.service";
import { RoleService } from "../../../services/role/role.service";
import { ConfirmBoxComponent } from "../confirm-box/confirm-box.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  imports: [CommonModule, ConfirmBoxComponent],
  styleUrls: ["./header.component.css"],
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild("notificationDropdown") notificationDropdown!: ElementRef;
  showNotifications = false;
  NOTIFICATION_INITIAL_PAGE_NO = 1;
  NOTIFICATION_INITIAL_PAGE_SIZE = 5;
  notifications: SystemNotifications[] = [];
  notificationTotalUnreadCount: number = 0;
  showNotificationList: boolean = false;

  @ViewChild(ConfirmBoxComponent)
  confirmationPopupComponent!: ConfirmBoxComponent;
  Modules = ApplicationModules;
  ActionConstant = ActionConstant;
  NavigationURLs = NavigationURLs;
  roles = ApplicationRoles;
  loginDisplay = false;
  loggedInUsername: string = "";

  notificationsCount: number = 0;
  alreadyLoggedIn: boolean = true;
  profilePicUrl: string = "../../../assets/icons/user1icon.png";
  ApplicationRoles = ApplicationRoles;
  loggedInUserName: string = "";
  userNameInitials: string = "";
  moduleList: ModuleResponse[] = [];
  // profilePicUrl: string = '';

  constructor(
    private router: Router,
    public localStorageService: LocalStorageService,
    public globalService: GlobalService,
    // private signalRService: SignalRService,
    private logoutService: LogoutService,
    private roleService: RoleService,
    private notificationService: NotificationService
  ) {
    this.globalService.getReloadObservable().subscribe(() => {
      this.alreadyLoggedIn = localStorageService.isAuthenticated();
    });
  }

  ngOnDestroy(): void {
    this.loggedInUsername = "";
    // Unsubscribe SignalR
  }

  ngOnInit(): void {
    this.setLoginDisplay();
    this.alreadyLoggedIn = this.localStorageService.isAuthenticated();
    this.loggedInUserName = this.getLoggedInUserName();
    this.userNameInitials = this.getUserNameInitials();
    this.getModuleList();
  }

  getModuleList() {
    this.moduleList = this.globalService.AccessibleModuleList();
    // this.roleService.getModuleList().subscribe({
    //     next: (res: any) => {
    //       this.moduleList = res;
    //     },
    //     error: (error: any) => {
    //       //this.globalService.openSnackBar('some issue is in update the data');
    //       return;
    //     },
    //   });

    // const userData = this.localStorageService.getLoggedInUserData();
    // if (userData) {
    //     this.moduleList = userData.accessibleModuleIds;
    // }
  }

  isActiveMenu(route: string): boolean {
    
    return this.router.url.includes(route);
  }
  navigate(route: string) {
    
    this.router.navigate([route]);
  }
  setLoginDisplay() {
    // this.loginDisplay =
    //   this.ssoInitializationService.authService.instance.getAllAccounts()
    //     .length > 0;
  }

  isUserAuthorized(): boolean {
    return this.localStorageService.isUserAuthorized();
  }

  goToProfilePage() {
    this.router.navigate([NavigationURLs.USER_PROFILE]);
  }

  logout() {
    this.confirmationPopupComponent.openConfirmModal(
      "Confirmation",
      "Are you sure you want to log out?"
    );
  }

  handleConfirmResult(result: any) {
    if (result) {
      this.notificationsCount = 0;
      this.logoutService.logout();
    }
  }

  showNotificationIcon(): boolean {
    if (
      (this.alreadyLoggedIn || this.loginDisplay) &&
      this.isUserAuthorized()
    ) {
      return true;
    }
    return false;
  }

  showSettingsIcon(): boolean {
    if (
      (this.alreadyLoggedIn || this.loginDisplay) &&
      this.isUserAuthorized()
    ) {
      return true;
    }
    return false;
  }

  showLogoutButton(): boolean {
    if (this.alreadyLoggedIn || this.loginDisplay) {
      return true;
    }
    return false;
  }

  getLoggedInUserName(): string {
    return this.localStorageService.getLoggedInUserData()?.userName;
  }

    getLoggedInUser(): string {
    return this.localStorageService.getLoggedInUserData();
  }

  clientList() {
    this.router.navigate([NavigationURLs.CLIENT_LIST]);
  }

  navigateToExpenseList() {
    this.router.navigate([NavigationURLs.EXPENSE_LIST]);
  }

  navigateToExpenseSummaryList() {
    this.router.navigate([NavigationURLs.EXPENSE_SUMMARY_LIST]);
  }

  navigateToDayList() {
    this.router.navigate([NavigationURLs.DAY_LIST]);
  }

  navigateToUserList() {
    this.router.navigate([NavigationURLs.USER_LIST]);
  }

  navigateToCurrencyList() {
    this.router.navigate([NavigationURLs.CURRENCY_LIST]);
  }

  userPermissions() {
    this.router.navigate([NavigationURLs.ROLE_MODULE_MAPPING]);
  }

  goToPrograms() {
    this.router.navigate([NavigationURLs.PROGRAMS]);
  }

  chatSystem() {
    // this.router.navigate([NavigationURLs.NAV_CHAT_PANEL]);
  }

  getUserNameInitials(): string {
    const fullName =
      this.localStorageService.getLoggedInUserData()?.firstName +
      " " +
      this.localStorageService.getLoggedInUserData()?.lastName;
    if (!fullName) {
      return "";
    }

    const nameParts = fullName.split(" ").filter((part) => part.trim());

    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase();
    } else if (nameParts.length >= 2) {
      const firstInitial = nameParts[0][0];
      const secondInitial = nameParts[1][0];
      return (firstInitial + secondInitial).toUpperCase();
    }

    return "";
  }

  goToChangePasswordPage() {
    this.router.navigate([NavigationURLs.CHANGE_PASSWORD]);
  }

  /* ********************** System notification *********************** */

  fetchAllSystemNotifications() {
    this.notificationService
      .getAllNotifications(
        this.NOTIFICATION_INITIAL_PAGE_NO,
        this.NOTIFICATION_INITIAL_PAGE_SIZE
      )
      .subscribe((notifications) => {
        if (notifications.data.data) {
          this.notifications = notifications.data.data
            .sort(
              (
                a: { createdOn: string | number | Date },
                b: { createdOn: string | number | Date }
              ) =>
                new Date(b.createdOn).getTime() -
                new Date(a.createdOn).getTime()
            )
            .slice(
              0,
              ApplicationConstants.NUMBER_OF_TOP_SYSTEM_NOTIFICATIONS_TO_SHOW
            );

          this.notificationTotalUnreadCount =
            notifications.data.unreadNotificationCount;

          // Update the unread notification count in the shared service
          this.notificationService.updateUnreadNotificationCount(
            this.notificationTotalUnreadCount
          );
        }
      });
  }

  toggleSystemNotificationList() {
    this.showNotificationList = !this.showNotificationList;
  }

  closeSystemNotificationList() {
    this.showNotificationList = false;
  }

  @HostListener("document:click", ["$event.target"])
  onClickOutside(targetElement: HTMLElement) {
    if (
      this.notificationDropdown &&
      !this.notificationDropdown.nativeElement.contains(targetElement)
    ) {
      this.closeSystemNotificationList();
    }
  }

  markSystemNotificationAsRead(notification: SystemNotifications) {
    if (notification.hasRead || notification.isLoading) {
      return; // Already marked as read, no action needed
    }

    notification.isLoading = true;
    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => {
        this.fetchAllSystemNotifications(); // Refresh notifications
        notification.isLoading = false;
      },
      error: (err) => {
        notification.isLoading = false;
        console.error(`Failed to mark notification as read: ${err.message}`);
      },
    });
  }

  viewAllSystemNotifications() {
    this.router.navigate([NavigationURLs.ALL_NOTIFICATIONS]);
    this.closeSystemNotificationList();
  }

  getRelativeTime(createdOn: Date): string {
    return formatDistanceToNow(createdOn, { addSuffix: true });
  }
}
