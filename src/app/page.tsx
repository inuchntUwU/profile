import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";
import { getProjects, githubUser } from "@/lib/github";

/**
 * トップページ。src/app/page.tsx というファイル名が、そのまま「/」のページになる。
 *
 * ここは「構成」だけを組んだ骨組み。配色・フォント・余白・枠線は一切付けていないので、
 * 見た目はここから自由に作っていく（このファイルを全部書き換えてもよい）。
 *
 * 構成:
 *   固定ヘッダー（Header.tsx / ナビは sections.ts から自動生成）
 *   Hero      … ハンドルと一行紹介。見出しなし
 *   About     … 自己紹介 + GitHub の数字
 *   Projects  … リポジトリ一覧。GitHub から自動取得
 *   Links     … 外部リンク。アイコン付き
 *   Footer    … 最終更新日
 *
 * 使えるデータ:
 *   profile        src/data/profile.ts に手書きした情報
 *   githubUser     GitHub から取得したプロフィール
 *   getProjects()  リポジトリ一覧。profile.featured が先頭、残りは star の多い順
 *
 * 部品:
 *   <Section>           id とスクロール位置の調整と見出しが入った器
 *   <Reveal>            スクロールでフェードインさせたい範囲を包む
 *   <Icon name="..." >  ブランドロゴや汎用アイコン
 *   @/components/ui/*   shadcn/ui のパーツ（card / badge / button / separator）
 *
 * セクションを増やすときは src/data/sections.ts に足してから、ここに <Section> を並べる。
 */
export default function Home() {
  // このコンポーネントはサーバー側（ビルド時）で 1 回だけ実行される。
  // なので、ここでの処理はページ表示の速さに影響しない。
  const projects = getProjects();

  // sections.ts から id で引く。ナビと見出しの文字がここでもズレないようにするため。
  const section = (id: (typeof sections)[number]["id"]) => {
    const found = sections.find((s) => s.id === id);
    if (!found) throw new Error(`sections.ts に "${id}" がありません`);
    return found;
  };

  return (
    <>
      <Header />

      {/*
        id="top" はヘッダーのサイト名から戻ってくる先。
        pt-20 は固定ヘッダー（h-20 = 80px）の分だけ本文を下げるためのもの。
        これが無いと、ページ先頭がヘッダーの裏に隠れる。
      */}
      <main id="top" className="pt-20">
        {/* Hero だけは見出しを出さない（ハンドル名が見出しの役割をするため） */}
        <Reveal>
          <section>
            <h1>{profile.handle}</h1>
            <p>{profile.tagline}</p>
          </section>
        </Reveal>

        <Section section={section("about")}>
          <p>{profile.intro}</p>
          <p>
            {githubUser.publicRepos} repositories / {githubUser.followers} followers
          </p>
        </Section>

        <Section section={section("projects")}>
          <ul>
            {/*
              配列を .map() で並べるときは key に「他と重複しない値」が要る。
              React が差分を見分けるのに使う。ここではリポジトリ名が一意なのでそれを使う。
            */}
            {projects.map((project) => (
              <li key={project.name}>
                <a href={project.htmlUrl}>{project.name}</a>
                {/*
                  description は未設定だと null になる。
                  三項演算子で「あるときだけ出す」。null を返した箇所には何も描画されない。
                */}
                {project.description ? <span> — {project.description}</span> : null}
              </li>
            ))}
          </ul>
        </Section>

        <Section section={section("links")}>
          <ul>
            {profile.links.map((link) => (
              <li key={link.href}>
                {/*
                  inline-flex と gap-2 は、アイコンと文字を横に並べて間隔を空けるためのもの。
                  Icon には profile.ts に書いた icon の値をそのまま渡す。
                */}
                <a href={link.href} className="inline-flex items-center gap-2">
                  <Icon name={link.icon} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Footer />
      </main>
    </>
  );
}
