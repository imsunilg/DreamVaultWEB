import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DreamService } from '../../../core/services/dream.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, DreamPriority, DreamStatus, DreamUpdateRequest } from '../../../core/models/dream.model';

@Component({
  selector: 'app-dream-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './dream-form.component.html',
  styleUrl: './dream-form.component.scss'
})
export class DreamFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dreamService = inject(DreamService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  dreamId = signal<number | null>(null);
  isEdit = signal(false);

  readonly priorities = ['Critical', 'High', 'Medium', 'Low'];
  readonly statuses = ['Wishlist', 'Planned', 'Active', 'Completed', 'Cancelled'];

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    categoryId: [null as number | null],
    priority: ['Medium', Validators.required],
    status: ['Wishlist', Validators.required],
    targetAmount: [0, [Validators.required, Validators.min(1)]],
    currentAmount: [0, [Validators.required, Validators.min(0)]],
    monthlyContribution: [0, [Validators.required, Validators.min(0)]],
    expectedReturnRate: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    inflationRate: [6, [Validators.required, Validators.min(0), Validators.max(50)]],
    startDate: [new Date(), Validators.required],
    targetDate: [new Date(), Validators.required],
    notes: ['']
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(categories => this.categories.set(categories));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.dreamId.set(id);
      this.isEdit.set(true);

      this.dreamService.getById(id).subscribe(dream => {
        this.form.patchValue({
          name: dream.name,
          description: dream.description ?? '',
          categoryId: dream.categoryId,
          priority: dream.priority,
          status: dream.status,
          targetAmount: dream.targetAmount,
          currentAmount: dream.currentAmount,
          monthlyContribution: dream.monthlyContribution,
          expectedReturnRate: dream.expectedReturnRate,
          inflationRate: dream.inflationRate,
          startDate: new Date(dream.startDate),
          targetDate: new Date(dream.targetDate),
          notes: dream.notes ?? ''
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: DreamUpdateRequest = {
      ...value,
      priority: value.priority as DreamPriority,
      status: value.status as DreamStatus,
      startDate: this.toDateOnly(value.startDate),
      targetDate: this.toDateOnly(value.targetDate)
    };

    const id = this.dreamId();
    if (id) {
      this.dreamService.update(id, payload).subscribe(dream => this.router.navigate(['/dreams', dream.dreamId]));
    } else {
      this.dreamService.create(payload).subscribe(dream => this.router.navigate(['/dreams', dream.dreamId]));
    }
  }

  private toDateOnly(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
