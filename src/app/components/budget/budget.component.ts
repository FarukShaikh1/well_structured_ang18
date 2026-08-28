import { Component, OnInit, ViewChild } from "@angular/core";
import { Budget } from '../../interfaces/budget';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget/budget.service';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { LocalStorageConstants, UserConfig } from '../../../utils/application-constants';
import { ToasterComponent } from '../shared/toaster/toaster.component';


@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent],
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  budgets: Budget[] = [];
  filteredBudgets: Budget[] = [];
  userId = localStorage.getItem(LocalStorageConstants.USERID)?.toString() || '';
  categories: any;

  model: Budget = {
    id: '',
    userId: this.userId,
    payTo: '',
    purpose: '',
    categoryId: '',
    categoryName: '',
    amount: 0
  };

  isEdit = false;
  selectedId: string = '';
  searchText: string = '';

  constructor(private budgetService: BudgetService, private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.loadBudgets();
    this.loadCategories();
  }


  loadBudgets() {
    this.budgetService.getBudgetByUser()
      .subscribe(res => {
        this.budgets = res; this.filteredBudgets = res;
      });
  }

  loadCategories() {
    this.configService.getActiveConfigList(this.userId, UserConfig.TRANSACTION_CATEGORY).subscribe((res: any) => {
      this.categories = res?.data;
    });
  }

  save() {
    if (!this.model.payTo || !this.model.purpose || !this.model.categoryId || !this.model.amount) {
      this.toaster.showMessage('Please fill all required fields', 'error');
      return;
    }
    if (this.isEdit) {
      if (this.budgets.find(b => b.id === this.model.id) == undefined) {
        this.toaster.showMessage('Budget entry not found for update', 'error');
        return;
      }
      this.budgetService.updateBudget(this.model)
        .subscribe({
          next: (res:any) => {
            this.isEdit = false;
            this.toaster.showMessage('Budget entry updated successfully', 'success');
            this.loadBudgets();
            this.reset();
          },
          error: (err) => {
            console.error('Update failed', err);
          }
        });
    } else {
      if (this.budgets.find(b => b.payTo === this.model.payTo && b.categoryId === this.model.categoryId) != undefined) {
        this.toaster.showMessage('Duplicate budget entry found', 'error');
        return;
      }
      this.model.id = null;
      this.budgetService.addBudget(this.model)
        .subscribe({
          next: (res:any) => {
            this.toaster.showMessage('Budget entry added successfully', 'success');

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
    this.selectedId = this.model.id || '';
  }

  delete(id: string) {
    if (!confirm('Delete this entry?')) return;

    this.budgetService.deleteBudget(id)
      .subscribe(() => {
        this.toaster.showMessage('Budget entry deleted successfully', 'success');
        this.loadBudgets();
      });
  }

  reset() {
    this.model = {
      payTo: '',
      purpose: '',
      categoryId: '',
      amount: 0,
      id: null,
      userId: ''
    };
    this.isEdit = false;
    this.selectedId = '';
  }

  getTotal(): number {
    return this.budgets.reduce((sum, x) => sum + (x.amount || 0), 0);
  }

  search(textBox: any) {
    this.searchText = textBox?.target?.value?.toLowerCase();
    this.filteredBudgets = this.budgets.filter((item: any) => {
      const payTo = item.payTo?.toLowerCase().includes(this.searchText);
      const purpose = item.purpose?.toLowerCase().includes(this.searchText);
      const category = item.categoryName?.toLowerCase().includes(this.searchText);
      // const amount = item.amount?.toLowerCase().includes(this.searchText);
      return (payTo || purpose || category);
    });
  }

}
