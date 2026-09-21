export const eventTypes = [
  "page_view", "section_view", "checkout_start", "page_exit",
  "prediagnostic_started", "prediagnostic_step_1", "prediagnostic_step_2", "prediagnostic_step_3",
  "prediagnostic_completed", "prediagnostic_result_A", "prediagnostic_result_B",
  "prediagnostic_result_C", "prediagnostic_result_D", "prediagnostic_result_E",
  "basic_cta_clicked", "technician_cta_clicked",
] as const;
export type AnalyticsEvent = typeof eventTypes[number];
