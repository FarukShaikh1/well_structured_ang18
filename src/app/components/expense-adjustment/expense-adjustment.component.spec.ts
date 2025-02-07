import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAdjustmentComponent } from './expense-adjustment.component';

describe('ExpenseAdjustmentComponent', () => {
  let component: ExpenseAdjustmentComponent;
  let fixture: ComponentFixture<ExpenseAdjustmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseAdjustmentComponent]
    });
    fixture = TestBed.createComponent(ExpenseAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
