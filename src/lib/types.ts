export type JudgmentSymbol = "○" | "△" | "▲" | "□" | "×";

export type Municipality = {
  id: string;
  name: string;
  pref: string;
  categoryId: number;
  categoryLabel: string;
  searchKey: string;
};

export type DisadvantagedZone = {
  municipality: string;
  zoneDescription: string | null;
  fullCity: boolean;
  keywords: string[];
};

export type SymbolMeta = {
  title: string;
  summary: string;
  nextStep: string;
  tone: "success" | "warning" | "danger";
};

export type EligibilityResult = {
  symbol: JudgmentSymbol;
  finalEligible: boolean | null;
  matrixSymbol: JudgmentSymbol;
  from: Municipality;
  to: Municipality;
  fromAreaInput?: string;
  toAreaInput?: string;
  fromZoneCheck?: ZoneCheckResult;
  toZoneCheck?: ZoneCheckResult;
  explanation: string[];
  warnings: string[];
};

export type ZoneCheckResult = {
  hasPartialZones: boolean;
  matchedZone: DisadvantagedZone | null;
  isInDisadvantagedZone: boolean | null;
  message: string;
  warning?: string;
  zones: DisadvantagedZone[];
};
