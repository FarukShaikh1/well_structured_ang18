import { Component } from '@angular/core';
import { SiteUnderDevelopmentComponent } from '../shared/site-under-development/site-under-development.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [SiteUnderDevelopmentComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
}
