import GW2ApiTrait from "../../types/traits/trait";
import { traits } from "./data/descriptions";

export function fixMissingTraitDescriptions(
  id: number,
  trait: GW2ApiTrait | undefined
): GW2ApiTrait | undefined {
  if (!trait || trait.description) return trait;
  const description = traits[id];

  return {
    description,
    ...trait,
  };
}
