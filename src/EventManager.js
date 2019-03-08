import SlimeError from './Error'

function EventManager() {
  const definedEvents = [
    "onEvent",
    "onAuth",
    "onDisplayUserMedia"
  ]
  const listeners = new Map(definedEvents.map(item => [item]))
  function addEventListener({ type, listenerItem }) {
    if (typeof listenerItem !== "function") {
      throw new SlimeError("EventManager:listenerMustBeAFunction");
    } else if (!definedEvents.includes(type)) {
      throw new SlimeError("EventManager:UnmatchedEvent");
    } else {
      listeners.set(type, listenerItem);
    }
  }

  function hasEventListener(type) {
    if (!definedEvents.includes(type)) {
      throw new SlimeError("EventManager:UnmatchedEvent");
    } else if (typeof listeners.get(type) === "undefined") {
      return false;
    } else {
      return true;
    }
  }

  function removeEventListener(type) {
    if (definedEvents.includes(type) && listeners.has(type)) {
      listeners.set(type, undefined);
    } else {
      throw new SlimeError("EventManager:UnmatchedEventOrDidNotContainAnylistener");
    }
  }

  function getEventListeners() {
    return listeners;
  }

  function dispatchEvent(type, ...args) {
    if (!definedEvents.includes(type)) {
      throw new SlimeError("EventManager:UnmatchedEvent");
    } else if (typeof listeners.get(type) === "undefined") {
      return;
    } else {
      return listeners.get(type)(...args);
    }
  }

  return Object.freeze({
    addEventListener,
    hasEventListener,
    removeEventListener,
    getEventListeners,
    dispatchEvent
  })
}
export default EventManager