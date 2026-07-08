"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ChevronRight,
  FileSearch,
} from "lucide-react";
import type { EligibilityResult, JudgmentSymbol, Municipality, SymbolMeta } from "@/lib/types";
import { MunicipalityCombobox } from "@/components/municipality-combobox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import municipalitiesData from "@/data/municipalities.json";
import matrixData from "@/data/matrix.json";
import zonesData from "@/data/disadvantaged-zones.json";
import { evaluateEligibility } from "@/lib/eligibility";
import { JudgmentSymbolIcon } from "@/components/judgment-symbol-icon";

const municipalities = municipalitiesData as Municipality[];
const matrix = matrixData.matrix as JudgmentSymbol[][];
const symbolMeta = matrixData.symbolMeta as Record<JudgmentSymbol, SymbolMeta>;
const zonesByMunicipality = zonesData as Record<string, import("@/lib/types").DisadvantagedZone[]>;

const SYMBOL_STYLES: Record<
  JudgmentSymbol,
  { badge: string; ring: string; icon: typeof CheckCircle2; bg: string }
> = {
  "○": {
    badge: "bg-emerald-500 text-white",
    ring: "ring-emerald-200",
    bg: "from-emerald-50 to-white",
    icon: CheckCircle2,
  },
  "△": {
    badge: "bg-amber-400 text-white",
    ring: "ring-amber-200",
    bg: "from-amber-50 to-white",
    icon: AlertTriangle,
  },
  "▲": {
    badge: "bg-orange-400 text-white",
    ring: "ring-orange-200",
    bg: "from-orange-50 to-white",
    icon: AlertTriangle,
  },
  "□": {
    badge: "bg-slate-500 text-white",
    ring: "ring-slate-200",
    bg: "from-slate-50 to-white",
    icon: AlertTriangle,
  },
  "×": {
    badge: "bg-red-500 text-white",
    ring: "ring-red-200",
    bg: "from-red-50 to-white",
    icon: XCircle,
  },
};

function ProgressBar({ step }: { step: number }) {
  const pct = (step / 3) * 100;

  return (
    <div className="space-y-2.5">
      <p className="text-sm font-bold text-brand-dark">Step {step} / 3</p>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function CrossSymbolNextSteps() {
  return (
    <div className="mt-2 space-y-3 leading-relaxed">
      <ul className="list-disc space-y-2 pl-5">
        <li>別の転入先の検討や、住民票の状況を再確認してください。</li>
        <li>
          以下の特例の対象にならないか、確認してください。
          <ol className="mt-2 list-none space-y-2.5 pl-1">
            <li>
              1.
              地域おこし協力隊員であった者（同一地域における活動2年以上、かつ解嘱1年以内）が他の地域（3大都市圏外の全ての市町村及び3大都市圏内の条件不利地域）の隊員となる場合。
            </li>
            <li>
              2.
              海外に在留し市町村が備える住民基本台帳に登録されていない者で、3大都市圏外の全ての市町村及び3大都市圏内の条件不利地域に生活の拠点を移し、住民票を異動させた者。
            </li>
            <li>
              3.
              語学指導等を行う外国青年招致事業（以下「JETプログラム」という。）を終了した者（プログラム参加者としての活動2年以上、かつプログラムを終了した日から1年以内）については、同様の特例に加え、住民票を異動せず、JETプログラムにおける活動地域と同一地域（ただし、3大都市圏外の全ての市町村及び3大都市圏内の条件不利地域に限る。）で地域おこし協力隊になることができる。
            </li>
            <li>
              4.
              「3大都市圏内の都市地域」に区分される市町村のうち、平成17年から平成27年の人口減少率が11パーセント以上である市町村。
            </li>
          </ol>
        </li>
      </ul>
      <p className="text-xs text-muted-foreground">
        （参考：
        <a
          href="https://www.soumu.go.jp/chiikiokoshitai/faq/index.html"
          className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.soumu.go.jp/chiikiokoshitai/faq/index.html
        </a>
        　→A1）
      </p>
    </div>
  );
}

function ResultPanel({ result }: { result: EligibilityResult }) {
  const style = SYMBOL_STYLES[result.symbol];
  const Icon = style.icon;
  const meta = symbolMeta[result.matrixSymbol];

  return (
    <div className={`diagnostic-card overflow-hidden bg-gradient-to-b ${style.bg}`}>
      <div className="border-b border-brand-muted/40 bg-white/70 px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="step-badge w-fit">
              <Sparkles className="size-3.5" />
              判定結果
            </div>
            <p className="text-lg font-bold text-brand-dark">
              {result.from.pref} {result.from.name}
              <ArrowRight className="mx-2 inline size-5 text-brand" />
              {result.to.pref} {result.to.name}
            </p>
          </div>
          <JudgmentSymbolIcon symbol={result.symbol} size={96} />
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="rounded-xl bg-white/80 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${style.badge}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <p className="font-bold text-brand-dark">{meta.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{meta.summary}</p>
            </div>
          </div>
        </div>

        {result.finalEligible !== null && (
          <div
            className={`rounded-xl border-2 px-5 py-4 text-center text-sm font-bold ${
              result.finalEligible
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {result.finalEligible
              ? "区域確認後の最終判断（目安）: 特別交付税措置の対象"
              : "区域確認後の最終判断（目安）: 条件を満たさない"}
          </div>
        )}

        {result.matrixSymbol !== result.symbol && (
          <p className="text-center text-xs text-muted-foreground">
            マトリクス判定 <strong>{result.matrixSymbol}</strong> → 区域確認後{" "}
            <strong>{result.symbol}</strong>
          </p>
        )}

        {result.warnings.length > 0 && (
          <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-5 py-4">
            <p className="flex items-start gap-2 text-sm font-bold text-amber-900">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              ご確認ください
            </p>
            <ul className="mt-2 space-y-1.5 pl-6">
              {result.warnings.map((warning) => (
                <li key={warning} className="list-disc text-sm leading-relaxed text-amber-900">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-brand-light/50 p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <FileSearch className="size-4" />
            判定の根拠
          </p>
          <ul className="space-y-2">
            {result.explanation.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-relaxed">
                <ChevronRight className="mt-0.5 size-4 shrink-0 text-brand" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-white/80 px-4 py-3 text-sm text-muted-foreground shadow-sm">
          <strong className="text-brand-dark">次にやること：</strong>
          {result.symbol === "×" ? <CrossSymbolNextSteps /> : meta.nextStep}
        </div>
      </div>
    </div>
  );
}

export function EligibilityChecker() {
  const [from, setFrom] = useState<Municipality | null>(null);
  const [to, setTo] = useState<Municipality | null>(null);
  const [fromArea, setFromArea] = useState("");
  const [toArea, setToArea] = useState("");
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const currentStep = result ? 3 : !from ? 1 : !to ? 2 : 3;

  const handleCheck = () => {
    if (!from || !to) return;
    setResult(
      evaluateEligibility({
        from,
        to,
        matrix,
        symbolMeta,
        zonesByMunicipality,
        fromAreaInput: fromArea,
        toAreaInput: toArea,
      }),
    );
  };

  const previewNeedsFromArea = useMemo(() => {
    if (!from || !to) return false;
    const sym = matrix[to.categoryId - 1][from.categoryId - 1];
    return sym === "△" || sym === "□";
  }, [from, to]);

  const previewNeedsToArea = useMemo(() => {
    if (!from || !to) return false;
    const sym = matrix[to.categoryId - 1][from.categoryId - 1];
    return sym === "▲" || sym === "□";
  }, [from, to]);

  return (
    <div className="space-y-6">
      <div className="main-form-card">
        <div className="space-y-4 border-b border-brand-muted/25 bg-white px-6 py-6 md:px-8">
          <ProgressBar step={currentStep} />
          <div>
            <h2 className="text-xl font-bold text-brand-dark md:text-2xl">転出地・転入地を選ぶ</h2>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <div className="grid gap-5 md:grid-cols-2 md:items-end">
            <MunicipalityCombobox
              label="転出地"
              placeholder="選択してください"
              value={from}
              onChange={(m) => {
                setFrom(m);
                setResult(null);
              }}
              municipalities={municipalities}
              accent="from"
            />
            <MunicipalityCombobox
              label="転入地"
              placeholder="選択してください"
              value={to}
              onChange={(m) => {
                setTo(m);
                setResult(null);
              }}
              municipalities={municipalities}
              accent="to"
            />
          </div>

          {from && to && !result && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl bg-brand-light/40 px-4 py-3">
              <Badge className="border-accent-blue/30 bg-white text-brand-dark hover:bg-white">
                {from.categoryLabel}
              </Badge>
              <ArrowRight className="size-4 text-brand" />
              <Badge className="border-brand-muted bg-white text-brand-dark hover:bg-white">
                {to.categoryLabel}
              </Badge>
            </div>
          )}

          {(previewNeedsFromArea || previewNeedsToArea) && from && to && (
            <div className="space-y-4 rounded-2xl border-2 border-dashed border-amber-300/80 bg-gradient-to-br from-amber-50/80 to-orange-50/40 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <AlertTriangle className="size-4" />
                区域確認が必要です（△/▲/□判定）
              </p>
              {previewNeedsFromArea && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark">転出地の町名・区域</label>
                  <Input
                    className="h-12 rounded-xl border-amber-200 bg-white text-base focus-visible:ring-amber-300"
                    placeholder="例: ◯◯市◯◯"
                    value={fromArea}
                    onChange={(e) => setFromArea(e.target.value)}
                  />
                </div>
              )}
              {previewNeedsToArea && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark">転入地の町名・区域</label>
                  <Input
                    className="h-12 rounded-xl border-amber-200 bg-white text-base focus-visible:ring-amber-300"
                    placeholder="例: 旧○○町の区域"
                    value={toArea}
                    onChange={(e) => setToArea(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              type="button"
              className="btn-primary w-full max-w-md px-12"
              disabled={!from || !to}
              onClick={handleCheck}
            >
              判定する
              <ChevronRight className="size-5 shrink-0" />
            </button>
            <p className="text-xs text-muted-foreground">使い方はかんたん 3ステップ</p>
          </div>
        </div>
      </div>

      {result && <ResultPanel result={result} />}
    </div>
  );
}

export function SymbolLegend() {
  return (
    <section>
      <div className="diagnostic-card overflow-hidden">
        <div className="border-b border-brand-muted/25 bg-brand-light/15 px-6 py-4">
          <h2 className="mb-3 text-center text-sm font-bold text-brand-dark md:text-base">
            判定結果の見方（5段階）と対応方法
          </h2>
          <p className="text-center text-sm text-muted-foreground">
            出た記号ごとに、次にやるべきことは以下の通りです。
          </p>
        </div>
        <div className="divide-y divide-brand-muted/25">
          {(Object.keys(symbolMeta) as JudgmentSymbol[]).map((sym) => (
              <div
                key={sym}
                className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-brand-light/10"
              >
                <JudgmentSymbolIcon symbol={sym} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-brand-dark">{symbolMeta[sym].title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{symbolMeta[sym].nextStep}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
