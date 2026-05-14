// The order here is deliberate and critical.
// Screen must change BEFORE network navigation begins.

export function executeQuickExit(): void {
  // 1. Destroy the rendered UI instantly
  const root = document.getElementById('app-root');
  if (root) root.innerHTML = '';  // Synchronous DOM clear

  // 2. Overwrite browser history so Back button cannot return
  window.history.replaceState(null, '', '/');
  window.history.go(-(window.history.length + 1));  // Drain history stack

  // 3. Navigate to a benign, commonly visited site
  //    Using a weather site — looks innocent if someone glances at browser history
  window.location.replace('https://www.weather.gov');
}
