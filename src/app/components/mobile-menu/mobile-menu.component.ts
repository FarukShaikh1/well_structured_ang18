import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  NavigationURLs,
  RoutePathTitles
} from '../../../utils/application-constants';

import { ModuleResponse } from '../../interfaces/module-response';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {

  moduleList: ModuleResponse[] = [];

  NavigationURLs = NavigationURLs;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private globalService: GlobalService
  ) { }

  ngOnInit(): void {
    console.log('Mobile Menu Loaded');
    this.getModuleList();
  }

  getModuleList(): void {

    this.moduleList =
      this.localStorageService.getLoggedInUserPermissions() || [];

    this.moduleList = this.moduleList.filter(
      (module: ModuleResponse) => module.route !== ''
    );

    if (this.moduleList.length === 0) {

      this.globalService.getUserPermissionData().subscribe({
        next: () => {

          this.moduleList =
            this.localStorageService.getLoggedInUserPermissions() || [];

          this.moduleList = this.moduleList.filter(
            (module: any) => {

              if (
                module.moduleName === RoutePathTitles.EXPENSES
              ) {
                return module.view === true &&
                  module.add === true;
              }

              return module.view === true;
            }
          );
        },
        error: (error: any) => {
          console.error('Permission error:', error);
        }
      });
    }
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  goBack(): void {
    window.history.back();
  }

  isActiveMenu(route: string): boolean {
    return this.router.url.includes(route);
  }
}