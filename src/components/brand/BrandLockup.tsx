import Image from "next/image";
import Link from "next/link";
import styles from "./brand.module.css";
export default function BrandLockup() {
  return (
    <Link href="/" className={styles.brand} aria-label="STRATA Builds — Home">
      <Image
        src="/brand/strata-lockup.svg"
        width={252}
        height={48}
        alt=""
        unoptimized
        priority
      />
      <span aria-hidden="true">BUILDS</span>
    </Link>
  );
}
