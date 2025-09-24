import { Routes } from "@angular/router";
import { ApplicationModules } from "../utils/application-constants";
import { CurrencyCoinComponent } from "./components/currency-coin/currency-coin.component";
import { CurrencyGalleryComponent } from "./components/currency-gallery/currency-gallery.component";
import { CurrencySummaryComponent } from "./components/currency-summary/currency-summary.component";
import { DayDetailsComponent } from "./components/day-details/day-details.component";
import { DayComponent } from "./components/day/day.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { TransactionComponent } from "./components/transaction/transaction.component";
import { authGuard } from "./guards/auth.guard";
import { publicGuard } from "./guards/public.guard";
export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "login",
    title: "Login",
    loadComponent: () =>
      import("./components/login/login.component").then(
        (m) => m.LoginComponent
      ),
    canActivate: [publicGuard],
  },
  {
    path: "logout",
    loadComponent: () =>
      import("./components/logout/logout.component").then(
        (m) => m.LogoutComponent
      ),
  },
  {
    path: "home",
    title: "Home",
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "expenses", pathMatch: "full" },
      {
        path: "day",
        title: "Day",
        children: [
          { path: "", component: DayComponent },
          { path: "day-details", component: DayDetailsComponent },
        ],
      },
      {
        path: "expenses",
        title: "Transactions",
        component: TransactionComponent,
        // component: ExpenseComponent,
      },
      // { path: "expense-summary", component: ExpenseSummaryComponent },
      // { path: "expense-report", component: ExpenseReportComponent },
      {
        path: "currency-coin",
        title: "Currency Collection",
        component: CurrencyCoinComponent,
      },
      {
        path: "currency-summary",
        title: "Currency summary",
        component: CurrencySummaryComponent,
      },
      {
        path: "currency-gallery",
        component: CurrencyGalleryComponent,
      },
      {
        path: "manage-users",
        title: "Users",
        loadComponent: () =>
          import("./components/user-list/user-list.component").then(
            (m) => m.UserListComponent
          ),
        // canActivate: [moduleAccessGuard],
        data: { moduleName: ApplicationModules.USER },
      },
      {
        path: "user-permission",
        title: "Role Access",
        loadComponent: () =>
          import(
            "./components/user-permission/user-permission.component"
          ).then((m) => m.UserPermissionComponent),
        // canActivate: [moduleAccessGuard],
        data: { moduleName: ApplicationModules.USER_PERMISSIONS },
      },
      {
        path: "settings",
        title: "Settings",
        component: SettingsComponent,
        // canActivate: [moduleAccessGuard],
      },
      {
        path: "change-password",
        title: "Change Password",
        loadComponent: () =>
          import("./components/change-password/change-password.component").then(
            (m) => m.ChangePasswordComponent
          ),
      },
      // {
      //   path: 'nav-chat-panel',
      //   title: 'Chat Panel',
      //   loadComponent: () =>
      //     import('./components/nav-chat-panel/nav-chat-panel.component').then(
      //       (m) => m.NavChatPanelComponent
      //     ),
      // },
      {
        path: "unauthorised",
        title: "Unauthorised User",
        loadComponent: () =>
          import(
            "./components/shared/unauthorised-error-page/unauthorised-error.component"
          ).then((m) => m.UnauthorisedErrorComponent),
      },
      {
        path: "notifications",
        title: "Notifications",
        loadComponent: () =>
          import("./components/notification-list/notification-list.component").then(
            (m) => m.NotificationListComponent
          ),
      },
      {
        path: "reset-password",
        title: "Reset Password",
        loadComponent: () =>
          import("./components/reset-password/reset-password.component").then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: "forgot-password",
        title: "Forgot Password",
        loadComponent: () =>
          import("./components/forgot-password/forgot-password.component").then(
            (m) => m.ForgotPasswordComponent
          ),
      },
      {
        path: "unauthorised",
        title: "Unauthorised User",
        loadComponent: () =>
          import(
            "./components/shared/unauthorised-error-page/unauthorised-error.component"
          ).then((m) => m.UnauthorisedErrorComponent),
      },
    ],
  },

  { path: "**", redirectTo: "expenses" },
];
