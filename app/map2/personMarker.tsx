import * as React from "react";
const SvgComponent = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    viewBox="-4 0 36 36"
    {...props}
  >
    <title>{"map-marker"}</title>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#FF6E6E"
        d="M14 0c7.732 0 14 5.641 14 12.6C28 23.963 14 36 14 36S0 24.064 0 12.6C0 5.641 6.268 0 14 0Z"
      />
      <circle cx={14} cy={14} r={7} fill="#0C0058" fillRule="nonzero" />
    </g>
  </svg>
);
export default SvgComponent;
