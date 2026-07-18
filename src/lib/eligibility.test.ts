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

  it("石巻市（旧河北町を入力）→ 小樽市も断定せず△のまま自治体確認を促す", () => {
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

    expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(null);
    expect(result.symbol).toBe("△");
    expect(result.finalEligible).toBe(null);
    expect(result.fromZoneCheck?.message).toContain("自治体に確認してください");
  });

  it.each(["香川県 綾川町", "綾川町", "旧綾川町", "旧綾上町", "綾上町"])(
    "綾川町（入力: %s）→ 小樽市は常に△のまま自治体確認を促す",
    (fromAreaInput) => {
      const from = muni.find((m) => m.name === "綾川町" && m.pref === "香川県")!;
      const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

      const result = evaluateEligibility({
        from,
        to,
        matrix: matrixData.matrix,
        symbolMeta: matrixData.symbolMeta,
        zonesByMunicipality: zonesData,
        fromAreaInput,
      });

      expect(result.symbol).toBe("△");
      expect(result.finalEligible).toBe(null);
      expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(null);
      expect(result.fromZoneCheck?.message).toContain(
        "香川県綾川町の「旧綾上町の区域」が過疎地域として指定されています",
      );
      expect(result.fromZoneCheck?.message).toContain("自治体に確認してください");
    },
  );

  it("坂出市西大浜 → 小樽市は区域データなしでも△のまま自治体確認を促す", () => {
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
    expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(null);
    expect(result.finalEligible).toBe(null);
    expect(result.symbol).toBe("△");
    expect(result.fromZoneCheck?.message).toContain(
      "香川県坂出市の区域指定の記載がありませんが",
    );
    expect(result.fromZoneCheck?.message).toContain("自治体に確認してください");
  });

  it("札幌市（3大都市圏外 指定都市）→ 小樽市は○", () => {
    const from = muni.find((m) => m.name === "札幌市" && m.pref === "北海道")!;
    const to = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;

    const result = evaluateEligibility({
      from,
      to,
      matrix: matrixData.matrix,
      symbolMeta: matrixData.symbolMeta,
      zonesByMunicipality: zonesData,
    });

    expect(result.symbol).toBe("○");
    expect(result.finalEligible).toBe(true);
  });

  it("小樽市（全部条件不利地域）→ 札幌市（都市地域）は×", () => {
    const from = muni.find((m) => m.name === "小樽市" && m.pref === "北海道")!;
    const to = muni.find((m) => m.name === "札幌市" && m.pref === "北海道")!;

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
