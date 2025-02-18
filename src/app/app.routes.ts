import { Routes } from '@angular/router';
import { ApplicationModules } from '../utils/application-constants';
import { CurrencyCoinDetailsComponent } from './components/currency-coin-details/currency-coin-details.component';
import { CurrencyCoinComponent } from './components/currency-coin/currency-coin.component';
import { DayDetailsComponent } from './components/day-details/day-details.component';
import { DayComponent } from './components/day/day.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { ExpenseReportComponent } from './components/expense-report/expense-report.component';
import { ExpenseSummaryComponent } from './components/expense-summary/expense-summary.component';
import { ExpenseComponent } from './components/expense/expense.component';
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    // canActivate: [publicGuard],
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('./components/logout/logout.component').then(
        (m) => m.LogoutComponent
      ),
  },
  {
    path: 'home',
    title: 'Home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    // canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'expense', pathMatch: 'full' },
      {
        path: 'day',
        children: [
          { path: '', component: DayComponent },
          { path: 'day-details', component: DayDetailsComponent },
        ]
      },
      { path: 'expense', component: ExpenseComponent },
      { path: 'expense-summary', component: ExpenseSummaryComponent },
      { path: 'expense-report', component: ExpenseReportComponent },
      { path: 'expense-details', component: ExpenseDetailsComponent },
      { path: 'currency-coin', component: CurrencyCoinComponent },
      { path: 'currency-coin-details', component: CurrencyCoinDetailsComponent },
      {
        path: 'manage-users',
        title: 'Users',
        loadComponent: () =>
          import('./components/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
        // canActivate: [moduleAccessGuard],
        data: { moduleName: ApplicationModules.USER },
      },
    ]
  },
  {
    path: 'role-module-mapping',
    loadComponent: () =>
      import(
        './components/role-module-mapping/role-module-mapping.component'
      ).then((m) => m.RoleModuleMappingComponent),
    // canActivate: [moduleAccessGuard],
    data: { moduleName: ApplicationModules.ROLE_MODULE_MAPPING },
  },
  {
    path: 'user-details',
    loadComponent: () =>
      import('./components/user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
  },
  {
    path: 'change-password',
    title: 'Change Password',
    loadComponent: () =>
      import('./components/change-password/change-password.component').then(
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
    path: 'unauthorised',
    title: 'Unauthorised User',
    loadComponent: () =>
      import(
        './components/shared/unauthorised-error-page/unauthorised-error.component'
      ).then((m) => m.UnauthorisedErrorComponent),
  },
  {
    path: 'notifications',
    title: 'Notifications',
    loadComponent: () =>
      import('./components/notification-list/notification-list.component').then((m) => m.NotificationListComponent),
  },
  { path: '**', redirectTo: 'pagenotfound' },
  {
    path: 'reset-password',
    title: 'Reset Password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'unauthorised',
    title: 'Unauthorised User',
    loadComponent: () =>
      import(
        './components/shared/unauthorised-error-page/unauthorised-error.component'
      ).then((m) => m.UnauthorisedErrorComponent),
  },
  { path: '**', redirectTo: 'expenses' },
];
// {
//     path: 'home',
//     title: 'Home',
//     loadComponent: () =>
//       import('./components/home/home.component').then((m) => m.HomeComponent),
//     canActivate: [authGuard],
//     children: [
//       { path: '', redirectTo: 'home', pathMatch: 'full' },
//       {
//       path: 'user',
//       title: 'Users',
//       loadComponent: () =>
//         import('./components/user-list/user-list.component').then(
//           (m) => m.UserListComponent
//         ),
//       canActivate: [moduleAccessGuard],
//       data: { moduleName: ApplicationModules.USER},
//     },
//   {
//     path: 'role-module-mapping',
//     loadComponent: () =>
//       import(
//         './components/role-module-mapping/role-module-mapping.component'
//       ).then((m) => m.RoleModuleMappingComponent),
//     canActivate: [moduleAccessGuard],
//     data: { moduleName: ApplicationModules.ROLE_MODULE_MAPPING },
//   },
//   {
//     path: 'change-password',
//     title: 'Change Password',
//     loadComponent: () =>
//       import('./components/change-password/change-password.component').then(
//         (m) => m.ChangePasswordComponent
//       ),
//   },
//   {
//     path: 'unauthorised',
//     title: 'Unauthorised User',
//     loadComponent: () =>
//       import(
//         './components/shared/unauthorised-error-page/unauthorised-error.component'
//       ).then((m) => m.UnauthorisedErrorComponent),
//   },
//   {
//     path: 'notifications',
//     title: 'Notifications',
//     loadComponent: () =>
//       import('./components/notification-list/notification-list.component').then((m) => m.NotificationListComponent),
//   },
//   { path: '**', redirectTo: 'pagenotfound' },
//   {
//     path: 'reset-password',
//     title: 'Reset Password',
//     loadComponent: () =>
//       import('./components/reset-password/reset-password.component').then(
//         (m) => m.ResetPasswordComponent
//       ),
//   },
//   {
//     path: 'forgot-password',
//     title: 'Forgot Password',
//     loadComponent: () =>
//       import('./components/forgot-password/forgot-password.component').then(
//         (m) => m.ForgotPasswordComponent
//       ),
//   },
//   {
//     path: 'unauthorised',
//     title: 'Unauthorised User',
//     loadComponent: () =>
//       import(
//         './components/shared/unauthorised-error-page/unauthorised-error.component'
//       ).then((m) => m.UnauthorisedErrorComponent),
//   },
//   { path: '**', redirectTo: 'login' },
// ];

// { path: 'header', component: HeaderComponent },
// { path: 'login', component: LoginComponent },
// { path: 'logout', component: LogoutComponent },
// {
//   path: 'day',
//     children: [
//       { path: '', component: DayComponent },
//       { path: 'day-details', component: DayDetailsComponent },
//     ]
// },
// { path: 'expense', component: ExpenseComponent },
// { path: 'expense-summary', component: ExpenseSummaryComponent },
// { path: 'expense-report', component: ExpenseReportComponent },
// { path: 'expense-details', component: ExpenseDetailsComponent },
// { path: 'currency-coin', component: CurrencyCoinComponent },
// { path: 'currency-coin-details', component: CurrencyCoinDetailsComponent },
// { path: 'profile', component: ProfileComponent },
// { path: 'manage-users', component: ManageUsersComponent },
// { path: 'manage-roles', component: ManageRolesComponent },
// { path: 'settings', component: SettingsComponent }
// ];
