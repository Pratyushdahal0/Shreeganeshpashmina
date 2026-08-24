export default {
  studio: {
    port: 5555,
  },
  migrate: {
    url: process.env.DATABASE_URL
  }
};
