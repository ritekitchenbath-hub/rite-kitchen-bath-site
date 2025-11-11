export default function DebugPage() {
  return (
    <pre style={{ padding: 20 }}>
      {JSON.stringify(
        {
          NEXT_PUBLIC_TURNSTILE_SITE_KEY: !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          NEXT_PUBLIC_RECAPTCHA_SITE_KEY: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        },
        null,
        2
      )}
    </pre>
  );
}

