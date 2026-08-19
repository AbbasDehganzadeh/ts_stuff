import { Component } from '@angular/core';
import { ContactEditor } from '../editor/editor';
import { ContactPresentor } from '../presentor/presentor';

@Component({
  selector: 'app-contact-container',
  imports: [ContactPresentor, ContactEditor],
  templateUrl: './container.html',
  styleUrl: './container.css',
  standalone: true,
})
export class ContactContainer {}
