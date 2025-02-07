import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyCoinDetailsComponent } from './currency-coin-details.component';

describe('CurrencyCoinDetailsComponent', () => {
  let component: CurrencyCoinDetailsComponent;
  let fixture: ComponentFixture<CurrencyCoinDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyCoinDetailsComponent]
    });
    fixture = TestBed.createComponent(CurrencyCoinDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
