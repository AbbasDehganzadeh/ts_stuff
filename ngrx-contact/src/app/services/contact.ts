import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model/contact';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(BASE_URL + '/users')
      .pipe(
        map((data) =>
          data.map((d) => ({
            ...d,
            number: d.phone?.split(' ')[0].replace('-', ''),
          })),
        ),
      );
  }
}
