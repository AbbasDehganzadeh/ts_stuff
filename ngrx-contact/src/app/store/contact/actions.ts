import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../model/contact';

export const UserAction = createActionGroup({
  source: 'Contact User',
  events: {
    'Load Users': emptyProps(),
    'Loaded Users': props<{ users: User[] }>(),
    'Insert User': props<{ user: User }>(),
    'Update User': props<{ id: string; user: User }>(),
    'Delete User': props<{ id: string }>(),
  },
});
