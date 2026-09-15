import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { LogService } from '../../../core/services/log.service';
import { AuditLog } from '../../../core/models/log.model';

@Component({
  selector: 'app-admin-activity-logs',
  standalone: true,
  imports: [DatePipe, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatTableModule],
  templateUrl: './admin-activity-logs.component.html',
  styleUrl: './admin-activity-logs.component.scss'
})
export class AdminActivityLogsComponent implements OnInit {
  private logService = inject(LogService);

  readonly columns = ['createdDate', 'username', 'action', 'entity', 'description'];

  logs = signal<AuditLog[]>([]);
  totalCount = signal(0);
  page = signal(1);
  pageSize = signal(20);

  action = '';
  entityName = '';
  dateFrom = '';
  dateTo = '';

  ngOnInit(): void {
    this.load();
  }

  search(): void {
    this.page.set(1);
    this.load();
  }

  resetFilters(): void {
    this.action = '';
    this.entityName = '';
    this.dateFrom = '';
    this.dateTo = '';
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
      .getActivityLogs({
        page: this.page(),
        pageSize: this.pageSize(),
        action: this.action || undefined,
        entityName: this.entityName || undefined,
        dateFrom: this.dateFrom || undefined,
        dateTo: this.dateTo || undefined
      })
      .subscribe(result => {
        this.logs.set(result.items);
        this.totalCount.set(result.totalCount);
      });
  }
}
