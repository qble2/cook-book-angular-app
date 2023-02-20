import { UnitOfMeasure } from "./unit-of-measure.enum";

export interface Ingredient {
  id?: string; // UUID
  name?: string;
  defaultUnitOfMeasure?: UnitOfMeasure;

  quantity?: number | null;
  unitOfMeasure?: UnitOfMeasure | null;

  alternatives?: Ingredient[];

  _links?: any[];
}
