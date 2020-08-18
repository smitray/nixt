interface EnvironmentLayout {
  port: number;
  host: string;
  mongodb: {
    db: string;
    mongoPort: number;
  };
  graphUri: string;
}

const config: {
  [key: string]: EnvironmentLayout;
} = {
  development: {
    port: 3000,
    host: '127.0.0.1',
    mongodb: {
      db: 'nixt-dev',
      mongoPort: 27017,
    },
    graphUri: 'http://127.0.0.1:3000/graphql',
  },
  production: {
    port: 3000,
    host: '127.0.0.1',
    mongodb: {
      db: 'nixt-dev',
      mongoPort: 27017,
    },
    graphUri: 'http://127.0.0.1:3000/graphql',
  },
  test: {
    port: 3000,
    host: '127.0.0.1',
    mongodb: {
      db: 'nixt-dev',
      mongoPort: 27017,
    },
    graphUri: 'http://127.0.0.1:3000/graphql',
  },
};

export default (environment: string): EnvironmentLayout => config[environment];
