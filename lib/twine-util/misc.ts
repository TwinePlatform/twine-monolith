import { useWith, unapply, identity, equals, always, compose, cond, juxt, flip, T } from 'ramda'

const equalsAndAlways = useWith(unapply(identity), [equals, always]);

// toggle :: a -> b -> (* -> *)
export const toggle = compose(
  cond,
  juxt([equalsAndAlways, flip(equalsAndAlways), always([T, identity])])
) as <U> (x: U, y: U) => (z: U) => U;
