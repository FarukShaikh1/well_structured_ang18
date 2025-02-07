import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseSummaryComponent } from './expense-summary.component';

describe('ExpenseComponent', () => {
  let component: ExpenseSummaryComponent;
  let fixture: ComponentFixture<ExpenseSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseSummaryComponent]
    });
    fixture = TestBed.createComponent(ExpenseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
