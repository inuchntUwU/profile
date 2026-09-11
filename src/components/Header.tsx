import { profile } from "@/data/profile";
import { sections } from "@/data/sections";

/**
 * 画面上部に固定するヘッダー。サイト名と、各セクションへのナビを出す。
 *
 * ナビの項目は src/data/sections.ts から自動で作られるので、
 * セクションを増やすときはそちらに足すだけでよい。
 *
 * ここも構造だけ:
 *   - 常に画面上部に貼り付ける（fixed）
 *   - 本文より手前に出す（z-50）
 *   - 下の文字が透けないよう背景を敷く（bg-background）
 * 罫線・文字サイズ・配置などの装飾は付けていない。
 */
export function Header() {
  return (
    <header
      // fixed で画面に固定、inset-x-0 で左右いっぱい、h-20 で高さ 80px。
      // 高さを変えたら Section.tsx の scroll-mt-20 と page.tsx の pt-20 も合わせること。
      className="fixed inset-x-0 top-0 z-50 h-20 bg-background"
    >
      <nav>
        {/* サイト名。クリックで一番上に戻る。 */}
        <a href="#top">{profile.handle}</a>

        {sections.map((section) => (
          // href="#about" のように書くと、その id を持つ要素まで飛ぶ。
          // なめらかに動くのは globals.css の scroll-behavior: smooth のおかげ。
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
