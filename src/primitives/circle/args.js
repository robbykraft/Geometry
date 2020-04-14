import Constructors from "../constructors";
import { get_vector_of_vectors } from "../../parsers/arguments";
import { distance2 } from "../../core/algebra";

const CircleArgs = function () {
  const arr = Array.from(arguments);
  const numbers = arr.filter(param => !isNaN(param));
  const vectors = get_vector_of_vectors(arr);
  if (numbers.length === 3) {
    this.origin = Constructors.vector(numbers[0], numbers[1]);
    this.radius = numbers[2];
  } else if (vectors.length === 2) {
    this.radius = distance2(...vectors);
    this.origin = Constructors.vector(...vectors[0]);
  }
};

export default CircleArgs;