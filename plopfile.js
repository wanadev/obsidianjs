// camelCase: changeFormatToThis
// snakeCase: change_format_to_this
// dashCase/kebabCase: change-format-to-this
// dotCase: change.format.to.this
// pathCase: change/format/to/this
// properCase/pascalCase: ChangeFormatToThis
// lowerCase: change format to this
// sentenceCase: Change format to this,
// constantCase: CHANGE_FORMAT_TO_THIS
// titleCase: Change Format To This
const isNotEmptyFor = name =>
    (value) => {
        if (value === null || value === "") {
            return `${name} is required`;
        }
        return true;
    };

module.exports = (plop) => {
    plop.setGenerator("module", {
        description: "Create a new module",

        prompts: [{
            type: "input",
            name: "name",
            message: "What is your module name ?",
            validate: isNotEmptyFor("name"),
        }, {
            type: "confirm",
            name: "test",
            message: "Do we create tests ?",
        }],

        actions: (data) => {

            let actions = [{
                type: "add",
                path: "./modules/{{dashCase name}}/LICENSE",
                templateFile: "module-templates/LICENSE",
            }, {
                type: "add",
                path: "./modules/{{dashCase name}}/index.js",
                templateFile: "module-templates/index.template.js",
            }, {
                type: "add",
                path: "./modules/{{dashCase name}}/README.rst",
                templateFile: "module-templates/README.template.rst",
            }, {
                type: "add",
                path: "./modules/{{dashCase name}}/doc/index.rst",
                templateFile: "module-templates/doc/index.template.rst",
            }, {
                type: "add",
                path: "./modules/{{dashCase name}}/src/{{dashCase name}}.js",
                templateFile: "module-templates/src/module.template.js",
            }];

            if (data.test === false) {
                actions = actions.concat([{
                    type: "add",
                    path: "./modules/{{dashCase name}}/.npmignore",
                    templateFile: "module-templates/.npmignore",
                }]);
            } else {
                actions = actions.concat([{
                    type: "add",
                    path: "./modules/{{dashCase name}}/.npmignore",
                    templateFile: "module-templates/.npmignore.test",
                }, {
                    type: "add",
                    path: "./modules/{{dashCase name}}/__mocks__/index.js",
                    templateFile: "module-templates/__mocks__/index.template.js",
                }, {
                    type: "add",
                    path: "./modules/{{dashCase name}}/src/{{dashCase name}}.test.js",
                    templateFile: "module-templates/src/module.template.test.js",
                }]);
            }

            return actions;
        },

    });
};
