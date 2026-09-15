import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-summary-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss'
})
export class SummaryCardComponent {
  @Input() label = '';
  @Input() value = '';
  @Input() icon = 'info';
  @Input() tone: 'default' | 'positive' | 'negative' = 'default';
}
