import "dotenv/config";

export const config = {
  port: process.env.PORT || 8080,
  cloudName: process.env.CLOUD_NAME,
  cloudKey: process.env.CLOUD_API_KEY,
  cloudSecret: process.env.CLOUD_SECRET,
};

export default config;