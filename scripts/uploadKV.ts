import fs from "fs";
import { exec, ExecException } from "child_process";
import GW2ApiSkill from "../types/skills/skill";
import { WithId } from "../data/overrides/type";
import GW2ApiItem from "../types/items/item";
import GW2ApiTrait from "../types/traits/trait";
import GW2ApiSpecialization from "../types/specialization/specialization";

const DATA_DIR = "./data";
const TMP = "./tmp";
const TTL = 604800;

/**
 * This methods reads the input of tha paramter and writes it to a temporary position.
 * Then it uploads the content of the temporay file to the KV store.
 * @param {string} file File path to read from
 */
function uploadKV<T extends WithId>(
  file: string,
  binding: string,
  isPreview = true
) {
  const apiExtendedData: T[] = readFile(DATA_DIR + "/api-extended/", file);

  const ready = apiExtendedData.map((d) => ({
    key: `${d.id}`,
    value: JSON.stringify(d),
    expiration_ttl: TTL,
  }));

  // write to tmp location
  const fd = fs.openSync(`${TMP}/${file}`, "w");
  fs.writeSync(fd, JSON.stringify(ready));
  fs.closeSync(fd);

  // execute wrangler command to upload the data to the KV store
  const cmd = `npx wrangler kv:bulk put ${TMP}/${file} --binding ${binding} --preview ${isPreview}`;
  console.log(cmd);
  //run(cmd);
}

function readFile(path: string, file: string) {
  const data = JSON.parse(
    fs.readFileSync(path + file, { encoding: "utf8", flag: "r" })
  );

  return data;
}

function run(cmd: string) {
  exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
    if (error) {
      console.log(`error: ${error}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

uploadKV<GW2ApiSkill>("skills.json", "discretize_skills", false);
uploadKV<GW2ApiItem>("items.json", "discretize_items", false);
uploadKV<GW2ApiTrait>("traits.json", "discretize_traits", false);
uploadKV<GW2ApiSpecialization>(
  "specializations.json",
  "discretize_specializations",
  false
);
