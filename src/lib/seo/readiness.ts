import { aiConfigured, aiProvider } from "./ai";
import { jobsConfigured } from "./job-store";
import { redisCredentials } from "./redis-config";
export function cronConfigured() { return (process.env.CRON_SECRET?.length || 0) >= 32; }
export function integrationReadiness() {
  const redis = redisCredentials();
  return {
    storage: Boolean(redis.url?.startsWith("https://") && redis.token),
    background: jobsConfigured(), scheduler: jobsConfigured() && cronConfigured(),
    ai: aiConfigured(), aiProvider: aiProvider(), pagespeed: Boolean(process.env.PAGESPEED_API_KEY),
    google: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.SEO_GOOGLE_PROPERTIES_JSON && process.env.SEO_GOOGLE_PROPERTIES_JSON !== "{}"),
    // These flags reflect configuration presence, not a successful provider test.
  };
}
