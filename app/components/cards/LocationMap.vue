<template>
  <svg
    aria-hidden="true"
    viewBox="0 0 300 260"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    class="pointer-events-none absolute inset-0 z-0 size-full"
  >
    <g
      class="stroke-map-grid"
      stroke-width="1"
    >
      <path d="M0 30H300M0 62H300M0 94H300M0 126H300M0 158H300M0 190H300M0 222H300M0 254H300" />
      <path d="M24 0V260M58 0V260M92 0V260M126 0V260M160 0V260M194 0V260M228 0V260M262 0V260M296 0V260" />
    </g>
    <g
      class="stroke-map-road"
      stroke-width="5"
      stroke-linecap="round"
    >
      <path d="M-10 210C60 180 110 150 150 120S240 40 320 20" />
      <path d="M200 -10C190 60 182 120 186 170S196 240 206 280" />
    </g>
    <path
      class="stroke-map-road-2"
      d="M126 0L150 260"
      stroke-width="3"
    />
    <circle
      class="fill-accent-soft"
      cx="150"
      cy="118"
      r="16"
    />
    <circle
      class="fill-accent stroke-surface"
      cx="150"
      cy="118"
      r="6"
      stroke-width="2"
    />
  </svg>
</template>
