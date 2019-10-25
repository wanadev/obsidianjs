export declare interface ObsidianModule extends ObsidianModuleDeclaration {
    app: ObsidianApp;
}

export declare interface ObsidianModuleDeclaration {
    name: string;
    requires: string[];
    load(): void;
    unload(): void;
}

export declare interface ObsidianApp {
    config: Object;
    events: ObsidianEventManager;
    modules: {[key: string]: any};
    use(module: ObsidianModule, data?: any) : Promise<void>;
    start(): void;
}

export declare interface ObsidianEventManager {
    /**
     * Subscribe to an event at a given path.
     */
    on(eventPath: string, listener: (...args: any[]) => void) : void;

    /**
     * Subscribe to a one-time event at a given path.
     */
    once(eventPath: string, listener: (...args: any[]) => void) : void;

    /**
     * Unsubscribe to an event at a given path.
     */
    removeListener(eventPath: string, listener: (...args: any[]) => void) : void;

    /**
     * Emit an event at a given path.
     */
    emit(eventPath: string, ...args: any[]): void;
}

declare function obsidian(name: string): ObsidianApp;

export default obsidian;
