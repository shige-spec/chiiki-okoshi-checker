import type { ReactNode } from "react";
import { EligibilityChecker, SymbolLegend } from "@/components/eligibility-checker";
import { BannerSlot } from "@/components/banner-slot";
import { MountainBackground } from "@/components/mountain-bg";
import { Clock, MapPin, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <MountainBackground />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-10">
        {/* 右カラム=縦バナー幅(160px)。本体のすぐ隣(gap 16px)に配置し隙間を狭く。
            スクエア(300px)は右端を揃えたまま左へ食い込む */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_160px] xl:gap-x-4">
          {/* 左カラム: ヒーロー + フォームを1列にまとめ、縦の隙間を明示制御 */}
          <div className="min-w-0 xl:col-start-1">
          {/* ヒーロー（①: バナーより 18px 下げる） */}
          <header className="space-y-5 text-center xl:pt-[18px] xl:text-left">
            <span className="step-badge mx-auto xl:mx-0">
              <Clock className="size-3.5" />
              30秒で判定
            </span>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-brand-dark md:text-[2.5rem] md:leading-tight">
              地域おこし協力隊
              <br />
              <span className="text-brand">地域要件</span> 判定ツール
            </h1>

            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground xl:mx-0">
              転出地と転入地を選ぶだけで、特別交付税措置の対象かどうかを
              <strong className="font-semibold text-foreground"> ○△▲□× </strong>
              の5段階で判定。△判定時の条件不利区域チェックにも対応しています。
            </p>

            <div className="flex flex-wrap justify-center gap-3 xl:justify-start">
              <StatBox
                iconBg="bg-brand-light"
                icon={<MapPin className="size-5 text-brand" />}
                value="1,741"
                label="自治体"
              />
              <StatBox
                iconBg="bg-accent-blue-light"
                icon={<ShieldCheck className="size-5 text-accent-blue" />}
                value="5段階"
                label="判定"
              />
              <StatBox
                iconBg="bg-brand-light"
                icon={<Clock className="size-5 text-brand" />}
                value="約30秒"
                label="で完了"
              />
            </div>
          </header>

          {/* モバイル: スクエアバナー */}
          <div className="flex justify-center py-6 xl:hidden">
            <BannerSlot bannerKey="square" className="shrink-0" />
          </div>

          {/* メインコンテンツ（stats→フォームの隙間を subtext→stats と同じ 20px に） */}
          <div className="space-y-8 pb-6 xl:mt-5">
            <EligibilityChecker />
            <SymbolLegend />

            <div className="diagnostic-card flex gap-4 p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-light">
                <ShieldCheck className="size-5 text-brand-dark" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                本ツールは、総務省が発表している
                <a
                  href="https://www.soumu.go.jp/chiikiokoshitai/pdf/000847999.pdf"
                  className="mx-1 font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  令和4年4月1日現在の「地域おこし協力隊及び地域プロジェクトマネージャーの特別交付税措置に係る地域要件確認表」
                </a>
                および
                <a
                  href="https://www.soumu.go.jp/main_content/000063379.pdf"
                  className="mx-1 font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  平成22年4月1日現在の「過疎地域市町村等一覧」
                </a>
                に基づいた
                <strong className="text-foreground">目安判定チェックツール</strong>
                です。判定結果については必ずしも正確さを保証されているものではないので、どの結果が表示された場合においても、
                <strong className="font-bold text-red-600">最終判断は受入自治体に必ずご確認ください</strong>
                。
              </p>
            </div>

            <div className="flex justify-center overflow-x-auto">
              <BannerSlot bannerKey="leaderboard" />
            </div>

            <div className="flex flex-row flex-wrap items-start justify-center gap-3 sm:gap-4 xl:hidden">
              <BannerSlot bannerKey="skyscraper" />
              <BannerSlot bannerKey="skyscraper2" />
            </div>
          </div>
          </div>

          {/* 右カラム: 右端揃え、スクエアは幅300pxのまま左へはみ出す（食い込みOK） */}
          <aside className="banner-rail hidden xl:col-start-2 xl:flex xl:flex-col xl:items-end xl:gap-6">
            <div className="w-[300px] max-w-none shrink-0">
              <BannerSlot bannerKey="square" />
            </div>
            <div className="sticky top-8 flex flex-col items-end gap-4">
              <BannerSlot bannerKey="skyscraper" />
              <BannerSlot bannerKey="skyscraper2" />
            </div>
          </aside>
        </div>
      </div>

      <footer className="relative z-10 border-t border-[#e8ecef] bg-[#f5f7f9] py-5">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            ©︎ Since 2026{" "}
            <a
              href="https://www.besidz.jp/"
              className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              besidz Inc.
            </a>
            All Rights Reserved
          </p>
          <a
            href="https://www.besidz.jp/term/"
            className="text-xs font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:text-brand-dark"
            target="_blank"
            rel="noopener noreferrer"
          >
            利用規約
          </a>
        </div>
      </footer>
    </div>
  );
}

function StatBox({
  iconBg,
  icon,
  value,
  label,
}: {
  iconBg: string;
  icon: ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="stat-icon-pill">
      <span className={`stat-icon-circle ${iconBg}`}>{icon}</span>
      <div className="text-left leading-tight">
        <div className="text-sm font-black text-brand-dark">{value}</div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
