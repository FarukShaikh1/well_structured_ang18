import { TransactionReportResponse } from "../../interfaces/transaction-report-response";
import { ChartConfiguration } from "chart.js";
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgChartsModule } from "ng2-charts";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-transaction-pie-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './transaction-pie-chart.component.html'
})

export class TransactionPieChartComponent implements OnChanges {
  @Input() reportData: TransactionReportResponse[] = [];

  originalReportData: TransactionReportResponse[] = []; // store original copy
  selectedType = 'expense'; // default to expense

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

    // Save original data only when input changes from parent
    this.originalReportData = JSON.parse(JSON.stringify(this.reportData));

    this.updateChart();
  }

  updateChart() {
    const isIncome = this.selectedType === 'income';

    const filteredData = this.reportData.filter(item =>
      isIncome ? item.takenAmount !== 0 : item.givenAmount !== 0
    );

    const labels = filteredData.map(item => item.sourceOrReason || 'Unknown');
    const amounts = isIncome
      ? filteredData.map(x => x.takenAmount || 0)
      : filteredData.map(x => x.givenAmount || 0);

    this.colorIndex = 60000; // reset color sequence
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
      // Reset reportData from original when switching type
      this.reportData = JSON.parse(JSON.stringify(this.originalReportData));
      this.updateChart();
    }
  }

  mergeAsOther(selectedSourceOrReason: string) {
    if (!selectedSourceOrReason) return;
    const isIncome = this.selectedType === 'income';
    let otherAmount = 0;

    this.reportData = this.reportData.filter(item => {
      if (item.sourceOrReason === selectedSourceOrReason) {
        otherAmount += isIncome ? item.takenAmount || 0 : item.givenAmount || 0;
        return false;
      }
      return true;
    });

    const existingOther = this.reportData.find(item => item.sourceOrReason === "Other");
    if (existingOther) {
      if (isIncome) {
        existingOther.takenAmount = (existingOther.takenAmount || 0) + otherAmount;
      } else {
        existingOther.givenAmount = (existingOther.givenAmount || 0) + otherAmount;
      }
    } else {
      this.reportData.push({
        sourceOrReason: "Other",
        takenAmount: isIncome ? otherAmount : 0,
        givenAmount: !isIncome ? otherAmount : 0,
      });
    }

    this.updateChart();
  }
}
