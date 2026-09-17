import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps } from "react-router";
import { useLocalePath } from "./useLocale";

/**
 * react-router's Link, but internal paths stay in the reader's language:
 * `<Link to="/spec">` goes to "/pt/spec" on a Portuguese page. Pages write
 * unprefixed paths and never think about locales.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  const localize = useLocalePath();
  const target = typeof to === "string" ? localize(to) : { ...to, pathname: to.pathname ? localize(to.pathname) : to.pathname };
  return <RouterLink ref={ref} to={target} {...rest} />;
});
