/**
 * ページに並べるセクションの一覧。
 *
 * ヘッダーのナビと、実際のセクションの両方がこの配列を見る。
 * 1 か所にまとめてあるので、「ナビには About があるのにセクションが無い」
 * といったズレが起きない。
 *
 * 並び替えたいときはこの配列の順番を入れ替え、
 * page.tsx 側の <Section> の並びも合わせる。
 */

export type SectionId = "about" | "projects" | "links";

export type SectionDef = {
  /** URL の #about に対応する。ナビのリンク先になる。 */
  id: SectionId;
  /** ナビと見出しに出す文字 */
  label: string;
};

export const sections: SectionDef[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "links", label: "Links" },
];
