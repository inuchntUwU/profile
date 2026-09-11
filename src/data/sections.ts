/**
 * ページに並べるセクションの定義。
 *
 * 各セクションの部品（About.tsx など）は sections.about のように名前で引き、
 * ヘッダーのナビは navSections の順番で並ぶ。
 * 1 か所にまとめてあるので、ナビの文字と見出しの文字がズレない。
 *
 * セクションを増やすときは、sections に 1 行足して navSections にも並べる。
 */

export type SectionDef = {
  /** URL の #about に対応する。ナビのリンク先になる。 */
  id: string;
  /** ナビと見出しに出す文字 */
  label: string;
};

export const sections = {
  about: { id: "about", label: "About" },
  projects: { id: "projects", label: "Projects" },
  tools: { id: "tools", label: "Tools" },
  links: { id: "links", label: "Links" },
} satisfies Record<string, SectionDef>;

/** ヘッダーのナビに出す順番 */
export const navSections: SectionDef[] = [
  sections.about,
  sections.projects,
  sections.tools,
  sections.links,
];
