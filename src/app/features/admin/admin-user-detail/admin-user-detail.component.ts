import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { LogService } from '../../../core/services/log.service';
import { UserDetail } from '../../../core/models/admin-user.model';
import { AuditLog } from '../../../core/models/log.model';

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './admin-user-detail.component.html',
  styleUrl: './admin-user-detail.component.scss'
})
export class AdminUserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private adminUserService = inject(AdminUserService);
  private logService = inject(LogService);

  user = signal<UserDetail | null>(null);
  timeline = signal<AuditLog[]>([]);

  accountStatus = signal<'Active' | 'Inactive' | 'Locked'>('Active');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.adminUserService.getUser(id).subscribe(user => {
      this.user.set(user);
      this.accountStatus.set(user.isLocked ? 'Locked' : user.isActive ? 'Active' : 'Inactive');
    });

    this.logService.getActivityLogs({ page: 1, pageSize: 20, userId: id }).subscribe(result => this.timeline.set(result.items));
  }
}
