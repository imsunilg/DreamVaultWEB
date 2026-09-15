import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Dream } from '../../../core/models/dream.model';
import { InrPipe } from '../../pipes/inr.pipe';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

const CATEGORY_ICONS: Record<string, string> = {
  Vehicles: 'two_wheeler',
  Property: 'home',
  Lifestyle: 'flight_takeoff',
  Financial: 'savings',
  Family: 'family_restroom',
  Custom: 'star'
};

@Component({
  selector: 'app-dream-card',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatChipsModule, InrPipe, DatePipe, ProgressBarComponent],
  templateUrl: './dream-card.component.html',
  styleUrl: './dream-card.component.scss'
})
export class DreamCardComponent {
  @Input({ required: true }) dream!: Dream;

  get icon(): string {
    return CATEGORY_ICONS[this.dream.categoryName ?? ''] ?? 'star';
  }
}
