import { Component } from '@angular/core';
import { SiteUnderDevelopmentComponent } from '../shared/site-under-development/site-under-development.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [SiteUnderDevelopmentComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent {
}
