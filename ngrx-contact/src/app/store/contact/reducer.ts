import { createReducer, on } from '@ngrx/store';
import { User } from '../../model/contact';
import { UserAction } from './actions';

export interface ContactState {
  users: User[];
  loading: boolean;
}

const initContact: ContactState = {
  users: [],
  loading: false,
};

export const contactReducer = createReducer(
  initContact,
  on(UserAction.loadUsers, (state: ContactState) => ({
    ...state,
    loading: true,
  })),
  on(UserAction.loadedUsers, (state: ContactState, { users }) => ({
    ...state,
    users,
    loading: false,
  })),
  on(UserAction.insertUser, (state: ContactState, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),
  on(UserAction.updateUser, (state: ContactState, { id, user }) => ({
    ...state,
    users: [...state.users.filter((o) => o.id !== id), user],
  })),
  on(UserAction.deleteUser, (state: ContactState, { id }) => ({
    ...state,
    users: state.users.filter((o) => o.id !== id),
  })),
);
