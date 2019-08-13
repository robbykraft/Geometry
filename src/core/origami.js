import {
  counter_clockwise_angle2_radians
} from "./geometry";

import { clean_number } from "../parsers/arguments";
import { is_counter_clockwise_between } from "./query";

/**
 * two varieties: vectors, radians, with a very important difference!:
 *
 * 1. the vectors describe the direction of the segment (length doesn't matter)
 * 2. the angles in radians are the INTERIOR ANGLES between the segments, not
 * the radians form of the vectors in case 1.
 *
 * case 2. is generally the faster way, vectors have to be turned into interior
 * angles.
 */

/**
 *
 *
 */
export const alternating_sum = function (...angles) {
  return [0, 1].map(even_odd => angles
    .filter((_, i) => i % 2 === even_odd)
    .reduce((a, b) => a + b, 0));
};

/**
 * sums is 2 arrays, array filtered into even and odd, summed
 *
 */
export const kawasaki_sector_score = function (...angles) {
  return alternating_sum(...angles)
    .map(a => (a < 0 ? a + Math.PI * 2 : a))
    .map(s => Math.PI - s);
};
// export const kawasaki_from_even_vectors = function (...vectors) {
//   return kawasaki_sector_score(...interior_angles(...vectors));
// };

/**
 *
 *
 */
export const kawasaki_solutions_radians = function (...vectors_radians) {
  return vectors_radians
    .map((v, i, ar) => counter_clockwise_angle2_radians(
      v, ar[(i + 1) % ar.length]
    ))
    // for every sector, make an array of all the OTHER sectors
    .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
    // for every sector, use the sector score from the OTHERS two to split it
    .map(opposite_sectors => kawasaki_sector_score(...opposite_sectors))
    .map((kawasakis, i) => vectors_radians[i] + kawasakis[0])
    .map((angle, i) => (is_counter_clockwise_between(angle,
      vectors_radians[i], vectors_radians[(i + 1) % vectors_radians.length])
      ? angle
      : undefined));
  // or should we remove the indices so the array reports [ empty x2, ...]
  // solutions.forEach((angle, i) => {
  //   if (is_counter_clockwise_between(angle,
  //     vectors_radians[i],
  //     vectors_radians[(i + 1) % vectors_radians.length])) {
  //     delete solutions[i];
  //   }
  // });
  // return solutions;
};

export const kawasaki_solutions = function (...vectors) {
  const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
  return kawasaki_solutions_radians(...vectors_radians)
    .map(a => (a === undefined
      ? undefined
      : [clean_number(Math.cos(a), 14), clean_number(Math.sin(a), 14)]));
};
