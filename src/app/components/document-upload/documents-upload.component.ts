import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../common/safe-url.pipe';
import { DocumentItem } from '../../interfaces/document-item';
import { DocumentService } from '../../services/document/document.service';

@Component({
  selector: 'app-documents-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe,],
  templateUrl: './documents-upload.component.html',
  styleUrl: './documents-upload.component.css'
})

export class DocumentsUploadComponent {
  constructor(private documentService: DocumentService,
    private renderer: Renderer2,

  ) { }


  userId = ''; // populate from authentication token or parent component
  documents: DocumentItem[] = [];
  searchText = '';
  loading = false;
  selectedFile: File | null = null;

  // preview
  previewUrl: string | null = null; // blob or SAS url
  previewFileName = '';
  previewContentType = '';
  showPreview = false;

  openUpload() {
    const modalEl = document.getElementById('uploadModal');
    const model = document.getElementById("detailsPopup");
    if (model) {
      this.renderer.setStyle(model, "display", "block");
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }
  async uploadFile() {
    if (!this.selectedFile) return;


    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('userId', this.userId);


    await this.documentService.upload(formData).toPromise();


    this.selectedFile = null;
    const modalEl = document.getElementById('uploadModal');
    if (modalEl) (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
  }

  // Open preview using SAS URL (preferred)
  async openPreview(doc: DocumentItem) {
    this.previewFileName = doc.fileName;
    this.previewContentType = doc.contentType;
    const resp = await this.documentService.getSasUrl(doc.id).toPromise();
    // this.previewUrl = resp.url;
    this.showPreview = true;
  }


  closePreview() {
    this.showPreview = false;
    this.previewUrl = null;
  }
}