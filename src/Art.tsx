export default function Landscape() {
  return (
    <svg
      className="landscape"
      viewBox="0 0 680 350"
      role="img"
      aria-label="Illustrated Great Lakes shore with a lighthouse, pine trees, and a sailboat"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#d5e6dc" />
          <stop offset="1" stopColor="#f0edcc" />
        </linearGradient>
        <linearGradient id="lake" x2="0" y2="1">
          <stop stopColor="#78b7b3" />
          <stop offset="1" stopColor="#b4d7c6" />
        </linearGradient>
      </defs>
      <path fill="url(#sky)" d="M0 0h680v350H0z" />
      <circle cx="481" cy="85" r="43" fill="#f8d878" />
      <path d="M0 189Q120 102 231 180T441 166T680 176V350H0" fill="#9ebba7" />
      <path d="M0 209Q166 160 320 206T680 195V350H0" fill="url(#lake)" />
      <path
        d="M0 267Q80 202 163 237T279 267Q180 289 192 350H0"
        fill="#c8ce9e"
      />
      <path d="M0 300Q111 245 197 288L142 350H0" fill="#6b927b" />
      <g stroke="#d1e5d6" strokeWidth="3" strokeLinecap="round">
        <path d="M310 264h81m-14 20h69m71-57h49m-235 77h93m94 15h72" />
      </g>
      <g transform="translate(155 111)">
        <path d="M8 124L23 34h31l15 90" fill="#fcf7df" />
        <path d="M16 78h45l4 23H12" fill="#d78162" />
        <path
          d="M20 34V10h37v24"
          fill="#f9edc8"
          stroke="#345f54"
          strokeWidth="4"
        />
        <path d="M12 10L39-8 66 10" fill="#345f54" />
        <path d="M34 0v-12" stroke="#345f54" strokeWidth="3" />
        <path d="M0 125h78" stroke="#345f54" strokeWidth="5" />
        <path d="M32 109v16h15v-16a7 7 0 00-15 0" fill="#345f54" />
      </g>
      <g transform="translate(468 186)">
        <path d="M0 48h70L57 59H13" fill="#294f46" />
        <path d="M34 0v48" stroke="#345f54" strokeWidth="3" />
        <path d="M29 4L2 42h27" fill="#fff8dc" />
        <path d="M39 15v27h26" fill="#e2b275" />
      </g>
      {[
        [-8, 175, 1.25],
        [49, 199, 1],
        [93, 229, 0.7],
        [606, 174, 1.2],
        [657, 160, 1.5],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <path d="M0 84h10V2H0" fill="#426754" />
          <path
            d="M5-28L-26 28h16l-26 32h82L23 28h16"
            fill={i % 2 ? "#356d59" : "#285a4d"}
          />
        </g>
      ))}
      <path
        d="M339 94q8-10 16 0q8-10 16 0m-64 28q6-8 12 0q6-8 12 0"
        fill="none"
        stroke="#5a7d6c"
        strokeWidth="2"
      />
      <g
        transform="translate(565 55)"
        fill="none"
        stroke="#457465"
        opacity=".5"
      >
        <circle r="25" />
        <path d="M0-32v64m-32-32h64M-12 12L0-19 12 12 0 5z" />
      </g>
    </svg>
  );
}
