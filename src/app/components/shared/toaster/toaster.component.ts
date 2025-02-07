import { Component } from '@angular/core';
import { ToasterConfigs } from '../../../../utils/application-constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  imports: [CommonModule],
  styleUrls: ['./toaster.component.css'],
  standalone: true,
})
export class ToasterComponent {
  message: string = '';
  isSuccess: boolean = true;
  isVisible: boolean = false;
  timeout: number = ToasterConfigs.TIMEOUT;
  isHovered: boolean = false;

  showMessage(
    message: string,
    type: 'success' | 'error',
    timeout: number = this.timeout
  ) {
    this.message = message;
    this.isSuccess = type === 'success';
    this.isVisible = true;
    this.timeout = timeout;
  }

  closeToaster() {
    this.isVisible = false;
  }

  onProgressAnimationEnd() {
    this.isVisible = false;
  }

  toggleHoverState(state: boolean) {
    this.isHovered = state;
  }
}
