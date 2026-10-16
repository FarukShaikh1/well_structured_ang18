import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { BudgetComponent } from '../budget/budget.component';
import { RoutineComponent } from '../routine/routine.component';
import { CredentialsComponent } from '../credentials/credentials.component';
import { FoodMenuComponent } from '../food-menu/food-menu.component';
import { ApplicationModules } from '../../../utils/application-constants';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-personal-plans',

  standalone: true,

  imports: [
    CommonModule,
    RoutineComponent,
    BudgetComponent,
    CredentialsComponent,
    FoodMenuComponent
  ],

  templateUrl: './personal-plans.component.html',

  styleUrl: './personal-plans.component.css'
})
export class SelfDataComponent implements OnInit {
  foodMenuModulePermissions: any;
  dailyRoutineModulePermissions: any;
  monthlyBudgetModulePermissions: any;
  credentialModulePermissions: any;

  constructor(private globalService: GlobalService) {
  }

  ngOnInit() {
    this.foodMenuModulePermissions = this.globalService.getModulePermission(ApplicationModules.FOOD_MENU);
    this.dailyRoutineModulePermissions = this.globalService.getModulePermission(ApplicationModules.DAILY_ROUTINE);
    this.monthlyBudgetModulePermissions = this.globalService.getModulePermission(ApplicationModules.MONTHLY_BUDGET);
    this.credentialModulePermissions = this.globalService.getModulePermission(ApplicationModules.CREDENTIALS);

  }
  /**
   * Active tab
   */
  activeTab: 'routine' | 'budget' | 'credentials' | 'food-menu' = 'food-menu';


  /**
   * Change active tab
   */
  setActiveTab(
    tab: 'routine' | 'budget' | 'credentials' | 'food-menu'
  ): void {

    this.activeTab = tab;

  }

}