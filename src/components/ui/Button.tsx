import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import styles from "./ui.module.css";
type Props = (
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
) & { secondary?: boolean };
export default function Button(props: Props) {
  const { secondary = false, ...rest } = props;
  const className = `${styles.button} ${secondary ? styles.secondary : ""} ${props.className ?? ""}`;
  if ("href" in rest && rest.href !== undefined)
    return (
      <a
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={className}
      />
    );
  return (
    <button
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      className={className}
    />
  );
}
