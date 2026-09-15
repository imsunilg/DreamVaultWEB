import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

const DEFAULT_COLORS = ['#3f6fdb', '#5fb0e0', '#8dd3a0', '#f2c14e', '#ef8354', '#c8553d', '#8a4fff', '#4fc3a1'];

@Component({
  selector: 'app-portfolio-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './portfolio-chart.component.html',
  styleUrl: './portfolio-chart.component.scss'
})
export class PortfolioChartComponent {
  @Input({ required: true })
  set labels(value: string[]) {
    this._labels = value;
    this.rebuild();
  }
  get labels(): string[] {
    return this._labels;
  }

  @Input({ required: true })
  set data(value: number[]) {
    this._data = value;
    this.rebuild();
  }
  get data(): number[] {
    return this._data;
  }

  private _labels: string[] = [];
  private _data: number[] = [];

  chartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

  private rebuild(): void {
    this.chartData = {
      labels: this._labels,
      datasets: [
        {
          data: this._data,
          backgroundColor: this._labels.map((_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length])
        }
      ]
    };
  }
}
