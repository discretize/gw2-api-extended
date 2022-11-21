import fs from "fs";
import { missing_skills } from "../data/overrides/data/skills";
import { fixAscendedConsumable } from "../data/overrides/item_ascended_consumables";
import {
  fixFactsInSkill,
  fixFactsInTrait,
} from "../data/overrides/skill_facts";
import { fixSkillTypes } from "../data/overrides/skill_types";
import { fixMissingTraitDescriptions } from "../data/overrides/trait_missing_descriptions";
import { Override, WithId } from "../data/overrides/type";
import GW2ApiItem from "../types/items/item";
import GW2ApiSkill from "../types/skills/skill";
import GW2ApiSpecialization from "../types/specialization/specialization";
import GW2ApiTrait from "../types/traits/trait";

const DATA_DIR = "./data";

/**
 * This methods reads the input of tha paramter and writes it to a temporary position.
 * @param {string} file File path to read from
 */
async function prepare<T extends WithId>(
  type: "skills" | "items" | "traits" | "specializations",
  missingData: Record<number, Omit<T, "id" | "chat_link">> = {},
  overrides: Override<T>[] = []
) {
  const apiData = readJSONFile<T>(DATA_DIR + "/api/", type + ".json");

  const missingDataList = Object.keys(missingData).map((key: string) => ({
    ...missingData[parseInt(key, 10)],
    id: parseInt(key, 10),
    chat_link: make_chat_link(parseInt(key, 10)),
  }));

  const data = [...apiData, ...missingDataList] as T[];

  const appliedOverrides = data.map((data) => {
    let item = data;
    overrides.forEach((override) => {
      item = override(data.id, item) || item;
    });
    return item;
  });

  // write to api-extended folder
  fs.writeFileSync(
    `${DATA_DIR}/api-extended/${type}.json`,
    JSON.stringify(appliedOverrides)
  );
}

function readJSONFile<T>(path: string, file: string): T[] {
  const data = JSON.parse(
    fs.readFileSync(path + file, { encoding: "utf8", flag: "r" })
  );

  return data;
}

function make_chat_link(_id: number) {
  let id = _id;
  let l = String.fromCharCode(6);
  for (let i = 0; i < 3; i++) {
    const next_byte = id % 256;
    l += String.fromCharCode(next_byte);
    id = id >> 8;
  }
  l += String.fromCharCode(0);

  return `[&${btoa(l)}]`;
}

prepare<GW2ApiSkill>("skills", missing_skills, [
  fixFactsInSkill,
  fixSkillTypes,
]);
prepare<GW2ApiItem>("items", {}, [fixAscendedConsumable]);
prepare<GW2ApiTrait>("traits", {}, [
  fixFactsInTrait,
  fixMissingTraitDescriptions,
]);
prepare<GW2ApiSpecialization>("specializations", {}, []);
