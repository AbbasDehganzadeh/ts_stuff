import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { contactReducer } from './store/contact/reducer';

export const appReducer: ActionReducerMap<AppState> = {
  contacts: contactReducer,
};
