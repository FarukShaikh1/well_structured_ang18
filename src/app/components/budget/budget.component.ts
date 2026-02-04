import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import { Budget } from '../../interfaces/budget';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget/budget.service';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { config } from 'rxjs';
import { LocalStorageConstants, UserConfig } from '../../../utils/application-constants';


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  budgets: Budget[] = [];
  categories: any;

  model: Budget = {
    id: '',
    userId: '',
    payTo: '',
    purpose: '',
    categoryId: '',
    categoryName: '',
    amount: 0
  };

  isEdit = false;
  userId = localStorage.getItem(LocalStorageConstants.USERID)?.toString() || '';

  constructor(private budgetService: BudgetService, private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.loadBudgets();
    this.loadCategories();
  }


  loadBudgets() {
    this.budgetService.getBudgetByUser()
      .subscribe(res => this.budgets = res);
  }

  loadCategories() {
    this.configService.getActiveConfigList(this.userId, UserConfig.TRANSACTION_CATEGORY).subscribe((res:any) => {
      this.categories = res?.data;
    });
  }

  save() {
    if (this.isEdit) {
      this.budgetService.updateBudget(this.model)
        .subscribe({
        next: (res) => {
          this.reset();
          this.loadBudgets();
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } else {
      this.model.id = null;
      this.budgetService.addBudget(this.model)
        .subscribe({
        next: (res) => {
          this.reset();
          this.loadBudgets();
        },
        error: (err) => {
          console.error('Add failed', err);
        }
      });
    }
  }

  edit(item: Budget) {
    this.model = { ...item };
    this.isEdit = true;
  }

  delete(id: string) {
    if (!confirm('Delete this entry?')) return;

    // this.budgetService.deleteBudget(id)
    //   .subscribe(() => this.loadBudgets());
  }

  reset() {
    // this.model = {
    //   payTo: '',
    //   purpose: '',
    //   categoryId: '',
    //   amount: 0
    // };
    this.isEdit = false;
  }

  getTotal(): number {
    return this.budgets.reduce((sum, x) => sum + (x.amount || 0), 0);
  }
}
