import { Component, ViewChild } from '@angular/core';
import { LocalStorageConstants, UserConfig } from '../../../utils/application-constants';
import { ConfigurationService } from '../../services/configuration/configuration.service';
import { ToasterComponent } from '../shared/toaster/toaster.component';
import { CredentialService } from '../../services/credential/credential.service';
import { Credential } from '../../interfaces/credential';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.css'
})
export class CredentialsComponent {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  credentials: Credential[] = [];

  model: Credential = {
    id: '',
    userId: '',
    siteName: '',
    siteUrl: '',
    userName: '',
    password: '',
  };

  isEdit = false;
  userId = localStorage.getItem(LocalStorageConstants.USERID)?.toString() || '';
  selectedId: string = '';

  constructor(private credentialService: CredentialService, private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.loadCredentials();
  }


  loadCredentials() {
    this.credentialService.getCredentialByUser()
      .subscribe(res => this.credentials = res);
  }

  save() {
    if (!this.model.siteName|| !this.model.siteUrl || !this.model.userName || !this.model.password) {
      this.toaster.showMessage('Please fill all required fields', 'error');
      return;
    }
    if (this.isEdit) {
      if (this.credentials.find(b => b.id === this.model.id) == undefined) {
        this.toaster.showMessage('Credential entry not found for update', 'error');
        return;
      }
      this.credentialService.updateCredential(this.model)
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
      if (this.credentials.find(b => b.siteUrl === this.model.siteUrl && b.userName === this.model.userName) != undefined) {
        this.toaster.showMessage('Duplicate credential entry found', 'error');
        return;
      }
      this.model.id = null;
      this.credentialService.addCredential(this.model)
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
    this.model = { ...item };
    this.isEdit = true;
    this.selectedId = this.model.id || '';
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
      userName: '',
      password: '',
      userId: this.userId,
    };
    this.isEdit = false;
    this.selectedId = '';
  }


}
