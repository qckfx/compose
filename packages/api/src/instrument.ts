import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://f6f6d950754ca0d351483dda30d1fad3@o4508728709808128.ingest.us.sentry.io/4509495424647168",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
