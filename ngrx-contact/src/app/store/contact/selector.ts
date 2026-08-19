import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactState } from './reducer';

export const selectContactState =
  createFeatureSelector<ContactState>('contacts');

export const selectAllUsers = createSelector(
  selectContactState,
  (state: ContactState) => state.users,
);

export const selectUserById = (id: string) =>
  createSelector(selectAllUsers, (users) =>
    users.find((user) => user.id === id),
  );
