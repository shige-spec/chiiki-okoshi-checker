import type {
  DisadvantagedZone,
  EligibilityResult,
  JudgmentSymbol,
  Municipality,
  SymbolMeta,
  ZoneCheckResult,
} from "./types";

/** 一部条件不利地域（指定都市含む）の categoryId */
const PARTIAL_DISADVANTAGED_CATEGORY_IDS = new Set([6, 7, 9, 10]);

export const ZONE_LIST_MISSING_WARNING =
  "条件不利区域の指定は変わることがあるため、念のため転入自治体に確認をしてください。";

function isPartialDisadvantagedCategory(municipality: Municipality): boolean {
  return PARTIAL_DISADVANTAGED_CATEGORY_IDS.has(municipality.categoryId);
}

export function lookupMatrixSymbol(
  matrix: JudgmentSymbol[][],
  from: Municipality,
  to: Municipality,
): JudgmentSymbol {
  return matrix[to.categoryId - 1][from.categoryId - 1];
}

export function normalizeAreaInput(input: string): string {
  return input.trim().replace(/\s+/g, "");
}

function matchesZoneKeyword(areaInput: string, zone: DisadvantagedZone): boolean {
  if (!areaInput) return false;
  const normalized = normalizeAreaInput(areaInput);
  return zone.keywords.some((keyword) => {
    const k = keyword.replace(/\s+/g, "");
    return normalized.includes(k) || k.includes(normalized);
  });
}

export function checkZone(
  municipality: Municipality,
  areaInput: string | undefined,
  zonesByMunicipality: Record<string, DisadvantagedZone[]>,
): ZoneCheckResult {
  const zones = zonesByMunicipality[municipality.name] ?? [];
  const hasPartialZones = zones.some((z) => !z.fullCity && z.zoneDescription);

  if (zones.length === 0) {
    if (isPartialDisadvantagedCategory(municipality)) {
      return {
        hasPartialZones: false,
        matchedZone: null,
        isInDisadvantagedZone: false,
        message: areaInput?.trim()
          ? "入力された区域は条件不利区域外と判断されます（条件不利区域リストに該当する区域がありません）。"
          : "条件不利区域リストに該当する区域がないため、条件不利区域外と判断されます。",
        warning: ZONE_LIST_MISSING_WARNING,
        zones: [],
      };
    }

    return {
      hasPartialZones: false,
      matchedZone: null,
      isInDisadvantagedZone: null,
      message: "条件不利区域リストに該当データがありません。自治体への確認をおすすめします。",
      zones: [],
    };
  }

  if (zones.every((z) => z.fullCity)) {
    return {
      hasPartialZones: false,
      matchedZone: zones[0] ?? null,
      isInDisadvantagedZone: true,
      message: "市町村全域が条件不利区域に該当します。",
      zones,
    };
  }

  if (!areaInput?.trim()) {
    const zoneList = zones
      .filter((z) => z.zoneDescription)
      .map((z) => z.zoneDescription)
      .join("、");
    return {
      hasPartialZones: true,
      matchedZone: null,
      isInDisadvantagedZone: null,
      message: `区域の入力が必要です。条件不利区域の例: ${zoneList}`,
      zones,
    };
  }

  const matchedZone =
    zones.find((z) => !z.fullCity && matchesZoneKeyword(areaInput, z)) ?? null;

  if (matchedZone) {
    return {
      hasPartialZones: true,
      matchedZone,
      isInDisadvantagedZone: true,
      message: `入力された区域は条件不利区域（${matchedZone.zoneDescription}）に該当します。`,
      zones,
    };
  }

  // 旧町村名と現在の住所表記の対応は一覧から判定できないため、
  // 不一致でも「区域外」とは断定せず自治体への確認を促す。
  const zoneList = zones
    .filter((z) => z.zoneDescription)
    .map((z) => z.zoneDescription)
    .join("、");
  return {
    hasPartialZones: true,
    matchedZone: null,
    isInDisadvantagedZone: null,
    message: `総務省の「過疎地域市町村等一覧」では、${municipality.pref}${municipality.name}の「${zoneList}」が過疎地域として指定されています。入力された地域「${normalizeAreaInput(areaInput)}」がその区域に該当するかを自治体に確認してください。`,
    zones,
  };
}

export function evaluateEligibility(params: {
  from: Municipality;
  to: Municipality;
  matrix: JudgmentSymbol[][];
  symbolMeta: Record<JudgmentSymbol, SymbolMeta>;
  zonesByMunicipality: Record<string, DisadvantagedZone[]>;
  fromAreaInput?: string;
  toAreaInput?: string;
}): EligibilityResult {
  const { from, to, matrix, zonesByMunicipality, fromAreaInput, toAreaInput } =
    params;
  const matrixSymbol = lookupMatrixSymbol(matrix, from, to);
  const explanation: string[] = [
    `転出地: ${from.pref} ${from.name}（${from.categoryLabel}）`,
    `転入地: ${to.pref} ${to.name}（${to.categoryLabel}）`,
    `マトリクス判定: ${matrixSymbol}`,
  ];

  let symbol = matrixSymbol;
  let finalEligible: boolean | null = null;
  let fromZoneCheck: ZoneCheckResult | undefined;
  let toZoneCheck: ZoneCheckResult | undefined;

  if (matrixSymbol === "○") {
    finalEligible = true;
    explanation.push("区分の組み合わせにより、原則として特別交付税措置の対象です。");
  } else if (matrixSymbol === "×") {
    finalEligible = false;
    explanation.push("区分の組み合わせにより、原則として対象外です。");
  } else if (matrixSymbol === "△") {
    fromZoneCheck = checkZone(from, fromAreaInput, zonesByMunicipality);
    explanation.push(fromZoneCheck.message);
    if (fromZoneCheck.isInDisadvantagedZone === false) {
      finalEligible = true;
      symbol = "○";
      explanation.push(
        "転出地が条件不利区域外のため、特別交付税措置の対象（目安）と判断できます。",
      );
    } else if (fromZoneCheck.isInDisadvantagedZone === true) {
      finalEligible = false;
      explanation.push("転出地が条件不利区域内のため、△の条件を満たしません。");
    }
  } else if (matrixSymbol === "▲") {
    toZoneCheck = checkZone(to, toAreaInput, zonesByMunicipality);
    explanation.push(toZoneCheck.message);
    if (toZoneCheck.isInDisadvantagedZone === true) {
      finalEligible = true;
      symbol = "○";
      explanation.push(
        "転入地が条件不利区域内のため、特別交付税措置の対象（目安）と判断できます。",
      );
    } else if (toZoneCheck.isInDisadvantagedZone === false) {
      finalEligible = false;
      explanation.push("転入地が条件不利区域外のため、▲の条件を満たしません。");
    }
  } else if (matrixSymbol === "□") {
    fromZoneCheck = checkZone(from, fromAreaInput, zonesByMunicipality);
    toZoneCheck = checkZone(to, toAreaInput, zonesByMunicipality);
    explanation.push(`【転出地】${fromZoneCheck.message}`);
    explanation.push(`【転入地】${toZoneCheck.message}`);

    if (
      fromZoneCheck.isInDisadvantagedZone === false &&
      toZoneCheck.isInDisadvantagedZone === true
    ) {
      finalEligible = true;
      symbol = "○";
      explanation.push(
        "転出地が条件不利区域外かつ転入地が条件不利区域内のため、対象（目安）と判断できます。",
      );
    } else if (
      fromZoneCheck.isInDisadvantagedZone !== null &&
      toZoneCheck.isInDisadvantagedZone !== null
    ) {
      finalEligible = false;
      explanation.push("□の条件（転出地=区域外 かつ 転入地=区域内）を満たしません。");
    }
  }

  const warnings = [fromZoneCheck?.warning, toZoneCheck?.warning].filter(
    (warning): warning is string => Boolean(warning),
  );
  for (const warning of warnings) {
    explanation.push(`※ ${warning}`);
  }

  return {
    symbol,
    finalEligible,
    matrixSymbol,
    from,
    to,
    fromAreaInput,
    toAreaInput,
    fromZoneCheck,
    toZoneCheck,
    explanation,
    warnings,
  };
}

export function searchMunicipalities(
  municipalities: Municipality[],
  query: string,
  limit = 20,
): Municipality[] {
  const q = query.trim().replace(/\s+/g, "");
  if (!q) return municipalities.slice(0, limit);

  return municipalities
    .filter((m) => m.searchKey.includes(q) || m.name.startsWith(q) || m.pref.includes(q))
    .slice(0, limit);
}
