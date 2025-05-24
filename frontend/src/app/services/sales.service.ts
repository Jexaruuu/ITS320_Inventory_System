import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private saleMadeSource = new BehaviorSubject<boolean>(false);
  saleMade$ = this.saleMadeSource.asObservable();

  notifySaleMade() {
    this.saleMadeSource.next(true);
  }

  resetNotification() {
    this.saleMadeSource.next(false);
  }
}
