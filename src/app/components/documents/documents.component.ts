import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionConstant, ApplicationModules, NavigationURLs } from '../../../utils/application-constants';
import { DateUtils } from '../../../utils/date-utils';
import { SafeUrlPipe } from '../../common/safe-url.pipe';
import { TruncatePipe } from '../../common/truncate.pipe';
import { DocumentService } from '../../services/document/document.service';
import { GlobalService } from '../../services/global/global.service';
import { DocumentsUploadComponent } from '../document-upload/documents-upload.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { SiteUnderDevelopmentComponent } from '../shared/site-under-development/site-under-development.component';
import { ToasterComponent } from '../shared/toaster/toaster.component';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeUrlPipe, DocumentsUploadComponent, TruncatePipe, ConfirmationDialogComponent, ToasterComponent,SiteUnderDevelopmentComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})

export class DocumentsComponent {
  @ViewChild(DocumentsUploadComponent) uploadComponent!: DocumentsUploadComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  @ViewChild(ConfirmationDialogComponent, { static: false })
  confirmationDialog!: ConfirmationDialogComponent;
  docId: any;
  constructor(private documentService: DocumentService,
    public globalService: GlobalService,
    private router: Router,
  ) { }


  userId = ''; // populate from authentication token or parent component
  documentList: any;
  filteredDocumentList: any;
  // documents: DocumentItem[] = [];
  searchText = '';
  loading = false;
  selectedFile: File | null = null;
  ActionConstant = ActionConstant;
  // preview
  previewUrl: string | null = null; // blob or SAS url
  previewFileName = '';
  previewContentType = '';
  showPreview = false;
  DateUtils = DateUtils;

  async ngOnInit() {
    // set userId from your auth service or localStorage
    // this.userId = authService.currentUserId();
    this.userId = localStorage.getItem('userId') || ''; // example
    await this.loadDocuments();
    this.globalService.reloadGrid$.subscribe((listName: string) => {
      if (listName === ApplicationModules.DOCUMENT) {
        this.loadDocuments();
      }
    });

  }

  async loadDocuments() {
    this.loading = true;
    try {
      await this.documentService.getDocumentList().subscribe({
        next: (data: any) => {
          this.documentList = data.data;
          this.filteredDocumentList = data.data;
        },
        error: (error: any) => {
          console.error('Error fetching documents', error);
        }
      });
    } finally {
      this.loading = false;
    }
  }

  applyFilter() {
    if (!this.searchText) {
      this.filteredDocumentList = this.documentList;
      return;
    }
    this.filteredDocumentList = this.documentList.filter((doc: any) =>
      doc.uploadedFileName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      doc.documentName?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      doc.keywords?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSearchEnter() {
    this.loadDocuments();
  }

selectedDocument: any = null;

openNewDocument() {
  this.selectedDocument = null; // ADD mode
}

editDocument(doc: any) {
  this.selectedDocument = { ...doc }; // EDIT mode
}

onDocumentSaved() {
  this.loadDocuments(); // reload list
}

  async openPreview(doc: any) {
        this.router.navigate([NavigationURLs.UNDER_DEVELOPMENT]);
    
    // this.previewFileName = doc.uploadedFileName;
    // this.previewContentType = doc.contentType;

    // // Force inline display (prevents auto download)
    // const inlineUrl = doc.originalPathSasUrl + "&response-content-disposition=inline";

    // this.previewUrl = inlineUrl;
    // console.log('this.previewUrl : ', this.previewUrl);

    // this.showPreview = true;
  }

  // async download(doc: any) {
  //   const disposition = encodeURIComponent(`attachment;filename=hello.png`);

  //   const downloadUrl = `${doc.originalPath}&response-content-disposition=${disposition}`;
  //   console.log('downloadURL : ', downloadUrl);
  //   this.triggerBrowserDownload(downloadUrl, 'hello.png');
  // }

  async download(doc: any) {
    await this.documentService
      .getDownloadUrl(doc.id, doc.uploadedFileName).subscribe({
        next: (response: any) => {
          const url = response.data;
          console.log('url : ', url);

          this.triggerBrowserDownload(url, doc.uploadedFileName);
        },
        error: (error: any) => {
          console.error('Error fetching download URL', error);
        }
      });
  }

  async deleteDocument(docId: any) {
    if (docId) {
      this.docId = docId;
      if (!confirm('Delete this entry?')) return;
      this.handleConfirmResult(true);
      // this.confirmationDialog.openConfirmationPopup(
      //   "Confirmation",
      //   "Are you sure you want to delete this document? This action cannot be undone."
      // );
    }
  }

  handleConfirmResult(isConfirmed: boolean) {
    if (isConfirmed) {

      this.documentService
        .deleteDocument(this.docId).subscribe({
          next: (res: any) => {
            this.toaster.showMessage("Record Deleted Successfully.", "success");
            this.loadDocuments();
          },
          error: (error: any) => {
          },
        });
    }
  }
  private triggerBrowserDownload(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.target = '_blank';
    a.click();
    a.remove();
  }

  closePreview() {
    this.showPreview = false;
    this.previewUrl = null;
  }

  removeBlur(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.remove('blur-load');
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