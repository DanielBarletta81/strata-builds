export const instruments = [
  { href: "/deep-time", label: "Deep Time Observatory" },
  { href: "/signals", label: "NOAA Signals Lab" },
  { href: "/oceanography", label: "Oceanography" },
  { href: "/atlas", label: "Atlas · Synthetic demo" },
  { href: "/orbital", label: "Orbital Observatory" },
  { href: "/frontier", label: "Evidence Frontier" },
] as const;
export const researchRoutes = [
  { href: "/orbital/voyager", label: "Voyager light-time" },
  { href: "/oceanography/pawtuxet", label: "Pawtuxet observations" },
  { href: "/frontier/reconciliation", label: "Evidence reconciliation" },
  { href: "/research/bass-2003", label: "Bass population research" },
] as const;
export function routeIsCurrent(pathname: string, href: string) {
  return pathname === href;
}
export function instrumentIsActive(pathname: string) {
  return [...instruments, ...researchRoutes].some(
    ({ href }) => pathname === href || pathname.startsWith(href + "/"),
  );
}
