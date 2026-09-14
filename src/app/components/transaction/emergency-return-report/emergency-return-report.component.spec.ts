import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyReturnReportComponent } from './emergency-return-report.component';

describe('EmergencyReturnReportComponent', () => {
  let component: EmergencyReturnReportComponent;
  let fixture: ComponentFixture<EmergencyReturnReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmergencyReturnReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmergencyReturnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
