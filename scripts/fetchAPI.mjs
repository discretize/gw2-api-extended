import fs from "fs";

const CHUNK_SIZE = 200;
const RATE_LIMIT = 300;
const OUTPUT = "data/api/";
const ENDPOINTS = ["skills", "specializations", "traits", "items"];

async function fetchData(type) {
  const list = await (
    await fetch(`https://api.guildwars2.com/v2/${type}`)
  ).json();

  const chunked = [];
  for (let i = 0; i < list.length; i += CHUNK_SIZE) {
    const chunk = list.slice(i, i + CHUNK_SIZE);
    chunked.push(chunk);
  }

  const data = [];
  for (let i = 0; i < chunked.length; i++) {
    const chunk = chunked[i];
    const batchedData = await (
      await fetch(
        `https://api.guildwars2.com/v2/${type}?ids=${chunk.join(",")}`
      )
    ).json();

    data.push(...batchedData);
    console.log(`fetched ${batchedData.length} ${type}`);
    // sleep for 60 / 300 = 0.2 seconds to avoid rate limit, plus a little margin
    await new Promise((resolve) =>
      setTimeout(resolve, (60 / RATE_LIMIT) * 1000 + 15)
    );
  }
  const fd = fs.openSync(`${OUTPUT}${type}.json`, "w");
  fs.writeSync(fd, JSON.stringify(data));
  fs.closeSync(fd);
}

ENDPOINTS.forEach(fetchData);
