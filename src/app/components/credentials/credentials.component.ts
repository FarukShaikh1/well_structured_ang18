import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalStorageConstants } from '../../../utils/application-constants';
import { Credential } from '../../interfaces/credential';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { CredentialService } from '../../services/credential/credential.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { TruncatePipe } from '../../common/truncate.pipe';
import { applyPasswordPattern } from '../../../utils/password-pattern';
@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent, TruncatePipe],
  templateUrl: './credentials.component.html',
  styleUrls: ['../budget/budget.component.css']
})
export class CredentialsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  credentials: Credential[] = [];
  filteredCredentials: Credential[] = [];
  userId = localStorage.getItem(LocalStorageConstants.USERID)?.toString() || '';
  model: Credential = {
    id: '',
    userId: this.userId,
    siteName: '',
    siteUrl: '',
    notes: '',
    userName: '',
    password: '',
  };
  newModel = this.model;
  isEdit = false;
  hidePassword: boolean = true;
  viewPassword: boolean = false;

  selectedId: string = '';
  searchText: string = '';

  constructor(private credentialService: CredentialService, private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.loadCredentials();
  }


  loadCredentials() {
    this.credentialService.getCredentialByUser()
      .subscribe(res => {
        res = res.map(a => ({
          ...a,
          password: applyPasswordPattern(a.password ?? '')
        }));
        this.credentials = res;
        this.filteredCredentials = res;
      });
  }

  save(model: Credential) {
    if (!model.siteName || !model.siteUrl || !model.userName || !model.password) {
      this.toaster.showMessage('Please fill all required fields', 'error');
      return;
    }
    if (this.isEdit) {
      if (this.credentials.find(b => b.id === model.id) == undefined) {
        this.toaster.showMessage('Credential entry not found for update', 'error');
        return;
      }
      this.credentialService.updateCredential(model)
        .subscribe({
          next: (res) => {
            this.isEdit = false;
            this.toaster.showMessage('Credential entry updated successfully', 'success');
            this.loadCredentials();
            this.reset();
          },
          error: (err) => {
            console.error('Update failed', err);
          }
        });
    } else {
      if (this.credentials.find(b => b.siteUrl === model.siteUrl && b.userName === model.userName) != undefined) {
        this.toaster.showMessage('Duplicate credential entry found', 'error');
        return;
      }
      model.id = null;
      this.credentialService.addCredential(model)
        .subscribe({
          next: (res) => {
            this.toaster.showMessage('Credential entry added successfully', 'success');

            this.reset();
            this.loadCredentials();

          },
          error: (err) => {
            console.error('Add failed', err);
          }
        });
    }
  }

  edit(item: Credential) {
    this.newModel = { ...item };
    this.model = { ...item };
    this.isEdit = true;
    this.selectedId = this.model.id || '';
  }

  togglePassword(item: Credential) {
    this.model = { ...item };
    this.isEdit = false;
    if (this.selectedId === item.id) {
      this.viewPassword = !this.viewPassword;
    } else {
      this.selectedId = item.id || '';
      this.viewPassword = true;
    }
  }

  delete(id: string) {
    if (!confirm('Delete this entry?')) return;

    this.credentialService.deleteCredential(id)
      .subscribe(() => {
        this.toaster.showMessage('Credential entry deleted successfully', 'success');
        this.loadCredentials();
      });
  }

  reset() {
    this.model = {
      id: '',
      siteName: '',
      siteUrl: '',
      notes: '',
      userName: '',
      password: '',
      userId: this.userId,
    };
    this.newModel = this.model;
    this.isEdit = false;
    this.selectedId = '';
  }

  search(textBox: any) {
    this.searchText = textBox?.target?.value?.toLowerCase();
    this.filteredCredentials = this.credentials.filter((item: any) => {
      const siteName = item.siteName?.toLowerCase().includes(this.searchText);
      const siteUrl = item.siteUrl?.toLowerCase().includes(this.searchText);
      const userName = item.userName?.toLowerCase().includes(this.searchText);
      const notes = item.notes?.toLowerCase().includes(this.searchText);
      return (siteName || siteUrl || userName || notes);
    });
  }
}
