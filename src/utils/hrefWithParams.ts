import { getAlemEnvironment, props } from "alem";

const hrefWithParams = (href: string) => {
  const env = getAlemEnvironment() === "staging" ? "staging" : null;
  // pass env & referrerId to all links
  if (env) {
    href = `${href}${href.includes("?") ? "&" : "?"}env=${env}`;
  }
  if (props.referrerId) {
    href = `${href}${href.includes("?") ? "&" : "?"}referrerId=${props.referrerId}`;
  }
  return href;
};

export default hrefWithParams;
