import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Observable, debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserListItem } from '../../../core/models/admin-user.model';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  readonly columns = ['username', 'name', 'email', 'role', 'status', 'createdDate', 'lastLogin', 'actions'];

  users = signal<UserListItem[]>([]);
  totalCount = signal(0);
  page = signal(1);
  pageSize = signal(20);
  search = '';
  role = 'All';
  status = 'All';

  private searchSubject = new Subject<string>();

  get currentUserId(): number | null {
    return this.authService.currentUser()?.userId ?? null;
  }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(350), distinctUntilChanged()).subscribe(() => {
      this.page.set(1);
      this.load();
    });
    this.load();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.search);
  }

  onFilterChange(): void {
    this.page.set(1);
    this.load();
  }

  resetFilters(): void {
    this.search = '';
    this.role = 'All';
    this.status = 'All';
    this.page.set(1);
    this.load();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  private load(): void {
    this.adminUserService
      .getUsers({
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.search || undefined,
        role: this.role === 'All' ? undefined : this.role,
        status: this.status === 'All' ? undefined : this.status
      })
      .subscribe(result => {
        this.users.set(result.items);
        this.totalCount.set(result.totalCount);
      });
  }

  accountStatus(user: UserListItem): 'Active' | 'Inactive' | 'Locked' {
    if (user.isLocked) return 'Locked';
    return user.isActive ? 'Active' : 'Inactive';
  }

  activate(user: UserListItem): void {
    this.adminUserService.activate(user.userId).subscribe(() => {
      this.snackBar.open(`${user.username} activated.`, 'Dismiss', { duration: 3000 });
      this.load();
    });
  }

  deactivate(user: UserListItem): void {
    this.runWithConfirm(
      { title: 'Deactivate user?', message: 'Are you sure you want to deactivate this user?', details: this.userDetails(user), confirmLabel: 'Deactivate', destructive: true },
      this.adminUserService.deactivate(user.userId),
      `${user.username} deactivated.`
    );
  }

  lock(user: UserListItem): void {
    this.runWithConfirm(
      { title: 'Lock user?', message: 'Are you sure you want to lock this user? They will not be able to sign in until unlocked.', details: this.userDetails(user), confirmLabel: 'Lock', destructive: true },
      this.adminUserService.lock(user.userId),
      `${user.username} locked.`
    );
  }

  unlock(user: UserListItem): void {
    this.adminUserService.unlock(user.userId).subscribe(() => {
      this.snackBar.open(`${user.username} unlocked.`, 'Dismiss', { duration: 3000 });
      this.load();
    });
  }

  deleteUser(user: UserListItem): void {
    this.runWithConfirm(
      { title: 'Delete user?', message: 'Are you sure you want to delete this user?', details: this.userDetails(user), confirmLabel: 'Delete User', destructive: true },
      this.adminUserService.deleteUser(user.userId),
      `${user.username} deleted.`
    );
  }

  private userDetails(user: UserListItem) {
    return [
      { label: 'Username', value: user.username },
      { label: 'Email', value: user.email },
      { label: 'Role', value: user.role }
    ];
  }

  /** Opens a confirmation dialog; on confirm, runs `action$` and shows a snack bar with either the success message or the server's error. */
  private runWithConfirm(dialogData: ConfirmDialogData, action$: Observable<{ success: boolean }>, successMessage: string): void {
    this.dialog
      .open(ConfirmDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe(confirmed => {
        if (!confirmed) return;

        action$.subscribe({
          next: () => {
            this.snackBar.open(successMessage, 'Dismiss', { duration: 3000 });
            this.load();
          },
          error: err => this.snackBar.open(err.error?.message ?? 'Action failed.', 'Dismiss', { duration: 4000 })
        });
      });
  }
}
