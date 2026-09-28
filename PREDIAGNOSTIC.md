# Free prediagnostic

Four local, deterministic questions. No LLM, external service, email capture or network diagnosis. The result is an indication, not a verified cause. Paid BASIC and its 299 CZK Checkout Session remain unchanged.

## Decision order

1. One device: C, unless the phone also fails near the router (E).
2. Selected rooms plus failure near the router: E (ambiguous evidence).
3. Works near router plus selected rooms, or weak signal behind walls: A.
4. Weak signal in selected rooms behind walls, near-router status unknown: A.
5. Fails everywhere including near router: D (connection or wider home network).
6. Fails near router with unknown location and a specific symptom: B.
7. Works near router, no walls, slow/drop/video symptom: B.
8. Other, incomplete or invalid combinations: E.

## Measurement

Existing `/api/analytics` endpoint and D1 table are reused. Events: `prediagnostic_started`, `prediagnostic_step_1/2/3`, `prediagnostic_completed`, `prediagnostic_result_A/B/C/D/E`, `basic_cta_clicked`. The future technician link uses `technician_cta_clicked` but is hidden without a destination. No answers or personal data are sent. A shared random session ID lasts one page load.

Step events mean an answer was submitted. Each step/completion/category is counted once per run. Editing answers can emit another category; analysis should select the last result per session rather than sum categories as people. Restart begins another run. Completion duration includes time spent going back. The BASIC click also retains the existing `checkout_start` event. Tracking failures cannot block navigation.

## Flag and follow-up

Set runtime `PREDIAGNOSTIC_ENABLED=false` to hide the new section; default is on. Page view sections identify `landing:A` (hidden) and `landing:B` (visible). This is a rollout flag, not randomized assignment. Configure an actual experiment before claiming causal conversion improvement.

Technician CTA awaits a real lead destination. Refresh intentionally clears answers. No database migration is required: event types are stored as text.
