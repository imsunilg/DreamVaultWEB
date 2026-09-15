import { DecimalPipe } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [MatProgressBarModule, DecimalPipe],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  private percentSignal = signal(0);

  @Input()
  set percent(value: number) {
    this.percentSignal.set(value);
  }

  @Input() label = '';

  clampedPercent = computed(() => Math.min(100, Math.max(0, this.percentSignal())));
}
