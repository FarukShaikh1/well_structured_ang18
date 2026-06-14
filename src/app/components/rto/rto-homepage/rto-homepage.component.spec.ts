import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtoHomepageComponent } from './rto-homepage.component';

describe('RtoHomepageComponent', () => {
  let component: RtoHomepageComponent;
  let fixture: ComponentFixture<RtoHomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtoHomepageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtoHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
