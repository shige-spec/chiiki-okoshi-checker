import { describe, expect, it } from "vitest";
import municipalities from "@/data/municipalities.json";
import matrixData from "@/data/matrix.json";
import zonesData from "@/data/disadvantaged-zones.json";
import { evaluateEligibility } from "@/lib/eligibility";
import type { Municipality } from "@/lib/types";

const muni = municipalities as Municipality[];

describe("evaluateEligibility", () => {
  it("秋田市寺内 → 小樽市は区域外のため対象（△→○）", () => {
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
    expect(result.fromZoneCheck?.isInDisadvantagedZone).toBe(false);
    expect(result.finalEligible).toBe(true);
    expect(result.symbol).toBe("○");
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
