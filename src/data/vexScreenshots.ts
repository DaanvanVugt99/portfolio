// Each phone owns its screens, so even overlapping crossfades cannot show
// the same screenshot on two phones. Keep these sets disjoint.
export const vexShowcasePhones = [
  {
    id: 'hotels',
    className: 'showcase-phone-one',
    source: 'vex-home.png',
    alternate: 'vex-hotel-search.png',
  },
  {
    id: 'stay',
    className: 'showcase-phone-two',
    source: 'vex-room-key.png',
    alternate: 'vex-booking.png',
  },
  {
    id: 'rewards',
    className: 'showcase-phone-three',
    source: 'vex-vouchers.png',
  },
] as const
