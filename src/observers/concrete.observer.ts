import { Observer } from '../interfaces/observer.interface';

export class ConcreteObserver implements Observer {
  update(event: string): string {
    console.log('ConcreteObserver received event:', event);
    return event;
  }
}
