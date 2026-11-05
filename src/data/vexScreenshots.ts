// Each phone owns its screens, so even overlapping crossfades cannot show
// the same screenshot on two phones. Keep these sets disjoint.
export const vexShowcasePhones = [
  {
    id: 'hotels',
    className: 'showcase-phone-one',
    source: 'vex-home.webp',
    alternate: 'vex-hotel-search.webp',
  },
  {
    id: 'stay',
    className: 'showcase-phone-two',
    source: 'vex-room-key.webp',
    alternate: 'vex-booking.webp',
  },
  {
    id: 'rewards',
    className: 'showcase-phone-three',
    source: 'vex-vouchers.webp',
  },
] as const
