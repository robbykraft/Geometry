import {
  get_vector,
  get_matrix2,
} from "../parse/input";

import {
  make_matrix2_rotation,
  make_matrix2_reflection,
  make_matrix2_inverse,
  multiply_matrices2,
  multiply_vector2_matrix2,
} from "../core/algebra";

import { clean_number } from "../parse/clean";

import Vector from "./vector";
/**
 * 2D Matrix (2x3) with translation component in x,y
 */
const Matrix2 = function (...args) {
  const matrix = get_matrix2(args);

  const inverse = function () {
    return Matrix2(make_matrix2_inverse(matrix)
      .map(n => clean_number(n)));
  };
  const multiply = function (...innerArgs) {
    const m2 = get_matrix2(innerArgs);
    return Matrix2(multiply_matrices2(matrix, m2)
      .map(n => clean_number(n)));
  };
  const transform = function (...innerArgs) {
    const v = get_vector(innerArgs);
    return Vector(multiply_vector2_matrix2(v, matrix)
      .map(n => clean_number(n)));
  };
  // return Object.freeze( {
  return {
    inverse,
    multiply,
    transform,
    get m() { return matrix; },
  };
};

// static methods
Matrix2.makeIdentity = () => Matrix2(1, 0, 0, 1, 0, 0);
Matrix2.makeTranslation = (tx, ty) => Matrix2(1, 0, 0, 1, tx, ty);
Matrix2.makeRotation = ((angle, origin) => Matrix2(
  make_matrix2_rotation(angle, origin).map(n => clean_number(n, 13)),
));
Matrix2.makeReflection = ((vector, origin) => Matrix2(
  make_matrix2_reflection(vector, origin).map(n => clean_number(n, 13)),
));

export default Matrix2;
