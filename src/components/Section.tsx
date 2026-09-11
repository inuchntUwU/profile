import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import type { SectionDef } from "@/data/sections";

/**
 * セクション 1 つ分のカード。About / Projects / Links はすべてこれで包んでいる。
 * ここの見た目を変えると、全セクションにまとめて反映される。
 */
type SectionProps = {
  section: SectionDef;
  children: ReactNode;
};

export function Section({ section, children }: SectionProps) {
  return (
    <Reveal>
      <section
        id={section.id}
        // scroll-mt-20 … ナビで飛んだとき、固定ヘッダー（80px）の下で止まるようにする
        // rounded-2xl … 角を丸く / border … 細い枠線 / bg-card … 背景より少し明るい色
        // p-6 sm:p-8 … 内側の余白。sm: は「画面幅 640px 以上のとき」の意味で、PC では広めに取る
        // shadow-brand … 差し色を暗くした影を右下に落とす（globals.css で定義）
        className="scroll-mt-20 rounded-2xl border border-border bg-card p-6 shadow-brand sm:p-8"
      >
        {/* 見出し。左に差し色の短い線を引いた小さなラベルにしている。 */}
        <h2 className="mb-6 flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-brand">
          <span className="h-px w-8 bg-brand" aria-hidden="true" />
          {section.label}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}
