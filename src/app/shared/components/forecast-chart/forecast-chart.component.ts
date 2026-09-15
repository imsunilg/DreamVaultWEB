import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export interface LineSeries {
  label: string;
  data: number[];
  color: string;
  dashed?: boolean;
}

@Component({
  selector: 'app-forecast-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './forecast-chart.component.html',
  styleUrl: './forecast-chart.component.scss'
})
export class ForecastChartComponent {
  @Input({ required: true }) labels: string[] = [];

  private seriesValue: LineSeries[] = [];

  @Input({ required: true })
  set series(value: LineSeries[]) {
    this.seriesValue = value;
    this.chartData = {
      labels: this.labels,
      datasets: value.map(s => ({
        label: s.label,
        data: s.data,
        borderColor: s.color,
        backgroundColor: s.color,
        borderDash: s.dashed ? [6, 6] : [],
        tension: 0.3,
        pointRadius: 2,
        fill: false
      }))
    };
  }

  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        ticks: {
          callback: value => `₹${(Number(value) / 100000).toFixed(1)}L`
        }
      }
    }
  };
}
