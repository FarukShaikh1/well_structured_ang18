import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FoodItem {
  name: string;
  category: string;
}

interface DailyMeal {
  title: string;
  icon: string;
  selected?: FoodItem;
}

@Component({
  selector: 'app-daily-food-picker',
  templateUrl: './daily-food-picker.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./daily-food-picker.component.css']
})
export class DailyFoodPickerComponent {

  breakfastItems: FoodItem[] = [
    { name: 'Poha', category: 'Maharashtrian' },
    { name: 'Upma', category: 'South Indian' },
    { name: 'Idli', category: 'South Indian' },
    { name: 'Dosa', category: 'South Indian' },
    { name: 'Masala Dosa', category: 'South Indian' },
    { name: 'Uttapam', category: 'South Indian' },
    { name: 'Thalipeeth', category: 'Maharashtrian' },
    { name: 'Sabudana Khichdi', category: 'Maharashtrian' },
    { name: 'Sabudana Vada', category: 'Maharashtrian' },
    { name: 'Misal Pav', category: 'Maharashtrian' },
    { name: 'Appe', category: 'South Indian' },
    { name: 'Aloo Paratha', category: 'North Indian' },
    { name: 'Methi Paratha', category: 'North Indian' },
    { name: 'Besan Chilla', category: 'Healthy' },
    { name: 'Moong Dal Chilla', category: 'Healthy' },
    { name: 'Vegetable Sandwich', category: 'Quick' }
  ];

  lunchItems: FoodItem[] = [
    { name: 'Varan Bhaat + Bhaji', category: 'Maharashtrian' },
    { name: 'Chapati + Bhaji', category: 'Regular' },
    { name: 'Bhakri + Pithla', category: 'Maharashtrian' },
    { name: 'Bhakri + Bharli Vangi', category: 'Maharashtrian' },
    { name: 'Chapati + Bhendi Masala', category: 'Regular' },
    { name: 'Chapati + Aloo Gobi', category: 'Regular' },
    { name: 'Dal Tadka + Rice', category: 'Indian' },
    { name: 'Dal Fry + Rice', category: 'Indian' },
    { name: 'Rajma + Rice', category: 'North Indian' },
    { name: 'Chole + Roti', category: 'North Indian' },
    { name: 'Palak Paneer + Roti', category: 'North Indian' },
    { name: 'Paneer Masala + Roti', category: 'North Indian' },
    { name: 'Veg Pulao + Raita', category: 'Rice' },
    { name: 'Veg Biryani + Raita', category: 'Rice' },
    { name: 'Masala Khichdi + Curd', category: 'Comfort Food' },
    { name: 'Matki Usal + Chapati', category: 'Maharashtrian' }
  ];

  extraBreakfastItems: FoodItem[] = [
    { name: 'Tea + Biscuits', category: 'Quick' },
    { name: 'Tea + Toast', category: 'Quick' },
    { name: 'Bhel', category: 'Snack' },
    { name: 'Sev Puri', category: 'Snack' },
    { name: 'Dahi Puri', category: 'Snack' },
    { name: 'Vada Pav', category: 'Maharashtrian' },
    { name: 'Batata Vada', category: 'Maharashtrian' },
    { name: 'Kanda Bhaji', category: 'Maharashtrian' },
    { name: 'Samosa', category: 'Snack' },
    { name: 'Kachori', category: 'Snack' },
    { name: 'Dhokla', category: 'Gujarati' },
    { name: 'Kothimbir Vadi', category: 'Maharashtrian' },
    { name: 'Sweet Corn', category: 'Healthy' },
    { name: 'Sprouts Chaat', category: 'Healthy' },
    { name: 'Fruit Chaat', category: 'Healthy' },
    { name: 'Grilled Sandwich', category: 'Quick' },
    { name: 'Boiled Eggs', category: 'Healthy' }
  ];

  dinnerItems: FoodItem[] = [
    { name: 'Dal Khichdi + Curd', category: 'Light' },
    { name: 'Masala Khichdi', category: 'Light' },
    { name: 'Chapati + Bhaji', category: 'Regular' },
    { name: 'Bhakri + Pithla', category: 'Maharashtrian' },
    { name: 'Dal Tadka + Jeera Rice', category: 'Indian' },
    { name: 'Paneer Bhurji + Roti', category: 'North Indian' },
    { name: 'Palak Paneer + Roti', category: 'North Indian' },
    { name: 'Chole + Roti', category: 'North Indian' },
    { name: 'Rajma + Rice', category: 'North Indian' },
    { name: 'Veg Pulao + Raita', category: 'Rice' },
    { name: 'Idli + Sambar', category: 'South Indian' },
    { name: 'Dosa + Chutney', category: 'South Indian' },
    { name: 'Uttapam + Chutney', category: 'South Indian' },
    { name: 'Moong Dal Chilla', category: 'Light' },
    { name: 'Besan Chilla', category: 'Light' },
    { name: 'Vegetable Daliya', category: 'Healthy' },
    { name: 'Vegetable Soup + Sandwich', category: 'Light' }
  ];

  meals: DailyMeal[] = [
    {
      title: 'Breakfast',
      icon: '🌅'
    },
    {
      title: 'Lunch',
      icon: '🍛'
    },
    {
      title: 'Extra Breakfast',
      icon: '☕'
    },
    {
      title: 'Dinner',
      icon: '🌙'
    }
  ];

  getItems(title: string): FoodItem[] {
    switch (title) {
      case 'Breakfast':
        return this.breakfastItems;

      case 'Lunch':
        return this.lunchItems;

      case 'Extra Breakfast':
        return this.extraBreakfastItems;

      case 'Dinner':
        return this.dinnerItems;

      default:
        return [];
    }
  }

  pickMeal(meal: DailyMeal): void {
    const items = this.getItems(meal.title);

    if (!items.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * items.length);

    meal.selected = items[randomIndex];
  }

  pickAllMeals(): void {
    this.meals.forEach(meal => this.pickMeal(meal));
  }

  getToday(): string {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
}