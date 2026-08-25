import { Routes } from "@angular/router";
import {
  ApplicationModules,
  RoutePath,
  RoutePathTitles
} from "../utils/application-constants";

import { BudgetComponent } from "./components/budget/budget.component";
import { CredentialsComponent } from "./components/credentials/credentials.component";
import { CurrencyCoinComponent } from "./components/currency-coin/currency-coin.component";
import { DayComponent } from "./components/day/day.component";
import { DocumentsComponent } from "./components/documents/documents.component";
import { MyProfileComponent } from "./components/my-profile/my-profile.component";
import { RoutineComponent } from "./components/routine/routine.component";
import { SelfDataComponent } from "./components/self-data/self-data.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { TransactionComponent } from "./components/transaction/transaction.component";

import { authGuard } from "./guards/auth.guard";
import { publicGuard } from "./guards/public.guard";
import { FamilyGraphComponent } from "./components/family-graph/family-graph.component";
import { LoginComponent } from "./components/login/login.component";
import { SiteUnderDevelopmentComponent } from "./components/shared/site-under-development/site-under-development.component";

export const routes: Routes = [
  {
    path: "",
    redirectTo: RoutePath.HOME,
    pathMatch: "full"
  },
  {
    path: RoutePath.HOME,

    loadComponent: () =>
      import("./components/home/home.component")
        .then(m => m.HomeComponent),

    children: [

      // PUBLIC
      {
        path: "",
        title: RoutePathTitles.CURRENCY_LIST,
        redirectTo: RoutePath.CURRENCY_LIST,
        pathMatch: "full"
      },
      {
        path: RoutePath.CURRENCY_LIST,
        title: RoutePathTitles.CURRENCY_LIST,
        component: CurrencyCoinComponent
      },

      {
        path: RoutePath.FAMILY_GRAPH,
        title: RoutePathTitles.FAMILY_GRAPH,
        loadComponent: () =>
          import("./components/family-graph/family-graph.component")
            .then(m => m.FamilyGraphComponent)
      },


      // AUTHENTICATED GROUP
      {
        path: "",
        canActivateChild: [authGuard],

        children: [

          {
            path: "",
            redirectTo: RoutePath.EXPENSES,
            pathMatch: "full"
          },

          {
            path: RoutePath.EXPENSES,
            title: RoutePathTitles.EXPENSES,
            component: TransactionComponent
          },

          {
            path: RoutePath.DAY_LIST,
            title: RoutePathTitles.DAY_LIST,
            component: DayComponent
          },

          {
            path: RoutePath.USER_LIST,
            title: RoutePathTitles.USER_LIST,
            loadComponent: () =>
              import("./components/user-list/user-list.component")
                .then(m => m.UserListComponent),

            data: {
              moduleName: ApplicationModules.USER
            }
          },

          {
            path: RoutePath.USER_PERMISSIONS,
            title: RoutePathTitles.USER_PERMISSIONS,
            loadComponent: () =>
              import("./components/user-permission/user-permission.component")
                .then(m => m.UserPermissionComponent),

            data: {
              moduleName: ApplicationModules.USER_PERMISSIONS
            }
          },

          {
            path: RoutePath.SETTINGS,
            title: RoutePathTitles.SETTINGS,
            component: SettingsComponent
          },

          {
            path: RoutePath.DOCUMENT,
            title: RoutePathTitles.DOCUMENT,
            component: DocumentsComponent
          },

          {
            path: RoutePath.ROUTINE,
            title: RoutePathTitles.ROUTINE,
            component: RoutineComponent
          },

          {
            path: RoutePath.BUDGET,
            title: RoutePathTitles.BUDGET,
            component: BudgetComponent
          },

          {
            path: RoutePath.PLANS,
            title: RoutePathTitles.PLANS,
            component: SelfDataComponent
          },

          {
            path: RoutePath.CREDENTIALS,
            title: RoutePathTitles.CREDENTIALS,
            component: CredentialsComponent
          },

          {
            path: RoutePath.NOTIFICATIONS,
            title: RoutePathTitles.NOTIFICATIONS,
            loadComponent: () =>
              import("./components/notification-list/notification-list.component")
                .then(m => m.NotificationListComponent)
          },

          {
            path: RoutePath.OWNER_PROFILE,
            title: RoutePathTitles.OWNER_PROFILE,
            component: MyProfileComponent
          },

          {
            path: RoutePath.CHANGE_PASSWORD,
            title: RoutePathTitles.CHANGE_PASSWORD,
            loadComponent: () =>
              import("./components/change-password/change-password.component")
                .then(m => m.ChangePasswordComponent)
          }
        ]
      }
    ]
  },
  {
    path: RoutePath.LOGIN,
    component: LoginComponent
  },
  {
    path: RoutePath.FORGOT_PASSWORD,
    component: SiteUnderDevelopmentComponent
  },
  {
    path: RoutePath.SIGNUP,
    component: SiteUnderDevelopmentComponent
  },
  {
    path: RoutePath.UNDER_DEVELOPMENT,
    component: SiteUnderDevelopmentComponent
  },
  {
    path: "**",
    redirectTo: RoutePath.HOME,
    pathMatch: "full"
  },

]