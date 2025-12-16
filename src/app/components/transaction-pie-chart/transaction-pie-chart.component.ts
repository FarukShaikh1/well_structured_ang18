import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ChartConfiguration } from "chart.js";
import { NgChartsModule } from "ng2-charts";
import { ApplicationConstants } from "../../../utils/application-constants";
import { TransactionReportResponse } from "../../interfaces/transaction-report-response";

@Component({
  selector: 'app-transaction-pie-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './transaction-pie-chart.component.html'
})

export class TransactionPieChartComponent implements OnChanges {
  @Input() reportData: TransactionReportResponse[] = [];
  @Input() reportType: string = 'sourceWise';
  parsedReportData: TransactionReportResponse[] = [];
  selectedType = 'expense';

  pieChartData: any;
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ₹${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  ngOnChanges(): void {
    if (!this.reportData?.length) return;
    this.parsedReportData = JSON.parse(JSON.stringify(this.reportData));
    this.updateChart();
  }

  updateChart() {
    const isIncome = this.selectedType === 'income';

    const filteredData = this.parsedReportData.filter(item =>
      (isIncome ? item.takenAmount !== 0 : item.givenAmount !== 0) && (item.takenAmount !== item.givenAmount)
    );
    var labels;
    if (this.reportType === ApplicationConstants.REPORT_TYPE_CATEGORY_WISE) {
      labels = filteredData.map(item => item.subCategoryName || 'Unknown');
    } else {
      labels = filteredData.map(item => item.sourceOrReason || 'Unknown');
    }
    const amounts = isIncome
      ? filteredData.map(x => x.takenAmount || 0)
      : filteredData.map(x => x.givenAmount || 0);

    this.colorIndex = 60000;
    const colors = labels.map(() => this.getSequentialColor());

    this.pieChartData = {
      labels,
      datasets: [{ data: amounts, backgroundColor: colors }]
    };
  }

  private colorIndex = 60000;

  getSequentialColor(): string {
    const hex = (this.colorIndex % 0x1000000).toString(16).padStart(6, '0');
    this.colorIndex += 100000;
    return `#${hex}`;
  }

  toggleCategory(value: string) {
    if (this.selectedType !== value) {
      this.selectedType = value;

      this.parsedReportData = JSON.parse(JSON.stringify(this.reportData));
      this.updateChart();
    }
  }

  hideTransaction(label: any) {
    this.reportData = this.reportData.filter((item: any) => {
      return item.sourceOrReason != label;
    });
    this.updateChart();
  }
}
