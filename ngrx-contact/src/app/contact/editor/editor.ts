import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserAction } from '../../store/contact/actions';

@Component({
  selector: 'app-contact-editor',
  imports: [FormsModule],
  templateUrl: './editor.html',
  styles: [
    `
      .form-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
        justify-content: flex-start;
      }

      @media (max-width: 768px) {
        .form-section {
          grid-template-columns: 1fr;
        }

        .action-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ContactEditor {
  name!: string;
  number!: string;
  email!: string;

  store = inject(Store)

  onInit() {
    this.initForm();
  }

  onSave() {
    const id_ = new Date().toString();
    const name = this.name;
    const number = this.number;
    const email = this.email;
    this.store.dispatch(
      UserAction.insertUser({ user: { id: id_, name, number, email } }),
    );
    console.log('Save contact');
  }

  onClear() {
    this.initForm();
    console.log('Clear form');
  }

  initForm() {
    this.name = '';
    this.number = '';
    this.email = '';
  }
}
