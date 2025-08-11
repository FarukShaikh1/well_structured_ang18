// transaction-report-chart.component.ts
import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { TransactionReportResponse } from '../../interfaces/transaction-report-response';

@Component({
  selector: 'app-transaction-report-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: "./transaction-report-chart.component.html"
})
export class TransactionReportChartComponent implements OnChanges {
  @Input() reportData: TransactionReportResponse[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };
  barChartWidth = 1800; // default width
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ₹${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        ticks: { autoSkip: false },
        grid: { display: false }
      },
      y: {
        beginAtZero: true
      }
    },
    datasets: {
      bar: {
        barThickness: 5, // Fixed width for each bar
        maxBarThickness: 5
      }
    }
  };

  ngOnChanges(): void {
    if (!this.reportData?.length) return;

    const labels = this.reportData.map(x => x.sourceOrReason || 'Unknown');
    const takenAmounts = this.reportData.map(x => x.takenAmount || 0);
    const givenAmounts = this.reportData.map(x => x.givenAmount || 0);

    // Calculate width: 60px per bar + padding
    this.barChartWidth = Math.max(1800, labels.length * 20);
    
    this.barChartData = {
      labels,
      datasets: [
        { label: 'Income', data: takenAmounts, backgroundColor: '#4CAF50' },
        { label: 'Expense', data: givenAmounts, backgroundColor: '#F44336' }
      ]
    };
  }
}
