import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserAction } from '../../store/contact/actions';
import { selectAllUsers } from '../../store/contact/selector';
import { User } from '../../model/contact';

type Uselect = { [key: string]: boolean };

@Component({
  selector: 'app-contact-presentor',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './presentor.html',
  styles: `
    .table-container {
      background: var(--background-alternative);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px 0 rgba(46, 58, 89, 0.08);
    }

    .contacts-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }

    .contacts-table thead {
      background-color: #f7f9fc;
    }

    .contacts-table thead th {
      padding: 1rem;
      text-align: right;
      font-weight: 500;
      color: var(--text-secondary);
      border-bottom: 1px solid #edf1f7;
      font-size: 0.875rem;
    }

    .contacts-table tbody td {
      padding: 1rem;
      text-align: right;
      border-bottom: 1px solid #edf1f7;
      color: #2e3a59;
    }

    .contacts-table tbody tr:hover {
      background-color: #f7f9fc;
    }

    .action-buttons {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #8f9bb3;
    }

    th,
    td {
      padding: 1rem;
      text-align: right;
    }

    @media (max-width: 768px) {
      .contacts-table {
        font-size: 0.875rem;
      }

      .contacts-table th,
      .contacts-table td {
        padding: 0.75rem 0.5rem;
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `,
})
export class ContactPresentor implements OnInit {
  users$: Observable<User[]>;
  userids: Uselect = {};
  selectedAll = false; //user checkbox

  constructor(private store: Store) {
    this.users$ = this.store.select(selectAllUsers).pipe();
    this.users$.subscribe((o) =>
      o.map((u) => {
        this.userids[u.id] = false;
      }),
    );
  }

  ngOnInit() {
    this.store.dispatch(UserAction.loadUsers());
  }

  onApplyActions() {
    // Implementation for applying selected actions
    const entries = Object.entries(this.userids);
    for (const [key, val] of entries) {
      val && this.store.dispatch(UserAction.deleteUser({ id: key }));
    }
    console.log('Apply actions');
  }

  onToggle(id: string) {
    // Implementation for selecting all contacts
    this.userids[id] = !this.userids[id];
    this.isSelectedAll();
    console.log(`Select ${id}`);
  }

  onSelectAll() {
    for (const key of Object.keys(this.userids)) this.userids[key] = true;
    this.selectedAll = true;
    console.log('Select all');
  }

  onUnSelectAll() {
    for (const key of Object.keys(this.userids)) this.userids[key] = false;
    this.selectedAll = false;
    console.log('Select all');
  }
  private isSelectedAll() {
    this.selectedAll = true;
    Object.entries(this.userids).forEach(([key, val]) => {
      if (!val) this.selectedAll = false;
    });
  }
}
