import GW2ApiConsumableDetails from "../../types/items/details/consumable";
import GW2ApiItem from "../../types/items/item";
import { food } from "./data/descriptions";
import { Override } from "./type";

const common_details: Partial<GW2ApiConsumableDetails> = {
  duration_ms: 3600000,
  apply_count: 1,
  name: "Nourishment",
  icon: "https://render.guildwars2.com/file/779D3F0ABE5B46C09CFC57374DA8CC3A495F291C/436367.png",
};

export const fixAscendedConsumable: Override<GW2ApiItem> =
  _fixAscendedConsumable;

function _fixAscendedConsumable(
  id: number,
  item: GW2ApiItem | undefined
): GW2ApiItem | undefined {
  if (!item) return item;
  if (
    item.type === "Consumable" &&
    item.rarity === "Ascended" &&
    item.details.type === "Food"
  ) {
    const description = food[id];

    return {
      ...item,
      details: {
        ...common_details,
        description,
        ...item.details,
      },
    };
  }

  return item;
}
