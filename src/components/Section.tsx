import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import type { SectionDef } from "@/data/sections";

/**
 * セクション 1 つ分の器。
 *
 * ここでやっているのは「構造」だけ:
 *   - #about のような id を振る（ヘッダーのナビから飛べるようにする）
 *   - 固定ヘッダーの下に隠れないようスクロール位置をずらす
 *   - 見出しを出す
 *   - スクロールで表示されるようにする
 *
 * 枠線・余白・背景といった見た目は一切付けていない。
 * className に Tailwind のクラスを渡すか、このファイルを直接書き換えて装飾する。
 */
type SectionProps = {
  section: SectionDef;
  /** 見出しを出したくないとき（Hero など）に false */
  showHeading?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({
  section,
  showHeading = true,
  className,
  children,
}: SectionProps) {
  return (
    <Reveal>
      <section
        id={section.id}
        // scroll-mt-20 は「アンカーで飛んだとき、上に 5rem(80px) 余白を空けて止まる」指定。
        // これが無いと、固定ヘッダーの裏に見出しが隠れてしまう。
        // ヘッダーの高さを変えたら、この数字と Header.tsx の h-20 の両方を合わせること。
        className={`scroll-mt-20 ${className ?? ""}`}
      >
        {showHeading ? <h2>{section.label}</h2> : null}
        {children}
      </section>
    </Reveal>
  );
}
