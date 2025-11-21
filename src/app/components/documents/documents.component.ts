import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../common/safe-url.pipe';
import { DocumentItem } from '../../interfaces/document-item';
import { DocumentService } from '../../services/document/document.service';
import { DocumentsUploadComponent } from '../document-upload/documents-upload.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe, DocumentsUploadComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})

export class DocumentsComponent {
  @ViewChild(DocumentsUploadComponent) uploadComponent!: DocumentsUploadComponent;
  constructor(private documentService: DocumentService) { }


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


  async ngOnInit() {
    // set userId from your auth service or localStorage
    // this.userId = authService.currentUserId();
    this.userId = localStorage.getItem('userId') || ''; // example
    await this.loadDocuments();
  }

  async loadDocuments() {
    this.loading = true;
    try {
      await this.documentService.getDocumentList().subscribe({
        next: (data: any) => {
          this.documents = data.data;
        },
        error: (error: any) => {
          console.error('Error fetching documents', error);
        }
      });
    } finally {
      this.loading = false;
    }
  }


  onSearchEnter() {
    this.loadDocuments();
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


  async download(doc: DocumentItem) {
    await this.documentService.getSasUrl(doc.id).subscribe({
      next: (result: any) => {
        debugger
        if (!result || !result.data) {
          console.error("SAS URL not received");
          return;
        }
        this.triggerBrowserDownload(result.data, doc.fileName);
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching SAS URL', error);
      }
    });
  }


  private triggerBrowserDownload(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }


  // utility to show human-readable size
  humanSize(bytes: number) {
    if (!bytes) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = 0; let value = bytes;
    while (value >= 1024 && i < units.length - 1) { value /= 1024; i++; }
    return `${value.toFixed(1)} ${units[i]}`;
  }
}