const fs = require('fs');

const modulePath = fs.readdirSync('lib/modules')
const moduleCheck = (components, comp) => components.indexOf(comp) >= 0;

module.exports = (plop) => {
  plop.setGenerator('module', {
    description: 'Create a new graphql module',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'What is the name of the module?',
      validate: (value) => {
        if ((/.+/).test(value)) {
          return moduleCheck(modulePath, value) ? 'That module already exists.' : true;
        }
        return 'The name is required.';
      }
    }],
    actions: () => ([{
      type: 'add',
      path: '../lib/modules/{{pascalCase name}}/{{lowerCase name}}.entity.ts',
      templateFile: './entity.ts.hbs',
      abortOnFail: true
    }, {
      type: 'add',
      path: '../lib/modules/{{pascalCase name}}/{{lowerCase name}}.resolver.ts',
      templateFile: './resolver.ts.hbs',
      abortOnFail: true
    }, {
      type: 'add',
      path: '../lib/modules/{{pascalCase name}}/dto/{{lowerCase name}}-create.ts',
      templateFile: './create.dto.hbs',
      abortOnFail: true
    }, {
      type: 'add',
      path: '../lib/modules/{{pascalCase name}}/dto/{{lowerCase name}}-update.ts',
      templateFile: './update.dto.hbs',
      abortOnFail: true
    }, {
      type: 'append',
      path: '../lib/server.ts',
      pattern: `/* INJECT_IMPORT */`,
      template: `import {{pascalCase name}} from '@module/{{pascalCase name}}/{{lowerCase name}}.entity';`
    }, {
      type: 'append',
      path: '../lib/server.ts',
      pattern: `/* INJECT_DI */`,
      template: `DI.{{pascalCase name}}Repository = this.orm.em.getRepository({{pascalCase name}});`
    }, {
      type: 'append',
      path: '../lib/mikro-orm.config.ts',
      pattern: `/* INJECT_IMPORT */`,
      template: `import {{pascalCase name}} from '@module/{{pascalCase name}}/{{lowerCase name}}.entity';`
    }, {
      type: 'append',
      path: '../lib/mikro-orm.config.ts',
      pattern: `/* INJECT_DI */`,
      template: `{{pascalCase name}}Repository: EntityRepository<{{pascalCase name}}>;`
    }])
  })
};