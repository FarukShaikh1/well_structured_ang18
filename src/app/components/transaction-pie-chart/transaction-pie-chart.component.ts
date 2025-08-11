import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { TransactionReportResponse } from '../../interfaces/transaction-report-response';

@Component({
  selector: 'app-transaction-pie-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './transaction-pie-chart.component.html'
})
export class TransactionPieChartComponent implements OnChanges {
  @Input() reportData: TransactionReportResponse[] = [];

  selectedType: 'income' | 'expense' = 'income';

  // pieChartData: ChartConfiguration<'pie'>['data'] = {
  //   labels: [],
  //   datasets: [{ data: [], backgroundColor: [] }]
  // };
  pieChartData: any;
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false }, // we'll make our own legend
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
    this.updateChart();
  }

  updateChart() {
    const isIncome = this.selectedType === 'income';

    const filteredData = this.reportData.filter(item =>
      isIncome ? item.takenAmount !== 0 : item.givenAmount !== 0
    );

    const labels = filteredData.map(item => item.sourceOrReason || 'Unknown');

    const amounts = isIncome
      ? this.reportData.map(x => x.takenAmount || 0)
      : this.reportData.map(x => x.givenAmount || 0);

    const colors = labels.map(() => this.getRandomColor());

    this.pieChartData = {
      labels,
      datasets: [{ data: amounts, backgroundColor: colors }]
    };
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    return `rgb(${r},${g},${b})`;
  }
}
