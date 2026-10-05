# Architecture rules

- The Port Call (Escala) is the central domain object; vessels are master data only — keeps visit data (ETA, drafts) out of the vessel record.
- Domain types, simulated scenario and the eligibility engine live in `src/data/portCalls.ts`; in-memory state and actions live in `src/contexts/PortCallStore.tsx` — one place to swap for the real API later.
- Eligibility (technical result) and Authorization (human decision) are separate; plan versions are never overwritten — required by the MVP domain guide.
- Reasons/conditions (e.g. waiting for tide) are a field, never a port call status — status and reason are distinct concepts.
- Port-call UI pieces live in `src/components/portcall/` — reused by dashboard, list, detail and planning screens.
