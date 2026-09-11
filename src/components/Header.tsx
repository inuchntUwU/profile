import { navSections } from "@/data/sections";

/**
 * 画面上部に固定するヘッダー。左にサイト名、右に各セクションへのナビ。
 * ナビの項目は src/data/sections.ts から自動で作られる。
 */
export function Header() {
  return (
    <header
      // fixed … 画面上部に固定 / h-20 … 高さ 80px
      // bg-background/80 … 背景色を 80% の不透明度で敷く / backdrop-blur … 後ろを少しぼかす
      // 高さを変えたら Section.tsx の scroll-mt-20 と page.tsx の pt-28 も合わせること。
      className="fixed inset-x-0 top-0 z-50 h-20 border-b border-border bg-background/80 backdrop-blur"
    >
      {/* max-w-5xl mx-auto … 本文と同じ幅で中央に寄せる / justify-between … 両端に振り分ける */}
      <nav className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        {/* サイト名（ドメイン名）。ドットだけ差し色にしている。クリックで一番上に戻る。 */}
        <a href="#top" className="text-lg font-bold tracking-tight">
          inuch<span className="text-brand">.</span>net
        </a>

        <div className="flex gap-6 text-sm text-muted-foreground">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              // マウスを乗せると差し色に変わる。transition-colors で色がなめらかに変わる。
              className="transition-colors hover:text-brand"
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
