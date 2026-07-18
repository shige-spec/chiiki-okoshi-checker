import { describe, expect, it } from "vitest";
import municipalities from "@/data/municipalities.json";
import matrixData from "@/data/matrix.json";
import zonesData from "@/data/disadvantaged-zones.json";
import { evaluateEligibility } from "@/lib/eligibility";
import type { Municipality } from "@/lib/types";

const muni = municipalities as Municipality[];

describe("evaluateEligibility", () => {
  it("秋田市寺内 → 小樽市は区域の該当が判定できないため△のまま（要自治体確認）", () => {
    const from = muni.find((m) => m.name === "秋田市" && m.pref === "秋田県")!;
    const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

    const result = evaluateEligibility({
      from,
      to,
      matrix: matrixData.matrix,
      symbolMeta: matrixData.symbolMeta,
      zonesByMunicipality: zonesData,
      fromAreaInput: "秋田市寺内",
    });

    expect(result.matrixSymbol).toBe("△");
    expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(null);
    expect(result.finalEligible).toBe(null);
    expect(result.symbol).toBe("△");
    expect(result.fromZoneCheck?.message).toContain("自治体に確認してください");
  });

  it("石巻市（区域が特定できない入力）→ 小樽市は△のまま自治体確認を促す", () => {
    const from = muni.find((m) => m.name === "石巻市" && m.pref === "宮城県")!;
    const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

    const result = evaluateEligibility({
      from,
      to,
      matrix: matrixData.matrix,
      symbolMeta: matrixData.symbolMeta,
      zonesByMunicipality: zonesData,
      fromAreaInput: "石巻市",
    });

    expect(result.matrixSymbol).toBe("△");
    expect(result.symbol).toBe("△");
    expect(result.finalEligible).toBe(null);
    expect(result.fromZoneCheck?.message).toContain(
      "宮城県石巻市の「旧河北町、旧雄勝町、旧北上町、旧牡鹿町の区域」が過疎地域として指定されています",
    );
  });

  it("石巻市（旧河北町を入力）→ 小樽市は区域内のため対象外", () => {
    const from = muni.find((m) => m.name === "石巻市" && m.pref === "宮城県")!;
    const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

    const result = evaluateEligibility({
      from,
      to,
      matrix: matrixData.matrix,
      symbolMeta: matrixData.symbolMeta,
      zonesByMunicipality: zonesData,
      fromAreaInput: "旧河北町、旧雄勝町、旧北上町、旧牡鹿町の区域",
    });

    expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(true);
    expect(result.finalEligible).toBe(false);
  });

  it("坂出市西大浜 → 小樽市は区域データなしのため区域外扱い（△→○）", () => {
    const from = muni.find((m) => m.name === "坂出市" && m.pref === "香川県")!;
    const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

    const result = evaluateEligibility({
      from,
      to,
      matrix: matrixData.matrix,
      symbolMeta: matrixData.symbolMeta,
      zonesByMunicipality: zonesData,
      fromAreaInput: "西大浜",
    });

    expect(result.matrixSymbol).toBe("△");
    expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(false);
    expect(result.finalEligible).toBe(true);
    expect(result.symbol).toBe("○");
    expect(result.warnings).toContain(
      "条件不利区域の指定は変わることがあるため、念のため転入自治体に確認をしてください。",
    );
  });

  it("札幌市 → 小樽市は×", () => {
    const from = muni.find((m) => m.name === "札幌市" && m.pref === "北海道")!;
    const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

    const result = evaluateEligibility({
      from,
      to,
      matrix: matrixData.matrix,
      symbolMeta: matrixData.symbolMeta,
      zonesByMunicipality: zonesData,
    });

    expect(result.symbol).toBe("×");
    expect(result.finalEligible).toBe(false);
  });
});
