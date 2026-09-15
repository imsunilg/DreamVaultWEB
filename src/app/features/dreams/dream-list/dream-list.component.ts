import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DreamService } from '../../../core/services/dream.service';
import { Dream } from '../../../core/models/dream.model';
import { DreamCardComponent } from '../../../shared/components/dream-card/dream-card.component';

@Component({
  selector: 'app-dream-list',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    DreamCardComponent
  ],
  templateUrl: './dream-list.component.html',
  styleUrl: './dream-list.component.scss'
})
export class DreamListComponent implements OnInit {
  private dreamService = inject(DreamService);

  dreams = signal<Dream[]>([]);
  priorityFilter = signal<string>('All');

  filteredDreams = computed(() => {
    const filter = this.priorityFilter();
    const all = this.dreams();
    return filter === 'All' ? all : all.filter(d => d.priority === filter);
  });

  ngOnInit(): void {
    this.dreamService.getAll().subscribe(dreams => this.dreams.set(dreams));
  }
}
