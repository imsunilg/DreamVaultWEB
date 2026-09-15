import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected auth = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  profileError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  profileForm = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]]
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmNewPassword: ['', Validators.required]
  });

  ngOnInit(): void {
    this.auth.refreshCurrentUser().subscribe(user => {
      this.profileForm.patchValue({ firstName: user.firstName, lastName: user.lastName, email: user.email });
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.profileError.set(null);

    this.auth.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => this.snackBar.open('Profile updated.', 'Dismiss', { duration: 3000 }),
      error: (err: HttpErrorResponse) => this.profileError.set(err.error?.message ?? 'Failed to update profile.')
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmNewPassword) {
      this.passwordError.set('New password and confirmation do not match.');
      return;
    }

    this.passwordError.set(null);
    this.auth.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.snackBar.open('Password changed.', 'Dismiss', { duration: 3000 });
        this.passwordForm.reset();
      },
      error: (err: HttpErrorResponse) => this.passwordError.set(err.error?.message ?? 'Failed to change password.')
    });
  }
}
