import { Observer } from '../interfaces/observer.interface';

export class ConcreteObserver implements Observer {
  update(event: string): void {
    console.log('ConcreteObserver received event:', event);
  }
}
