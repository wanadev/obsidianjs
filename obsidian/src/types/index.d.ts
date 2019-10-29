declare type Application = import("./src/application");

declare module "./src/application" {
    export class Application {
        modules: {[key: string]: any};
        use(module: Module, data?: any) : Promise<void>;
    }
}

export declare interface Module extends ModuleDeclaration {
    app: Application;
}

export declare interface ModuleDeclaration {
    name: string;
    requires: string[];
    load(): void;
    unload(): void;
}

export type obsidian = typeof import("./src/index");
