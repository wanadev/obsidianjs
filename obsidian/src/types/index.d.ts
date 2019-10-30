export = obsidian;

/**
 * Obsidian application factory.
 *
 * @public
 * @param {string} [name=obsidian] The name of the application (default: ``"obsidian"``).
 * @return {Application} A new Obsidian application.
 */
declare function obsidian(name?: string | undefined): obsidian.Application;

declare module "./src/application" {
    export class Application {
        modules: {[key: string]: any};
        use(module: obsidian.Module, data?: any) : Promise<void>;
    }
}

declare namespace obsidian {
    export interface Module extends ModuleDeclaration {
        app: Application;
    }

    export interface ModuleDeclaration {
        name: string;
        requires: string[];
        load(): void;
        unload(): void;
    }
    export type Application = import("./src/application");

}
