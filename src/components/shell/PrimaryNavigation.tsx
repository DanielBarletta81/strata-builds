"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import {
  instruments,
  researchRoutes,
  routeIsCurrent,
  instrumentIsActive,
} from "./navigation";
import styles from "./shell.module.css";
export default function PrimaryNavigation() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };
  return (
    <nav className={styles.navigation} aria-label="Primary">
      <Link
        href="/"
        aria-current={routeIsCurrent(pathname, "/") ? "page" : undefined}
      >
        Home
      </Link>
      <details
        className={styles.menu}
        ref={menu}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) {
            event.preventDefault();
            close();
            trigger.current?.focus();
          }
        }}
        onBlur={(event) => {
          if (
            event.relatedTarget &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            close();
        }}
      >
        <summary
          ref={trigger}
          data-active={instrumentIsActive(pathname) || undefined}
        >
          Instruments
        </summary>
        <div className={styles.menuLinks}>
          {instruments.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                routeIsCurrent(pathname, item.href) ? "page" : undefined
              }
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <p className={styles.menuLabel}>Research &amp; case studies</p>
          {researchRoutes.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                routeIsCurrent(pathname, item.href) ? "page" : undefined
              }
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </details>
      <Link
        href="/studio"
        aria-current={routeIsCurrent(pathname, "/studio") ? "page" : undefined}
      >
        Studio
      </Link>
    </nav>
  );
}
