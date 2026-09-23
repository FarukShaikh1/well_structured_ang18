import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";

import flatpickr from "flatpickr";

import {
  ActionConstant,
  ApplicationConstants,
  ApplicationModules,
  LocalStorageConstants,
  NavigationURLs,
  TransactionTabs
} from "../../../utils/application-constants";

import { DateUtils } from "../../../utils/date-utils";

import { CacheService } from "../../services/cache/cache.service";
import { GlobalService } from "../../services/global/global.service";
import { LoaderService } from "../../services/loader/loader.service";
import { TransactionService } from "../../services/transaction/transaction.service";

import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { TransactionDetailsComponent } from "./transaction-details/transaction-details.component";
import { BudgetComponent } from "../budget/budget.component";

import { TransactionListComponent } from "./transaction-list/transaction-list.component";
import { TransactionSummaryComponent } from "./transaction-summary/transaction-summary.component";
import { TransactionBalanceComponent } from "./transaction-balance/transaction-balance.component";
import { TransactionReportComponent } from "./transaction-report/transaction-report.component";
import { CategoryWiseReportComponent } from "./category-wise-report/category-wise-report.component";
import { EmergencyReturnReportComponent } from "./emergency-return-report/emergency-return-report.component";

import { TransactionFilter } from "./../../interfaces/transaction-filter.model";

@Component({
  selector: "app-transaction",
  standalone: true,
  imports: [
    CommonModule,
    TransactionListComponent,
    TransactionSummaryComponent,
    TransactionBalanceComponent,
    TransactionReportComponent,
    CategoryWiseReportComponent,
    EmergencyReturnReportComponent,
    TransactionDetailsComponent,
    ConfirmationDialogComponent,
    BudgetComponent
  ],
  templateUrl: "./transaction.component.html",
  styleUrls: ["./transaction.component.scss"]
})
export class TransactionComponent implements OnInit, OnDestroy {

  @ViewChild("searchInput")
  searchInput!: ElementRef<HTMLInputElement>;

  @ViewChild("minInput")
  minInput!: ElementRef<HTMLInputElement>;

  @ViewChild("maxInput")
  maxInput!: ElementRef<HTMLInputElement>;

  @ViewChild(TransactionDetailsComponent)
  transactionDetailsComponent!: TransactionDetailsComponent;

  @ViewChild(ConfirmationDialogComponent)
  confirmationDialog!: ConfirmationDialogComponent;

  TransactionTabs = TransactionTabs;

  activeTab: string = TransactionTabs.EXPENSE_LIST;

  selectedTab: string = TransactionTabs.EXPENSE_LIST;

  transactionGroupId = "";

  lastTransactionDate: Date = new Date();

  allowAdd = true;

  reportType = ApplicationConstants.REPORT_TYPE_SOURCE_WISE;

  filter: TransactionFilter = {
    fromDate: DateUtils.GetDateBeforeDays(30),
    toDate: DateUtils.GetDateBeforeDays(-30),
    sourceOrReason: "",
    minAmount: 0,
    maxAmount: 0
  };

  private documentClickHandler!: (event: Event) => void;

  constructor(
    private transactionService: TransactionService,
    private loaderService: LoaderService,
    private cacheService: CacheService,
    public globalService: GlobalService
  ) { }

  ngOnInit(): void {

    this.allowAdd =
      this.globalService.isAccessible(ActionConstant.ADD);

    this.globalService.reloadGrid$.subscribe(
      (listName: string) => {

        if (listName === ApplicationModules.EXPENSES) {

          this.clearFilters();

          // Child component reloads itself because
          // its @Input filter object changes.
          this.filter = {
            ...this.filter
          };
        }
      }
    );

    this.globalService.refreshList$.subscribe(
      (listName: string) => {

        if (listName === ApplicationModules.EXPENSES) {

          this.filter = {
            ...this.filter
          };
        }
      }
    );
  }

  ngAfterViewInit(): void {
    this.initializeDatePickers();
    this.initializeGlobalOptionsMenu();
  }

  ngOnDestroy(): void {

    if (this.documentClickHandler) {
      document.removeEventListener(
        "click",
        this.documentClickHandler
      );
    }
  }

  /**
   * Change active transaction tab.
   */
  goToTab(tab: string): void {

    this.activeTab = tab;
    this.selectedTab = tab;

    switch (tab) {

      case TransactionTabs.EXPENSE_REPORT:

        this.reportType =
          ApplicationConstants.REPORT_TYPE_SOURCE_WISE;

        break;

      case TransactionTabs.CATEGORY_WISE_REPORT:

        this.reportType =
          ApplicationConstants.REPORT_TYPE_CATEGORY_WISE;

        break;

      case TransactionTabs.EMERGENCY_RETURN_REPORT:

        this.reportType =
          ApplicationConstants.EMERGENCY_RETURN_REPORT;

        break;
    }
  }

  monthlyBudget(): void {

    this.activeTab =
      TransactionTabs.EXPENSE_BUDGET;

    this.selectedTab =
      TransactionTabs.EXPENSE_BUDGET;
  }

  /**
   * From date filter.
   */
  filterGridByFromDate(date: string): void {

    this.filter = {
      ...this.filter,
      fromDate: DateUtils.CorrectedDate(date)
    };

    this.clearGridCache();
  }

  /**
   * To date filter.
   */
  filterGridByToDate(date: string): void {

    this.filter = {
      ...this.filter,
      toDate: DateUtils.CorrectedDate(date)
    };

    this.clearGridCache();
  }

  /**
   * Search filter.
   */
  filterGridBySearch(event: Event): void {

    const value =
      (event.target as HTMLInputElement)?.value
        ?.toLowerCase() ?? "";

    this.filter = {
      ...this.filter,
      sourceOrReason: value
    };
  }

  /**
   * Minimum amount filter.
   */
  filterGridByMinAmount(event: Event): void {

    const value =
      (event.target as HTMLInputElement)?.value ?? "";

    this.filter = {
      ...this.filter,
      minAmount: Number(value) || 0
    };
  }

  /**
   * Maximum amount filter.
   */
  filterGridByMaxAmount(event: Event): void {

    const value =
      (event.target as HTMLInputElement)?.value ?? "";

    this.filter = {
      ...this.filter,
      maxAmount: Number(value) || 0
    };
  }

  /**
   * Refresh current tab.
   */
  refreshData(): void {

    this.cacheService.clear(
      NavigationURLs.EXPENSE_LIST
    );

    this.cacheService.clear(
      NavigationURLs.EXPENSE_SUMMARY_LIST
    );

    this.cacheService.clear(
      NavigationURLs.EXPENSE_BALANCE_LIST
    );

    this.cacheService.clear(
      NavigationURLs.EXPENSE_REPORT
    );

    this.cacheService.clear(
      NavigationURLs.CATEGORY_WISE_EXPENSE_REPORT
    );

    this.cacheService.clear(
      NavigationURLs.EMERGENCY_RETURN_REPORT
    );

    this.clearFilters();

    this.filter = {
      ...this.filter
    };
  }

  private clearFilters(): void {

    this.filter = {
      ...this.filter,
      sourceOrReason: "",
      minAmount: 0,
      maxAmount: 0
    };

    if (this.searchInput) {
      this.searchInput.nativeElement.value = "";
    }

    if (this.minInput) {
      this.minInput.nativeElement.value = "";
    }

    if (this.maxInput) {
      this.maxInput.nativeElement.value = "";
    }
  }

  private clearGridCache(): void {

    this.cacheService.clear(
      NavigationURLs.EXPENSE_LIST
    );

    this.cacheService.clear(
      NavigationURLs.EXPENSE_SUMMARY_LIST
    );

    this.cacheService.clear(
      NavigationURLs.EXPENSE_BALANCE_LIST
    );

    this.cacheService.clear(
      NavigationURLs.EXPENSE_REPORT
    );

    this.cacheService.clear(
      NavigationURLs.CATEGORY_WISE_EXPENSE_REPORT
    );
  }

  /**
   * Open transaction details popup.
   */
  transactionDetails(transactionGroupId: string): void {
    this.transactionDetailsComponent
      ?.openDetailsPopup(transactionGroupId);

    setTimeout(() => {

      const button =
        document.querySelector(
          "#openDetailsButton"
        ) as HTMLElement | null;

      button?.click();

    }, 120);
  }

  /**
   * Delete transaction.
   */
  deleteTransaction(transactionGroupId: string): void {

    if (!transactionGroupId) {
      return;
    }

    this.transactionGroupId =
      transactionGroupId;

    this.confirmationDialog.openConfirmationPopup(
      "Confirmation",
      "Are you sure you want to delete this transaction? This action cannot be undone."
    );
  }

  /**
   * Confirmation callback.
   */
  handleConfirmResult(isConfirmed: boolean): void {

    if (!isConfirmed) {
      return;
    }

    this.loaderService.showLoader(
      "Deleting transaction..."
    );

    this.transactionService
      .deleteTransaction(this.transactionGroupId)
      .subscribe({

        next: () => {

          this.loaderService.hideLoader();

          this.refreshData();
        },

        error: (error: any) => {

          console.error(
            "Error deleting transaction:",
            error
          );

          this.loaderService.hideLoader();
        }
      });
  }

  /**
   * Initialize date pickers.
   */
  private initializeDatePickers(): void {

    flatpickr("#fromDate", {

      dateFormat: "d/m/Y",

      defaultDate:
        DateUtils.strFormatToDDMMYYYY(
          this.filter.fromDate
        ),

      onChange: (
        selectedDates,
        dateStr
      ) => {

        const value =
          dateStr ||
          DateUtils.GetDateBeforeDays(30);

        this.filterGridByFromDate(value);
      }
    });

    flatpickr("#toDate", {

      dateFormat: "d/m/Y",

      defaultDate:
        DateUtils.strFormatToDDMMYYYY(
          this.filter.toDate
        ),

      onChange: (
        selectedDates,
        dateStr
      ) => {

        const value =
          dateStr ||
          DateUtils.GetDateBeforeDays(0);

        this.filterGridByToDate(value);
      }
    });
  }

  /**
   * Existing global three-dot menu support.
   */
  private initializeGlobalOptionsMenu(): void {

    this.documentClickHandler =
      (event: Event) => {

        const target =
          event.target as HTMLElement;

        if (
          target.closest(
            ".OPTIONS_MENU_THREE_DOTS"
          )
        ) {

          event.stopPropagation();

          return;
        }

        const globalMenu =
          document.getElementById(
            "globalDropdownMenu"
          );

        globalMenu?.remove();
      };

    document.addEventListener(
      "click",
      this.documentClickHandler
    );
  }
}