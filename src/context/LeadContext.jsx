import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LeadContext = createContext(null);

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function buildWhatsAppUrl(baseUrl, text) {
  if (!baseUrl) return "";
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}text=${encodeURIComponent(text || "")}`;
}

export function LeadProvider({ children }) {
  const [lead, setLead] = useState(() => {
    const raw = sessionStorage.getItem("lead_context");
    const parsed = raw ? safeParse(raw) : null;
    if (parsed && typeof parsed === "object") return parsed;
    return { topic: "", source: "", meta: "" };
  });

  useEffect(() => {
    sessionStorage.setItem("lead_context", JSON.stringify(lead));
  }, [lead]);

  const api = useMemo(() => {
    return {
      lead,
      setLeadContext: (next) =>
        setLead((prev) => ({
          ...prev,
          ...next
        })),
      clearLeadContext: () => setLead({ topic: "", source: "", meta: "" })
    };
  }, [lead]);

  return <LeadContext.Provider value={api}>{children}</LeadContext.Provider>;
}

export function useLead() {
  const ctx = useContext(LeadContext);
  if (!ctx) {
    return {
      lead: { topic: "", source: "", meta: "" },
      setLeadContext: () => {},
      clearLeadContext: () => {}
    };
  }
  return ctx;
}

