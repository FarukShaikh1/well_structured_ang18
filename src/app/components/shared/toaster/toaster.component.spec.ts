import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ToasterComponent } from './toaster.component';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToasterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message', fakeAsync(() => {
    const message = 'Success!';
    component.showMessage(message, 'success');
    fixture.detectChanges();

    expect(component.isVisible).toBeTrue();
    expect(component.message).toBe(message);
    expect(component.isSuccess).toBeTrue();

    const messageElement = fixture.debugElement.query(By.css('.toast-body')).nativeElement;
    expect(messageElement.textContent).toContain(message);

    const toastElement = fixture.debugElement.query(By.css('.toast')).nativeElement;
    expect(toastElement.classList).toContain('bg-success');

  }));

  it('should show error message', fakeAsync(() => {
    const message = 'Error!';
    component.showMessage(message, 'error');
    fixture.detectChanges();

    expect(component.isVisible).toBeTrue();
    expect(component.message).toBe(message);
    expect(component.isSuccess).toBeFalse();

    const messageElement = fixture.debugElement.query(By.css('.toast-body')).nativeElement;
    expect(messageElement.textContent).toContain(message);

    const toastElement = fixture.debugElement.query(By.css('.toast')).nativeElement;
    expect(toastElement.classList).toContain('bg-danger');
  }));

  it('should close the toaster when close button is clicked', () => {
    component.showMessage('Close Test', 'success');
    fixture.detectChanges();

    expect(component.isVisible).toBeTrue();

    const closeButton = fixture.debugElement.query(By.css('.btn-close')).nativeElement;
    closeButton.click();
    fixture.detectChanges();

    expect(component.isVisible).toBeFalse();
  });

  it('should hide toaster when progress animation ends', () => {
    component.showMessage('Animation End Test', 'success');
    fixture.detectChanges();

    expect(component.isVisible).toBeTrue();

    component.onProgressAnimationEnd();
    fixture.detectChanges();

    expect(component.isVisible).toBeFalse();
  });

  it('should toggle hover state', () => {
    expect(component.isHovered).toBeFalse();

    component.toggleHoverState(true);
    fixture.detectChanges();

    expect(component.isHovered).toBeTrue();

    component.toggleHoverState(false);
    fixture.detectChanges();

    expect(component.isHovered).toBeFalse();
  });
});
