import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BudgetComponent } from '../budget/budget.component';
import { RoutineComponent } from '../routine/routine.component';
import { CredentialsComponent } from '../credentials/credentials.component';
import { FoodMenuComponent } from '../food-menu/food-menu.component';

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
export class SelfDataComponent {

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