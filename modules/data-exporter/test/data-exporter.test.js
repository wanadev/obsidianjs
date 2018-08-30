jest.mock("../index.js");

const ObisidianProjectFile = require("obsidian-file/lib/ObsidianProjectFile.js");

const DataExporter = require("../src/data-exporter.js");
const self = require("../index.js");

describe("DataExporter.export", () => {

    test("returns a Buffer", () => {
        const dataExpoter = new DataExporter();
        const project = dataExpoter.export();

        expect(project).toBeInstanceOf(Buffer);
    });

    test("exports a valid Obsidian Project File", () => {
        const dataExpoter = new DataExporter();
        const project = dataExpoter.export();

        expect(ObisidianProjectFile.isObsidianProjectFile(project)).toBeTruthy();
        expect(() => new ObisidianProjectFile(project)).not.toThrow();
    });

    test("includes the serialized entities in the export", () => {
        const dataExpoter = new DataExporter();
        const projectBuffer = dataExpoter.export();
        const project = new ObisidianProjectFile(projectBuffer);

        expect(project.project).toEqual({
            "/a": [{
                __name__: "Entity",
                id: "1",
            }],
        });
    });

    test("includes given metadata", () => {
        const metadata = {
            foo: "bar",
            a: 1,
        };
        const dataExpoter = new DataExporter();
        const projectBuffer = dataExpoter.export(metadata);
        const project = new ObisidianProjectFile(projectBuffer);

        expect(project.metadata).toEqual(metadata);
    });

    test("passes given options to the ObsidianProjectFile export function", () => {
        const dataExpoter = new DataExporter();
        const projectBuffer = dataExpoter.export(undefined, { type: "TESTTYPE" });
        const project = new ObisidianProjectFile(projectBuffer);

        expect(project.type).toEqual("TESTTYPE");
    });

});

describe("DataExporter.exportAsBlob", () => {

    test("returns a Blob", () => {
        const dataExpoter = new DataExporter();
        const project = dataExpoter.exportAsBlob();

        expect(project).toBeInstanceOf(Blob);
    });

});

describe("DataExporter.exportAsData64", () => {

    test("returns a data64-encoded string", () => {
        const dataExpoter = new DataExporter();
        const project = dataExpoter.exportAsData64();

        expect(project).toMatch(/^[a-zA-Z0-9_+/-]+=*$/);
    });

});

describe("DataExporter.import", () => {

    test("imports an Obsidian Project File from a Buffer", () => {
        const projectData = {
            "/a": [{
                __name__: "Entity",
                id: "1",
            }],
        };
        const project = new ObisidianProjectFile();
        project.project = projectData;
        const projectBuffer = project.exportAsBlob();
        const dataExpoter = new DataExporter();
        dataExpoter.import(projectBuffer);

        expect(self.app.modules.dataStore.unserializeEntities).lastCalledWith(projectData);
    });

    test("clears the data-store content when importing project", () => {
        self.app.modules.dataStore.clear.mockClear();

        const project = new ObisidianProjectFile();
        const projectBuffer = project.exportAsBlob();
        const dataExpoter = new DataExporter();
        dataExpoter.import(projectBuffer);

        expect(self.app.modules.dataStore.clear).toHaveBeenCalledTimes(1);
    });

});

describe("DataExporter.importFromBlob", () => {

    test("imports an Obsidian Project File from a Blob", () => {
        self.app.modules.dataStore.unserializeEntities.mockClear();
        expect.assertions(1);

        const project = new ObisidianProjectFile();
        const projectBuffer = project.exportAsBlob();
        const projectBlob = new Blob([projectBuffer], { type: "application/x-obsidian-project" });
        const dataExpoter = new DataExporter();

        return dataExpoter.importFromBlob(projectBlob)
            .then(() => {
                expect(self.app.modules.dataStore.unserializeEntities).toHaveBeenCalledTimes(1);
            });
    });

});

describe("DataExporter.importFromData64", () => {

    test("imports an Obsidian Project File from a data64-encoded string", () => {
        self.app.modules.dataStore.unserializeEntities.mockClear();

        const project = new ObisidianProjectFile();
        const projectBuffer = project.exportAsBlob();
        const projectData64 = projectBuffer.toString("base64");
        const dataExpoter = new DataExporter();
        dataExpoter.importFromData64(projectData64);

        expect(self.app.modules.dataStore.unserializeEntities).toHaveBeenCalledTimes(1);
    });

});

describe("DataExporter additional tests", () => {

    test("It can import exported Buffers", () => {
        const dataExpoter = new DataExporter();
        const projectBuffer = dataExpoter.export();
        dataExpoter.import(projectBuffer);
    });

    test("It can import exported Blobs", () => {
        const dataExpoter = new DataExporter();
        const projectBlob = dataExpoter.exportAsBlob();
        return dataExpoter.importFromBlob(projectBlob);
    });

    test("It can import exported data64-encoded strings", () => {
        const dataExpoter = new DataExporter();
        const projectData64 = dataExpoter.exportAsData64();
        dataExpoter.importFromData64(projectData64);
    });

});
