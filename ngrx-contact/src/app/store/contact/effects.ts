import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import {
  switchMap,
  catchError,
  map,
  mergeMap,
  tap,
  exhaustMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { ContactService } from '../../services/contact';
import { UserAction } from './actions';

@Injectable()
export class ContactEffects {
  actions$ = inject(Actions);

  constructor(private contactService: ContactService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserAction.loadUsers),
      tap(() => console.info('fetching users... ')),
      switchMap(
        () =>
          this.contactService.getUsers().pipe(
            map((users) => UserAction.loadedUsers({ users })),
            tap((users) => console.info({ users })),
          ),
        //catchError()
      ),
    ),
  );
}
