export = Events;
/**
 * Handle Obsidian application events.
 */
declare class Events {
    /**
     * Subscribe to an event at a given path.
     *
     * @param {string} eventPath The path of the event.
     * @param {function} listener The event handler.
     */
    on(eventPath: string, listener: Function): void;
    /**
     * Subscribe to a one-time event at a given path.
     *
     * @todo not implemented yet
     * @param {string} eventPath The path of the event.
     * @param {function} listener The event handler.
     */
    once(eventPath: string, listener: Function): void;
    /**
     * Unsubscribe to an event at a given path.
     *
     * @param {string} eventPath The path of the event.
     * @param {function} listener The event handler.
     */
    removeListener(eventPath: string, listener: Function): void;
    /**
     * Emit an event at a given path.
     *
     * @param {string} eventPath The path of the event.
     * @param {...*} [args] The arguments to pass to the handlers.
     */
    emit(eventPath: string, ...args?: any[] | undefined): void;
    /**
     * Returns a namespaced instance or proxy object of this class.
     *
     * @private
     * @param {string} namespace
     * @return {Events|Object} The namespaced version of the class.
     */
    _getNamespaced(namespace: string): Object | Events;
    [ON](namespace: any, eventPath: any, listener: any): void;
    [ONCE](namespace: any, eventPath: any, listener: any): void;
    [REMOVE_LISTENER](namespace: any, eventPath: any, listener: any): void;
    [EMIT](namespace: any, eventPath: any, ...args: any[]): void;
    [LISTENERS]: {};
}
declare const ON: unique symbol;
declare const ONCE: unique symbol;
declare const REMOVE_LISTENER: unique symbol;
declare const EMIT: unique symbol;
declare const LISTENERS: unique symbol;
