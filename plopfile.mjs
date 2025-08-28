export default function (plop) {
    plop.setGenerator('module-gen', {
        description: 'Generate a new service + hooks file',
        prompts: [
            {
                type: 'input',
                name: 'url',
                message:
                    'Bigay mo sakin Base API URL boy 📡 (e.g. /api/v1/bank):',
            },
            {
                type: 'input',
                name: 'name',
                message:
                    'Bigay mo name 🏷️ (small case lang, e.g. "member type", "user" ):',
            },
            {
                type: 'input',
                name: 'baseKey',
                message:
                    'Bigay mo base key 🔖 (small case lang boi, e.g. "user", "member type"):',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/modules/{{kebabCase name}}/{{kebabCase name}}.service.ts',
                templateFile: 'plop-templates/service.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{kebabCase name}}/{{kebabCase name}}.types.ts',
                templateFile: 'plop-templates/types.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{kebabCase name}}/{{kebabCase name}}.validation.ts',
                templateFile: 'plop-templates/validation.hbs',
            },
            {
                type: 'add',
                path: 'src/modules/{{kebabCase name}}/index.ts',
                templateFile: 'plop-templates/module-index.hbs',
            },
        ],
    })
}
