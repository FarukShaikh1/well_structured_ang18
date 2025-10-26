import { Routes } from "@angular/router";
import { ApplicationModules, RoutePath, RoutePathTitles } from "../utils/application-constants";
import { CurrencyCoinComponent } from "./components/currency-coin/currency-coin.component";
import { DayComponent } from "./components/day/day.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { TransactionComponent } from "./components/transaction/transaction.component";
import { authGuard } from "./guards/auth.guard";
import { publicGuard } from "./guards/public.guard";
export const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: RoutePath.HOME,
    title: RoutePathTitles.HOME,
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
    children: [
      { path: "", redirectTo: RoutePath.CURRENCY_LIST, pathMatch: "full" },
      {
        path: RoutePath.CURRENCY_LIST,
        title: RoutePathTitles.CURRENCY_LIST,
        component: CurrencyCoinComponent,
      },
    ],
  },

  {
    path: RoutePath.HOME,
    title: RoutePathTitles.HOME,
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: RoutePath.EXPENSES, pathMatch: "full" },
      {
        path: RoutePath.DAY_LIST,
        title: RoutePathTitles.DAY_LIST,
        component: DayComponent
      },
      {
        path: RoutePath.EXPENSES,
        title: RoutePathTitles.EXPENSES,
        component: TransactionComponent
      },
      {
        path: RoutePath.USER_LIST,
        title: RoutePathTitles.USER_LIST,
        loadComponent: () =>
          import("./components/user-list/user-list.component").then(
            (m) => m.UserListComponent
          ),
        data: { moduleName: ApplicationModules.USER },
      },
      {
        path: RoutePath.USER_PERMISSIONS,
        title: RoutePathTitles.USER_PERMISSIONS,
        loadComponent: () =>
          import(
            "./components/user-permission/user-permission.component"
          ).then((m) => m.UserPermissionComponent),

        data: { moduleName: ApplicationModules.USER_PERMISSIONS },
      },
      {
        path: RoutePath.SETTINGS,
        title: RoutePathTitles.SETTINGS,
        component: SettingsComponent,

      },
      {
        path: RoutePath.CHANGE_PASSWORD,
        title: RoutePathTitles.CHANGE_PASSWORD,
        loadComponent: () =>
          import("./components/change-password/change-password.component").then(
            (m) => m.ChangePasswordComponent
          ),
      },
      {
        path: RoutePath.RESET_PASSWORD,
        title: RoutePathTitles.RESET_PASSWORD,
        loadComponent: () =>
          import("./components/reset-password/reset-password.component").then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: RoutePath.UNAUTHORIZED,
        title: RoutePathTitles.UNAUTHORIZED,
        loadComponent: () =>
          import(
            "./components/shared/unauthorised-error-page/unauthorised-error.component"
          ).then((m) => m.UnauthorisedErrorComponent),
      },
      {
        path: RoutePath.NOTIFICATIONS,
        title: RoutePathTitles.NOTIFICATIONS,
        loadComponent: () =>
          import("./components/notification-list/notification-list.component").then(
            (m) => m.NotificationListComponent
          ),
      },
    ],
  },
  {
    path: RoutePath.LOGIN,
    title: RoutePathTitles.LOGIN,
    loadComponent: () =>
      import("./components/login/login.component").then(
        (m) => m.LoginComponent
      ),
    canActivate: [publicGuard],
  },
  {
    path: RoutePath.OTP_VERIFICATION,
    title: RoutePathTitles.OTP_VERIFICATION,
    loadComponent: () =>
      import("./components/otp-verification/otp-verification.component").then(
        (m) => m.OTPVerificationComponent
      ),
  },
  {
    path: RoutePath.LOGOUT,
    title: RoutePathTitles.LOGOUT,
    loadComponent: () =>
      import("./components/logout/logout.component").then(
        (m) => m.LogoutComponent
      ),
  },
  {
    path: RoutePath.FORGOT_PASSWORD,
    title: RoutePathTitles.FORGOT_PASSWORD,
    loadComponent: () =>
      import("./components/forgot-password/forgot-password.component").then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: RoutePath.SIGNUP,
    title: RoutePathTitles.SIGNUP,
    loadComponent: () =>
      import("./components/sign-up/sign-up.component").then(
        (m) => m.SignUpComponent
      ),
  },

  { path: "**", redirectTo: RoutePath.EXPENSES },
];
