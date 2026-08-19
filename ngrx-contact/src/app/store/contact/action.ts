import { createAction, emptyProps, props } from '@ngrx/store';
import { User } from '../../model/contact';

export const loadUsers = createAction(
  '[Contact User] Load Users', emptyProps(),
)

export const loadedUsers = createAction(
  '[Contact User] Loaded Users', props<{ users: User[] }>(),
)

export const insertUser = createAction(
  '[Contact User] Insert User', props<{ user: User }>(),
)

  const events= {
    'Load Users': emptyProps(),
    'Loaded Users': props<{ users: User[] }>(),
    'Update User': props<{ id: string; user: User }>(),
    'Delete User': props<{ id: string }>(),
  }
