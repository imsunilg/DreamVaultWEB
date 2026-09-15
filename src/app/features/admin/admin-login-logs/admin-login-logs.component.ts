import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { LogService } from '../../../core/services/log.service';
import { LoginLog } from '../../../core/models/log.model';

@Component({
  selector: 'app-admin-login-logs',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './admin-login-logs.component.html',
  styleUrl: './admin-login-logs.component.scss'
})
export class AdminLoginLogsComponent implements OnInit {
  private logService = inject(LogService);

  readonly columns = ['loginDateTime', 'username', 'result', 'reason', 'ipAddress', 'browser', 'device'];

  logs = signal<LoginLog[]>([]);
  totalCount = signal(0);
  page = signal(1);
  pageSize = signal(20);

  dateFrom = '';
  dateTo = '';
  username = '';
  result: 'All' | 'Success' | 'Failed' = 'All';

  ngOnInit(): void {
    this.load();
  }

  search(): void {
    this.page.set(1);
    this.load();
  }

  resetFilters(): void {
    this.dateFrom = '';
    this.dateTo = '';
    this.username = '';
    this.result = 'All';
    this.page.set(1);
    this.load();
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  private load(): void {
    this.logService
      .getLoginLogs({
        page: this.page(),
        pageSize: this.pageSize(),
        dateFrom: this.dateFrom || undefined,
        dateTo: this.dateTo || undefined,
        username: this.username || undefined,
        success: this.result === 'All' ? undefined : this.result === 'Success'
      })
      .subscribe(result => {
        this.logs.set(result.items);
        this.totalCount.set(result.totalCount);
      });
  }
}
