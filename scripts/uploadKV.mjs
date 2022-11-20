import fs from "fs";
import { exec } from "node:child_process";

const TMP = "./tmp";
const TTL = 604800;

/**
 * This methods reads the input of tha paramter and writes it to a temporary position.
 * Then it uploads the content of the temporay file to the KV store.
 * @param {string} file File path to read from
 */
function uploadKV(path, file, binding, isPreview = true) {
  const data = JSON.parse(
    fs.readFileSync(path + file, { encoding: "utf8", flag: "r" })
  );

  const ready = data.map((d) => ({
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
  run(cmd);
}

function run(cmd) {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

uploadKV("./api/", "skills.json", "discretize_skills", false);
