import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { GoalService } from '../../core/services/goal.service';
import { Goal } from '../../core/models/goal.model';
import { InrPipe } from '../../shared/pipes/inr.pipe';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatTableModule, InrPipe, ProgressBarComponent],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss'
})
export class GoalsComponent implements OnInit {
  private goalService = inject(GoalService);

  goals = signal<Goal[]>([]);

  ngOnInit(): void {
    this.goalService.getAll().subscribe(goals => this.goals.set(goals));
  }
}
