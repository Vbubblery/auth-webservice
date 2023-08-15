export default () => ({
  environment: process.env.NODE_ENV || "development",
  database: {
    host: process.env.DB_HOST,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    port: parseInt(process.env.DB_PORT!, 10) || 5432,
  },
});
