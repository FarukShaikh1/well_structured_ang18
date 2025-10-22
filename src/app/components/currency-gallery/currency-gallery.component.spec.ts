import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyGalleryComponent } from './currency-gallery.component';

describe('CurrencyComponent', () => {
  let component: CurrencyGalleryComponent;
  let fixture: ComponentFixture<CurrencyGalleryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyGalleryComponent]
    });
    fixture = TestBed.createComponent(CurrencyGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
