import type { LeadInput } from "@/lib/validators";

/** HubSpot Hub ID is numeric and public (it appears in the tracking script URL). */
export function hubspotPortalId() {
  const id = (process.env.HUBSPOT_PORTAL_ID || "").trim();
  return /^\d+$/.test(id) ? id : "";
}

export function hubspotFormId() {
  return (process.env.HUBSPOT_FORM_ID || "").trim();
}

// HubSpot Forms API: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
// Skips (returns false) when portal/form IDs are unset so email-only setups keep working.
export async function sendToHubSpot(lead: LeadInput, req: Request, ip: string | null) {
  const portalId = hubspotPortalId();
  const formId = hubspotFormId();
  if (!portalId || !formId) return false;

  const [firstname, ...rest] = lead.name.trim().split(/\s+/);
  const lastname = rest.join(" ") || firstname;
  const hutk = /(?:^|;\s*)hubspotutk=([^;]+)/.exec(req.headers.get("cookie") || "")?.[1];

  const fields: { name: string; value: string }[] = [
    { name: "firstname", value: firstname },
    { name: "lastname", value: lastname },
    { name: "email", value: lead.email },
    { name: "message", value: lead.message },
  ];
  if (lead.phone) fields.push({ name: "phone", value: lead.phone });

  const r = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: req.headers.get("referer") || undefined,
          pageName: "Contact",
          ipAddress: ip || undefined,
          ...(hutk ? { hutk } : {}),
        },
      }),
    }
  );
  if (!r.ok) throw new Error("HubSpot " + r.status + ": " + (await r.text()).slice(0, 300));
  return true;
}
