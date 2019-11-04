const SimpleSerializer = require("./simple-serializer").default;

class ClassA {

    constructor() {
        this.aa = "a";
        this.ab = {
            a: "aa",
            b: "ab",
        };
    }

    serialize() {
        return Object.assign({}, this);
    }

    unserialize(data) {
        Object.assign(this, data);
    }

}

class ClassB {

    constructor(b) {
        this.b = b;
    }

    serialize() {
        return { b: this.b };
    }

    unserialize(data) {
        this.b = data.b;
    }

}

describe("Class instance serializaton", () => {


    test("Classes serialization", () => {
        SimpleSerializer.registerClass(ClassA);
        SimpleSerializer.registerClass(ClassB);

        const a = new ClassA();
        const b = new ClassB("c");

        const serialized = SimpleSerializer.objectSerializer({
            pathA: a,
            pathB: b,

        });
        const unserialized = SimpleSerializer.objectUnserializer(serialized);

        console.log(unserialized);
        expect(serialized).toBeTruthy();

    });

});
