import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const LABEL_TO_ID = {
  "３大都市圏内 都市地域": 1,
  "３大都市圏内 都市地域 指定都市": 2,
  "３大都市圏外 都市地域": 3,
  "３大都市圏外 都市地域 指定都市": 4,
  "３大都市圏内 全部条件不利地域": 5,
  "３大都市圏内 一部条件不利地域": 6,
  "３大都市圏内 一部条件不利地域 指定都市": 7,
  "３大都市圏外 全部条件不利地域": 8,
  "３大都市圏外 一部条件不利地域": 9,
  "３大都市圏外 一部条件不利地域 指定都市": 10,
};

/** [転入 categoryId-1][転出 categoryId-1] — 総務省 000847999.pdf 令和4年4月1日 */
const MATRIX = [
  ["×", "×", "×", "×", "×", "×", "×", "×", "×", "×"],
  ["×", "×", "×", "×", "×", "×", "×", "×", "×", "×"],
  ["○", "○", "×", "○", "×", "△", "△", "×", "×", "△"],
  ["○", "○", "×", "○", "×", "△", "△", "×", "×", "△"],
  ["○", "○", "○", "○", "×", "△", "△", "×", "△", "△"],
  ["○", "○", "▲", "○", "×", "△", "△", "×", "□", "△"],
  ["○", "○", "▲", "○", "×", "△", "△", "×", "□", "△"],
  ["○", "○", "○", "○", "×", "△", "△", "×", "△", "△"],
  ["○", "○", "▲", "○", "×", "△", "△", "×", "□", "△"],
  ["○", "○", "▲", "○", "×", "△", "△", "×", "□", "△"],
];

const CATEGORY_LABELS = Object.fromEntries(
  Object.entries(LABEL_TO_ID).map(([label, id]) => [id, label]),
);

const SYMBOL_META = {
  "○": {
    title: "特別交付税措置の対象",
    summary: "転出地×転入地の区分組み合わせが明確に適合します。",
    nextStep: "最終確認のみ受入自治体へお問い合わせください。",
    tone: "success",
  },
  "△": {
    title: "条件付きで対象になり得る",
    summary:
      "原則として、隊員等の転出地が条件不利区域以外の区域であった場合に限り、特別交付税措置の対象となります。",
    nextStep: "転出地の区域（旧町村単位）が条件不利区域かどうかを確認してください。",
    tone: "warning",
  },
  "▲": {
    title: "条件付きで対象になり得る",
    summary:
      "原則として、隊員等の転入地が条件不利区域内である場合に限り、特別交付税措置の対象となります。",
    nextStep: "転入地の区域が条件不利区域かどうかを確認してください。",
    tone: "warning",
  },
  "□": {
    title: "条件付きで対象（双方の確認が必要）",
    summary:
      "転出地が条件不利区域外かつ転入地が条件不利区域内である場合に限り、特別交付税措置の対象となります。",
    nextStep: "転出・転入の双方で区域単位を確認してください。",
    tone: "warning",
  },
  "×": {
    title: "特別交付税措置の対象外",
    summary: "区分マトリクス上、原則として地域要件を満たしません。",
    nextStep: "別の転入先や住民票の状況を再検討してください。",
    tone: "danger",
  },
};

async function fetchMunicipalities() {
  const res = await fetch(
    "https://locasumo.com/wp-json/wp/v2/pages?slug=chiiki-youken-category-list",
  );
  const data = await res.json();
  const html = data[0].content.rendered;
  const rows = [...html.matchAll(/data-key="([^"]+)"\s+data-cat="([^"]+)"/g)];

  return rows.map(([, key, cat]) => {
    const name = key.slice(0, key.lastIndexOf(" "));
    const pref = key.slice(key.lastIndexOf(" ") + 1);
    const categoryLabel = cat.trim();
    const categoryId = LABEL_TO_ID[categoryLabel];
    if (!categoryId) throw new Error(`Unknown category: ${categoryLabel}`);
    return {
      id: `${pref}-${name}`,
      name,
      pref,
      categoryId,
      categoryLabel,
      searchKey: `${pref}${name}${categoryLabel}`.replace(/\s/g, ""),
    };
  });
}

function parseZonePdfText(text) {
  const zones = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    // 対応形式:
    //   "高松市 旧塩江町の区域 ○" / "東かがわ市 ○"
    //   "小豆郡 土庄町 ○"（郡名は自治体名に含めない）
    //   "綾歌郡 綾川町のうち旧綾上町の区域 ○"（「のうち」区切りでスペースなし）
    const m = trimmed.match(
      /^(?:(\S+郡)\s+)?(\S+?[市区町村])(?:の区域)?(?:のうち(\S+?))?(?:\s+(\S.*?))?\s*○\s*$/,
    );
    if (!m) continue;
    const municipality = m[2];
    const zoneDescription = (m[3] || m[4] || "").trim();
    if (municipality.length > 20 || municipality.includes("都道府県")) continue;

    const keywords = [];
    if (zoneDescription) {
      keywords.push(zoneDescription);
      const oldTown = zoneDescription.match(/旧(.+?)の区域/);
      if (oldTown) keywords.push(oldTown[1]);
    }

    zones.push({
      municipality,
      zoneDescription: zoneDescription || null,
      fullCity: !zoneDescription,
      keywords,
    });
  }

  const byMunicipality = new Map();
  for (const z of zones) {
    const list = byMunicipality.get(z.municipality) ?? [];
    list.push(z);
    byMunicipality.set(z.municipality, list);
  }
  return Object.fromEntries(byMunicipality);
}

function writeZones(outDir) {
  const zoneCache = path.join(__dirname, "disadvantaged-zones.raw.txt");
  if (!fs.existsSync(zoneCache)) return;
  const zones = parseZonePdfText(fs.readFileSync(zoneCache, "utf8"));
  fs.writeFileSync(
    path.join(outDir, "disadvantaged-zones.json"),
    JSON.stringify(zones, null, 0),
  );
  console.log(`zones: ${Object.keys(zones).length} municipalities`);
}

async function main() {
  const outDir = path.join(root, "src", "data");
  fs.mkdirSync(outDir, { recursive: true });

  // 区域データのみの再生成（ネットワーク不要）: node scripts/generate-data.mjs --zones-only
  if (process.argv.includes("--zones-only")) {
    writeZones(outDir);
    return;
  }

  const municipalities = await fetchMunicipalities();

  fs.writeFileSync(
    path.join(outDir, "municipalities.json"),
    JSON.stringify(municipalities, null, 0),
  );
  fs.writeFileSync(
    path.join(outDir, "matrix.json"),
    JSON.stringify({ matrix: MATRIX, categoryLabels: CATEGORY_LABELS, symbolMeta: SYMBOL_META }, null, 2),
  );

  writeZones(outDir);

  console.log(`municipalities: ${municipalities.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
