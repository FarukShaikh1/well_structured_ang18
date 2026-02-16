import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../../common/safe-url.pipe';
import { DocumentItem } from '../../interfaces/document-item';
import { DocumentRequest } from '../../interfaces/document-request';
import { DocumentService } from '../../services/document/document.service';
import { ApplicationModules } from '../../../utils/application-constants';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-documents-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe,],
  templateUrl: './documents-upload.component.html',
  styleUrl: './documents-upload.component.css'
})

export class DocumentsUploadComponent {

  @Input() document: any; // null = add, object = edit
  @Output() saved = new EventEmitter<void>();

  model: DocumentRequest = {
    id: '',
    file: null,
    documentName: '',
    keywords: ''
  };
  isSaving: boolean=false;
  constructor(private documentService: DocumentService,
    private renderer: Renderer2, private globalService: GlobalService

  ) { }

  // ngOnChanges() {
  //   if (this.document) {
  //     // EDIT MODE
  //     this.isEditMode = true;
  //     this.documentName = this.document.documentName;
  //     this.keywords = this.document.keywords;
  //   } else {
  //     // ADD MODE
  //     this.isEditMode = false;
  //     this.resetForm();
  //   }
  // }
  isEditMode = false;

  userId = ''; // populate from authentication token or parent component
  documents: DocumentItem[] = [];
  searchText = '';
  loading = false;
  selectedFile: File | null = null;
  documentName: string = '';
  keywords: string = '';

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
    this.isSaving = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('userId', this.userId);
    formData.append('documentName', this.documentName);
    formData.append('keywords', this.keywords);

    await this.documentService.uploadDocument(formData).toPromise();


    this.selectedFile = null;
    const modalEl = document.getElementById('uploadModal');
    if (modalEl) (window as any).bootstrap.Modal.getInstance(modalEl)?.hide();
    this.globalService.triggerGridReload(ApplicationModules.DOCUMENT);
    this.isSaving = false;

  }


  save() {
    if (this.isEditMode) {
      this.model = {
        id: this.document.id,
        documentName: this.documentName,
        keywords: this.keywords,
        file: null
      }

      this.documentService.updateDocument(
        this.model
      ).subscribe(() => {
        this.saved.emit();
        this.closeModal();
      });
    } else {
      this.model = {
        id: null,
        documentName: this.documentName,
        keywords: this.keywords,
        file: this.selectedFile
      }

      // this.documentService.uploadDocument(
        
      // ).subscribe(() => {
      //   this.saved.emit();
      //   this.closeModal();
      // });
    }
  }

  // Open preview using SAS URL (preferred)
  async openPreview(doc: DocumentItem) {
    this.previewFileName = doc.fileName;
    this.previewContentType = doc.contentType;
    // const resp = await this.documentService.getDocumentU(doc.id).toPromise();
    // this.previewUrl = resp.url;
    this.showPreview = true;
  }


  closePreview() {
    this.showPreview = false;
    this.previewUrl = null;
  }

  resetForm() {
    this.documentName = '';
    this.keywords = '';
    this.selectedFile = null;
  }

  closeModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
      // const bsModal = bootstrap.Modal.getInstance(modal);
      // bsModal?.hide();
    }
  }

}