import { props } from "alem";

const hrefWithParams = (href: string) => {
  // pass env & referrerId to all links
  if (props.env) {
    href = `${href}${href.includes("?") ? "&" : "?"}env=${props.env}`;
  }
  if (props.referrerId) {
    href = `${href}${href.includes("?") ? "&" : "?"}referrerId=${props.referrerId}`;
  }
  return href;
};

export default hrefWithParams;
