import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtoOwnerComponent } from './rto-owner.component';

describe('RtoOwnerComponent', () => {
  let component: RtoOwnerComponent;
  let fixture: ComponentFixture<RtoOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtoOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtoOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
