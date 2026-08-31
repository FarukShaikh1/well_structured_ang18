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

import { formatDistanceToNow } from "date-fns";
import {
  ActionConstant,
  ApplicationConstants,
  ApplicationModules,
  ApplicationRoles,
  NavigationURLs,
  RoutePathTitles
} from "../../../../utils/application-constants";
import { ModuleResponse } from "../../../interfaces/module-response";
import { SystemNotifications } from "../../../interfaces/system-notifications";
import { NotificationService } from "../../../services/notification/notification.service";
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
  isMenuOpen: boolean = false;

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
  isDarkMode: boolean = false;
  thumbnailUrl: string = '';
  ImageUrl: string = '';


  constructor(
    private router: Router,
    public localStorageService: LocalStorageService,
    public globalService: GlobalService,
    private logoutService: LogoutService,
    private notificationService: NotificationService
  ) {
    this.globalService.getReloadObservable().subscribe(() => {
      this.alreadyLoggedIn = localStorageService.isAuthenticated();
    });
  }

  ngOnDestroy(): void {
    this.loggedInUsername = "";

  }

  async ngOnInit() {
    this.setLoginDisplay();
    this.alreadyLoggedIn = this.localStorageService.isAuthenticated();
    this.loggedInUserName = this.getLoggedInUserName();
    this.userNameInitials = this.getUserNameInitials();
    this.thumbnailUrl = this.localStorageService.getLoggedInUserData()?.thumbnailPathSasUrl || '';
    this.ImageUrl = this.localStorageService.getLoggedInUserData()?.imagePathSasUrl || '';
    debugger;
    await this.getModuleList();
  }

  getModuleList() {
    debugger;
    this.moduleList = this.localStorageService.getLoggedInUserPermissions();
    if (this.moduleList?.length == 0) {
      this.globalService.getUserPermissionData().subscribe({
        next: (result) => {
          console.log("Permission result:", result);
          this.moduleList = this.localStorageService.getLoggedInUserPermissions();
          this.moduleList = this.moduleList.filter((module: any) => {
            if (module.moduleName === RoutePathTitles.EXPENSES) {
              // For Expenses: view AND add both must be true
              return module.view === true && module.add === true;
            }
            // For all others: only view must be true
            return module.view === true;
          });
        },
        error: (error) => {
          console.error("Permission error:", error);
        },
        complete: () => {
          console.log("Permission request completed");
        }
      });
    }
  }

  isActiveMenu(route: string): boolean {

    return this.router.url.includes(route);
  }
  navigate(route: string) {
    console.log('route clicked : ', route);

    this.router.navigate([route]);
  }


  setLoginDisplay() {



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

  navigateToUserPermissions() {
    this.router.navigate([NavigationURLs.ROLE_MODULE_MAPPING]);
  }

  goToPrograms() {
    this.router.navigate([NavigationURLs.PROGRAMS]);
  }

  navigateToChatSystem() {

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

  goToPlansPage() {
    this.router.navigate([NavigationURLs.PLANS]);
  }



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

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
      return;
    }

    notification.isLoading = true;
    this.notificationService.markAsRead(notification.notificationId).subscribe({
      next: () => {
        this.fetchAllSystemNotifications();
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
