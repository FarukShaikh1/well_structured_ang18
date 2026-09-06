import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToasterComponent } from '../shared/toaster/toaster.component';

import { FoodMenu } from '../../interfaces/food-menu';
import { FoodMenuService } from '../../services/food-menu.service/food-menu.service'

import { LocalStorageConstants } from '../../../utils/application-constants';
import { PrintService } from '../../services/print/print.service';

@Component({
  selector: 'app-food-menu',
  templateUrl: './food-menu.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToasterComponent
  ],
  styleUrls: ['./food-menu.component.css']
})
export class FoodMenuComponent implements OnInit {

  @ViewChild(ToasterComponent)
  toaster!: ToasterComponent;

  // =========================
  // DATA
  // =========================

  foodMenus: FoodMenu[] = [];

  filteredFoodMenus: FoodMenu[] = [];
  selectedPrintSection: string | null = null;
  isNonVeg: boolean = false;
  printFoodMenu(): void {

    this.printService.printElement(
      'food-menu-print'
    );
  }

  // =========================
  // USER
  // =========================

  userId =
    localStorage
      .getItem(LocalStorageConstants.USERID)
      ?.toString() || '';


  // =========================
  // MODEL
  // =========================

  model: FoodMenu = this.getEmptyModel();


  // =========================
  // UI STATE
  // =========================

  isEdit = false;

  selectedId = '';

  searchText = '';


  // =========================
  // DATE 1 - 31
  // =========================

  menuDates: number[] = Array.from(
    { length: 31 },
    (_, i) => i + 1
  );


  // =========================
  // SEQUENCE
  // =========================

  sequences: number[] = Array.from(
    { length: 31 },
    (_, i) => i + 1
  );


  // =========================
  // FOOD OPTIONS
  // =========================

  breakfastItems: string[] = [
    'Poha',
    'Upma',
    'Idli',
    'Dosa',
    'Masala Dosa',
    'Uttapam',
    'Thalipeeth',
    'Sabudana Khichdi',
    'Sabudana Vada',
    'Misal Pav',
    'Appe',
    'Aloo Paratha',
    'Methi Paratha',
    'Besan Chilla',
    'Moong Dal Chilla',
    'Vegetable Sandwich'
  ];


  lunchItems: string[] = [
    'Varan Bhaat',
    'Chapati + Bhaji',
    'Bhakri + Pithla',
    'Bhakri + Bharli Vangi',
    'Chapati + Bhendi Masala',
    'Chapati + Aloo Gobi',
    'Dal Tadka + Rice',
    'Dal Fry + Rice',
    'Rajma + Rice',
    'Chole + Roti',
    'Palak Paneer + Roti',
    'Paneer Masala + Roti',
    'Veg Pulao + Raita',
    'Veg Biryani + Raita',
    'Masala Khichdi + Curd',
    'Matki Usal + Chapati'
  ];


  eveningBreakfastItems: string[] = [
    'Tea + Biscuits',
    'Tea + Toast',
    'Bhel',
    'Sev Puri',
    'Dahi Puri',
    'Vada Pav',
    'Batata Vada',
    'Kanda Bhaji',
    'Samosa',
    'Kachori',
    'Dhokla',
    'Kothimbir Vadi',
    'Sweet Corn',
    'Sprouts Chaat',
    'Fruit Chaat',
    'Grilled Sandwich',
    'Boiled Eggs'
  ];


  dinnerItems: string[] = [
    'Dal Khichdi + Curd',
    'Masala Khichdi',
    'Chapati + Bhaji',
    'Bhakri + Pithla',
    'Dal Tadka + Jeera Rice',
    'Paneer Bhurji + Roti',
    'Palak Paneer + Roti',
    'Chole + Roti',
    'Rajma + Rice',
    'Veg Pulao + Raita',
    'Idli + Sambar',
    'Dosa + Chutney',
    'Uttapam + Chutney',
    'Moong Dal Chilla',
    'Besan Chilla',
    'Vegetable Daliya',
    'Vegetable Soup + Sandwich'
  ];


  constructor(
    private foodMenuService: FoodMenuService, private printService: PrintService
  ) {
  }


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {
    this.isNonVeg = false;
    this.loadFoodMenus(this.isNonVeg);
  }

  onFoodTypeChange(isNonVeg: boolean): void {
    this.isNonVeg = isNonVeg;

    // Clear current edit state
    this.reset();

    // Reload menu based on selected food type
    this.loadFoodMenus(this.isNonVeg);
}

  // =========================
  // EMPTY MODEL
  // =========================

  getEmptyModel(): FoodMenu {

    return {
      id: null,
      userId: this.userId,
      menuDate: 1,
      sequence: 1,
      breakfast: '',
      lunch: '',
      eveningBreakfast: '',
      dinner: ''
    };

  }


  // =========================
  // GET DATA FROM API
  // =========================

  loadFoodMenus(isNonVeg: boolean): void {

    this.foodMenuService
      .getFoodMenuByUser(isNonVeg)
      .subscribe({

        next: (res: any) => {

          this.foodMenus = res || [];

          this.sortFoodMenus();

          this.filteredFoodMenus = [
            ...this.foodMenus
          ];

        },

        error: (err: Error) => {

          console.error(
            'Failed to load food menus',
            err
          );

          this.toaster.showMessage(
            'Failed to load food menu',
            'error'
          );

        }

      });
  }


  // =========================
  // SORT
  // =========================

  sortFoodMenus(): void {

    this.foodMenus.sort((a, b) => {

      if (a.menuDate !== b.menuDate) {

        return a.menuDate - b.menuDate;

      }

      return a.sequence - b.sequence;

    });

  }


  // =========================
  // SAVE
  // =========================

  save(): void {

    if (
      !this.model.menuDate ||
      this.model.menuDate < 1 ||
      this.model.menuDate > 31
    ) {

      this.toaster.showMessage(
        'Please select a valid date',
        'error'
      );

      return;
    }


    if (
      !this.model.sequence ||
      this.model.sequence < 1
    ) {

      this.toaster.showMessage(
        'Please select sequence',
        'error'
      );

      return;
    }


    if (
      !this.model.breakfast &&
      !this.model.lunch &&
      !this.model.eveningBreakfast &&
      !this.model.dinner
    ) {

      this.toaster.showMessage(
        'Please select at least one meal',
        'error'
      );

      return;
    }


    // =========================
    // UPDATE
    // =========================

    if (this.isEdit) {

      const existing = this.foodMenus.find(
        x => x.id === this.model.id
      );

      if (!existing) {

        this.toaster.showMessage(
          'Food menu entry not found',
          'error'
        );

        return;
      }


      this.foodMenuService
        .updateFoodMenu(this.model)
        .subscribe({

          next: () => {

            this.toaster.showMessage(
              'Food menu updated successfully',
              'success'
            );

            this.reset();

            this.loadFoodMenus(this.isNonVeg);

          },

          error: (err: Error) => {

            console.error(
              'Update failed',
              err
            );

            this.toaster.showMessage(
              'Failed to update food menu',
              'error'
            );

          }

        });

      return;
    }


    // =========================
    // ADD
    // =========================

    this.model.id = null;

    this.model.userId = this.userId;


    this.foodMenuService
      .addFoodMenu(this.model)
      .subscribe({

        next: () => {

          this.toaster.showMessage(
            'Food menu added successfully',
            'success'
          );

          this.reset();

          this.loadFoodMenus(this.isNonVeg);

        },

        error: (err: Error) => {

          console.error(
            'Add failed',
            err
          );

          this.toaster.showMessage(
            'Failed to add food menu',
            'error'
          );

        }

      });
  }


  // =========================
  // EDIT
  // =========================

  edit(item: FoodMenu): void {

    this.model = {
      ...item
    };

    this.isEdit = true;

    this.selectedId = item.id || '';

  }


  // =========================
  // DELETE
  // =========================

  delete(id: string | null): void {

    if (!id) {
      return;
    }


    if (
      !confirm(
        'Delete this food menu entry?'
      )
    ) {

      return;
    }


    this.foodMenuService
      .deleteFoodMenu(id)
      .subscribe({
        next: () => {
          this.toaster.showMessage(
            'Food menu deleted successfully',
            'success'
          );
          this.reset();
          this.loadFoodMenus(this.isNonVeg);
        },

        error: (err: Error) => {

          console.error(
            'Delete failed',
            err
          );

          this.toaster.showMessage(
            'Failed to delete food menu',
            'error'
          );

        }

      });
  }


  // =========================
  // RESET
  // =========================

  reset(): void {

    this.model =
      this.getEmptyModel();

    this.isEdit = false;

    this.selectedId = '';

  }


  // =========================
  // SEARCH
  // =========================

  search(event: any): void {

    this.searchText =
      event?.target?.value
        ?.toLowerCase()
        ?.trim() || '';


    this.filteredFoodMenus =
      this.foodMenus.filter(item => {

        return (

          item.menuDate
            ?.toString()
            .includes(this.searchText)

          ||

          item.sequence
            ?.toString()
            .includes(this.searchText)

          ||

          item.breakfast
            ?.toLowerCase()
            .includes(this.searchText)

          ||

          item.lunch
            ?.toLowerCase()
            .includes(this.searchText)

          ||

          item.eveningBreakfast
            ?.toLowerCase()
            .includes(this.searchText)

          ||

          item.dinner
            ?.toLowerCase()
            .includes(this.searchText)

        );

      });

  }

}