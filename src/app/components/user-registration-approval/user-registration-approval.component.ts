import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnDefinition } from 'tabulator-tables';

import { ToasterComponent } from '../shared/toaster/toaster.component';
import { TabulatorGridComponent } from '../shared/tabulator-grid/tabulator-grid.component';
import { RegistrationService } from '../../services/registration/registration.service';
import { UserRegistration } from '../../interfaces/user-registration';
import { ApplicationTableConstants, NavigationURLs } from '../../../utils/application-constants';
import { DayDetailsComponent } from '../day-details/day-details.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { UserDetailsComponent } from '../user-details/user-details.component';
@Component({
    selector: 'app-user-registration-approval',
    templateUrl: './user-registration-approval.component.html',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ToasterComponent,
        TabulatorGridComponent
    ],
})
export class UserRegistrationApprovalComponent implements OnInit {
    @ViewChild(ToasterComponent) toaster!: ToasterComponent;
    @ViewChild(TabulatorGridComponent) tabulatorGrid!: TabulatorGridComponent;
    @ViewChild(UserDetailsComponent) userDetailsComponent!: UserDetailsComponent;
    @ViewChild(DayDetailsComponent) dayDetailsComponent!: DayDetailsComponent;
    @ViewChild(ConfirmationDialogComponent)
    confirmModalComponent!: ConfirmationDialogComponent;

    public filteredTableData: Record<string, unknown>[] = [];
    public tableData: Record<string, unknown>[] = [];
    public columnConfig: ColumnDefinition[] = [];
    public paginationSize = ApplicationTableConstants.DEFAULT_RECORDS_PER_PAGE;
    public allowCSVExport = true;
    public allowPrint = true;
    public filterColumns: ColumnDefinition[] = [];

    // =========================================================  // UI  // =========================================================
    searchText = '';
    isLoading = false;
    isProcessing = false;
    showDetails = false;
    showReject = false;
    rejectionReason = '';
    selectedRegistration: any;

    // =========================================================  // INIT  // =========================================================

    constructor(private registrationService: RegistrationService) { }
    ngOnInit(): void {
        this.columnConfiguration();
        this.loadRegistrations();
    }

    // =========================================================  // LOAD PENDING tableData  // =========================================================

    loadRegistrations(): void {
        this.isLoading = true;
        this.registrationService.getPendingRegistrations().subscribe({
            next: (res: any) => {
                this.tableData = res || [];
                this.filteredTableData = [...this.tableData];
                this.isLoading = false;
            },
            error: (err: any) => {
                this.isLoading = false;
                console.error('Failed to load tableData', err);
                this.toaster.showMessage(err?.error?.error || 'Failed to load pending tableData.', 'error');
            }
        });
    }

    // =========================================================  // SEARCH  // =========================================================

    search(event: any): void {
        this.searchText = event?.target?.value?.toLowerCase()?.trim() || '';

        this.filteredTableData = this.tableData.filter(item => {
            return (true
                // item.name?.toLowerCase().includes(this.searchText)
                // ||
                // item.email?.toLowerCase().includes(this.searchText)
                // ||
                // item.mobileNumber?.toLowerCase().includes(this.searchText)
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

    columnConfiguration(): void {

        this.columnConfig = [

            {
                title: 'Name',
                field: 'name',
                sorter: 'string'
            },

            {
                title: 'Email',
                field: 'email',
                sorter: 'string'
            },

            {
                title: 'Mobile',
                field: 'mobileNumber',
                sorter: 'string',
                formatter: (cell) => {
                    return cell.getValue() || '-';
                }
            },

            {
                title: 'Date of Birth',
                field: 'dateOfBirth',
                sorter: 'date',
                formatter: (cell) => {
                    return this.formatDate(cell.getValue());
                }
            },

            {
                title: 'Email Verified',
                field: 'emailVerified',
                hozAlign: 'center',
                formatter: (cell) => {

                    const value = cell.getValue();

                    return value
                        ? '<span title="Verified">✓</span>'
                        : '<span title="Not Verified">✖</span>';
                }
            },

            {
                title: 'Registered On',
                field: 'createdOn',
                sorter: 'date',
                formatter: (cell) => {
                    return this.formatDate(cell.getValue());
                }
            },

            {
                title: 'Status',
                field: 'status',
                sorter: 'string'
            },

            {
                title: 'Action',
                field: 'action',
                headerSort: false,
                hozAlign: 'center',
                width: 160,
                print: false,

                formatter: () => {

                    return `
                    <div class="d-flex gap-2 justify-content-center">

                        <button
                            class="btn btn-sm btn-outline-primary view-registration"
                            title="View">
                            <i class="bi bi-eye"></i>
                        </button>

                        <button
                            class="btn btn-sm btn-success approve-registration"
                            title="Approve">
                            ✓
                        </button>

                        <button
                            class="btn btn-sm btn-danger reject-registration"
                            title="Reject">
                            ✖
                        </button>

                    </div>
                `;
                },

                cellClick: (e, cell) => {

                    const target = e.target as HTMLElement;

                    const registration =
                        cell.getRow().getData() as UserRegistration;

                    if (
                        target.closest('.view-registration')
                    ) {
                        this.viewDetails(registration);
                        return;
                    }

                    if (
                        target.closest('.approve-registration')
                    ) {
                        this.approve(registration);
                        return;
                    }

                    if (
                        target.closest('.reject-registration')
                    ) {
                        this.openReject(registration);
                        return;
                    }
                }
            }
        ];
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