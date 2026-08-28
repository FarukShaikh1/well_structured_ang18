import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToasterComponent } from '../shared/toaster/toaster.component';
import { RegistrationService } from '../../services/registration/registration.service'
import { UserRegistration } from '../../interfaces/user-registration';
import { NavigationURLs } from '../../../utils/application-constants';

@Component({
    selector: 'app-user-registration-approval', templateUrl: './user-registration-approval.component.html', standalone: true, imports: [CommonModule, FormsModule, ToasterComponent],
})
export class UserRegistrationApprovalComponent implements OnInit {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;

    // =========================================================  // DATA  // =========================================================
    registrations: UserRegistration[] = [];
    filteredRegistrations: UserRegistration[] = [];
    selectedRegistration: UserRegistration | null = null;
    // =========================================================  // UI  // =========================================================
    searchText = '';
    isLoading = false;
    isProcessing = false;
    showDetails = false;
    showReject = false;
    rejectionReason = '';

    // =========================================================  // INIT  // =========================================================

    constructor(private registrationService: RegistrationService) { }
    ngOnInit(): void {
        this.loadRegistrations();
    }

    // =========================================================  // LOAD PENDING REGISTRATIONS  // =========================================================

    loadRegistrations(): void {
        this.isLoading = true;
        this.registrationService.getPendingRegistrations().subscribe({
            next: (res: any) => {
                this.registrations = res || [];
                this.filteredRegistrations = [...this.registrations];
                this.isLoading = false;
            },
            error: (err: any) => {
                this.isLoading = false;
                console.error('Failed to load registrations', err);
                this.toaster.showMessage(err?.error?.error || 'Failed to load pending registrations.', 'error');
            }
        });
    }

    // =========================================================  // SEARCH  // =========================================================

    search(event: any): void {
        this.searchText = event?.target?.value?.toLowerCase()?.trim() || '';

        this.filteredRegistrations = this.registrations.filter(item => {
            return (
                item.name?.toLowerCase().includes(this.searchText)
                ||
                item.email?.toLowerCase().includes(this.searchText)
                ||
                item.mobileNumber?.toLowerCase().includes(this.searchText)
            );
        });
    }

    // =========================================================  // VIEW DETAILS  // =========================================================

    viewDetails(registration: UserRegistration): void {
        this.selectedRegistration = { ...registration };
        this.showDetails = true;
    }

    // =========================================================  // CLOSE DETAILS  // =========================================================

    closeDetails(): void {
        this.showDetails = false;
        this.selectedRegistration = null;
    }

    // =========================================================  // APPROVE  // =========================================================

    approve(registration: UserRegistration): void {
        if (!registration.id) { return; }

        const confirmed = confirm(`Are you sure you want to approve ${registration.name}?`);
        if (!confirmed) { return; }
        this.isProcessing = true;
        this.registrationService.approveRegistration(registration.id).subscribe({
            next: (res: any) => {
                this.isProcessing = false;
                this.toaster.showMessage(res?.message || 'User approved successfully.', 'success');
                this.closeDetails();
                this.loadRegistrations();
                  localStorage.removeItem(NavigationURLs.USER_LIST);
                
            },
            error: (err: any) => {
                this.isProcessing = false;
                console.error('Approval failed', err);
                this.toaster.showMessage(err?.error?.error || 'Failed to approve user.', 'error');
            }
        });
    }

    // =========================================================  // OPEN REJECT  // =========================================================
    openReject(registration: UserRegistration): void {
        this.selectedRegistration = { ...registration };
        this.rejectionReason = '';
        this.showReject = true;
    }

    // =========================================================  // CLOSE REJECT  // =========================================================
    closeReject(): void {
        this.showReject = false;
        this.rejectionReason = '';
        this.selectedRegistration = null;
    }

    // =========================================================  // REJECT  // =========================================================
    reject(): void {
        if (!this.selectedRegistration?.id) { return; }

        if (!this.rejectionReason.trim()) {
            this.toaster.showMessage('Please enter rejection reason.', 'error');
            return;
        }
        const confirmed = confirm(`Are you sure you want to reject ${this.selectedRegistration.name}?`);
        if (!confirmed) { return; }
        this.isProcessing = true;
        this.registrationService.rejectRegistration(this.selectedRegistration.id, this.rejectionReason.trim()).subscribe({
            next: (res: any) => {
                this.isProcessing = false;
                this.toaster.showMessage(res?.message || 'User registration rejected successfully.', 'success');
                this.closeReject();
                this.loadRegistrations();
            },
            error: (err: any) => {
                this.isProcessing = false;
                console.error('Rejection failed', err);
                this.toaster.showMessage(err?.error?.error || 'Failed to reject user.', 'error');
            }
        });
    }

    // =========================================================  // DATE FORMAT  // =========================================================
    formatDate(date: string | undefined): string {
        if (!date) { return ''; }
        return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
}