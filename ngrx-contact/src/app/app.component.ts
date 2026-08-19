import { Component } from '@angular/core';
import { ContactContainer } from './contact/container/container';

@Component({
  selector: 'app-root',
  imports: [ContactContainer],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ang-contact';
}
