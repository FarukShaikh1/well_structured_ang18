import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteUnderDevelopmentComponent } from './site-under-development.component';

describe('SiteUnderDevelopmentComponent', () => {
  let component: SiteUnderDevelopmentComponent;
  let fixture: ComponentFixture<SiteUnderDevelopmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteUnderDevelopmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteUnderDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
