import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { UserRole } from '../../../core/models/auth.model';
import { ResetPasswordDialogComponent } from './reset-password-dialog.component';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './admin-user-form.component.html',
  styleUrl: './admin-user-form.component.scss'
})
export class AdminUserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminUserService = inject(AdminUserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly roles: UserRole[] = ['Admin', 'User'];

  userId = signal<number | null>(null);
  isEdit = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.-]+$/)]],
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role: ['User' as UserRole, Validators.required],
    isActive: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.userId.set(id);
      this.isEdit.set(true);
      this.form.get('password')!.clearValidators();

      this.adminUserService.getUser(id).subscribe(user => {
        this.form.patchValue({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        });
      });
    } else {
      this.form.get('password')!.addValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    if (this.isEdit()) {
      this.adminUserService.updateUser(this.userId()!, value).subscribe({
        next: () => this.router.navigate(['/admin/users', this.userId()]),
        error: err => this.errorMessage.set(err.error?.message ?? 'Failed to update user.')
      });
    } else {
      this.adminUserService.createUser({ ...value, password: value.password! }).subscribe({
        next: user => this.router.navigate(['/admin/users', user.userId]),
        error: err => this.errorMessage.set(err.error?.message ?? 'Failed to create user.')
      });
    }
  }

  resetPassword(): void {
    this.dialog
      .open(ResetPasswordDialogComponent)
      .afterClosed()
      .subscribe(newPassword => {
        if (!newPassword) return;

        this.adminUserService.resetPassword(this.userId()!, { newPassword }).subscribe({
          next: () => this.snackBar.open('Password reset.', 'Dismiss', { duration: 3000 }),
          error: err => this.snackBar.open(err.error?.message ?? 'Failed to reset password.', 'Dismiss', { duration: 4000 })
        });
      });
  }
}
