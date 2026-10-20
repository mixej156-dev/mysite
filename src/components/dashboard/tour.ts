/* Kept apart from DashboardTour so the account menu (shipped with the site header) can restart it cheaply */

export const TOUR_DONE_KEY = "dashboard_tour";
export const TOUR_START_EVENT = "dashboard-tour:start";

/** Clears the "seen" flag and starts the tour if the overview is open (otherwise it starts there next time) */
export function restartTour() {
  try {
    localStorage.removeItem(TOUR_DONE_KEY);
  } catch {
    // Storage blocked: the event below still starts it on this page
  }
  window.dispatchEvent(new Event(TOUR_START_EVENT));
}
