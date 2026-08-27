import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFoodPickerComponent } from './daily-food-picker.component';

describe('DailyFoodPickerComponent', () => {
  let component: DailyFoodPickerComponent;
  let fixture: ComponentFixture<DailyFoodPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFoodPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyFoodPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
