export type CardSpanValue = 1 | 2

/** Column span per layout: mobile (base), tablet (sm) and desktop/wide (lg). */
export interface CardSpan {
  base: CardSpanValue
  sm: CardSpanValue
  lg: CardSpanValue
}

export type CardVariant = 'light' | 'dark' | 'map'

/** Collapsed height on mobile; tablet and up use the shared row heights. */
export type CardMobileHeight = 240 | 280 | 290
