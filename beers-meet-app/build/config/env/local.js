const config = {
  jwtKey: '$2y$12$0UW8zEU6PoA8Zw7APPlYl.XiBGytpT3OLz/lU3GqAIkBSmbUEa3y.',
  mongodb: {
    url: 'localhost',
    user: '',
    pass: '',
    dbName: 'beerMeetup',
  }
};

module.exports = {
  env: 'local',
  port: 3200,
  envConfig: config,
};
