import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../../utils/api-url';
import { FoodMenu } from '../../interfaces/food-menu';

@Injectable({
  providedIn: 'root'
})
export class FoodMenuService {

  constructor(private http: HttpClient) { }

  getFoodMenuByUser(isNonVeg: boolean) {
    return this.http.get<FoodMenu[]>(
      API_URL.GET_FOOD_MENU_BY_USER + isNonVeg
    );
  }

  addFoodMenu(data: FoodMenu) {
    return this.http.post<string>(
      API_URL.ADD_FOOD_MENU,
      data
    );
  }

  updateFoodMenu(data: FoodMenu) {
    return this.http.put(
      API_URL.UPDATE_FOOD_MENU,
      data
    );
  }

  getFoodMenuDetails(foodMenuId: string) {
    return this.http.get<FoodMenu>(
      API_URL.GET_FOOD_MENU_DETAILS + foodMenuId
    );
  }

  deleteFoodMenu(foodMenuId: string) {
    return this.http.delete<boolean>(
      API_URL.DELETE_FOOD_MENU + foodMenuId
    );
  }
}