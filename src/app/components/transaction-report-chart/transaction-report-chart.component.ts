import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { TransactionReportResponse } from '../../interfaces/transaction-report-response';

@Component({
  selector: 'app-transaction-report-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './transaction-report-chart.component.html',
  styleUrls: ['./transaction-report-chart.component.scss']
})
export class TransactionReportChartComponent implements OnChanges {
  @Input() reportData: TransactionReportResponse[] = [];

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };
  barChartWidth = 800; 
  barChartOptions: ChartOptions<'bar'> = {
    responsive: false,            // Important: Turn off responsive to control width manually
    maintainAspectRatio: false,   // Allow flexible height
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
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        grid: { display: true }
      }
    },
    datasets: {
      bar: {
        barThickness: 20,       // ✅ Fixed bar width
        maxBarThickness: 20
      }
    }
  };

  ngOnChanges(): void {
    if (!this.reportData?.length) return;

    const labels = this.reportData.map(x => x.sourceOrReason || 'Unknown');
    const takenAmounts = this.reportData.map(x => x.takenAmount || 0);
    const givenAmounts = this.reportData.map(x => x.givenAmount || 0);

    /** Calculate total chart width based on number of labels */
    const widthPerBar = 45; // ✅ Controls how much space each label takes including padding
    this.barChartWidth = Math.max(800, labels.length * widthPerBar);

    this.barChartData = {
      labels,
      datasets: [
        { label: 'Income', data: takenAmounts, backgroundColor: '#4CAF50' },
        { label: 'Expense', data: givenAmounts, backgroundColor: '#F44336' }
      ]
    };
  }
}
