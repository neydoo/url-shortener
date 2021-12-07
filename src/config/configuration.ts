export interface Configuration {
  env: string;
  port: number;
  api: {
    baseUrl: string;
  };
}

export default (): Configuration => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 2001,
  api: {
    baseUrl: process.env.API_URL,
  },
});
