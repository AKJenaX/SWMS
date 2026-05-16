import { EventEmitter } from 'events';

export const eventBus = new EventEmitter();
eventBus.setMaxListeners(50);

export function publishEvent(eventName, payload) {
  eventBus.emit(eventName, {
    ...payload,
    emittedAt: new Date().toISOString()
  });
}
