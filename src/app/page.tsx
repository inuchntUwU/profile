import { Reveal } from "@/components/Reveal";
import { profile } from "@/data/profile";
import { getProjects, githubUser } from "@/lib/github";

/**
 * トップページ。src/app/page.tsx というファイル名が、そのまま「/」のページになる。
 *
 * ここはデータの配線だけをした骨組みで、見た目はほぼ付けていない。
 * 好きに書き換えてよい（このファイルを全部消して作り直しても問題ない）。
 *
 * 使えるデータ:
 *   profile        src/data/profile.ts に手書きした情報（tagline / intro / links など）
 *   githubUser     GitHub から取得したプロフィール（follower 数、アバターのパスなど）
 *   getProjects()  リポジトリ一覧。profile.featured が先頭、残りは star の多い順
 *
 * 部品:
 *   <Reveal>            スクロールでフェードインさせたい範囲を包む
 *   @/components/ui/*   shadcn/ui のパーツ（card / badge / button / separator）
 *
 * セクションが育ってきたら src/components/sections/ にファイルを分けると読みやすい。
 */
export default function Home() {
  // このコンポーネントはサーバー側（ビルド時）で 1 回だけ実行される。
  // なので、ここでの処理はページ表示の速さに影響しない。
  const projects = getProjects();

  return (
    <main>
      <Reveal>
        <section id="hero">
          <h1>{profile.handle}</h1>
          <p>{profile.tagline}</p>
        </section>
      </Reveal>

      <Reveal>
        <section id="about">
          <h2>About</h2>
          <p>{profile.intro}</p>
          <p>
            {githubUser.publicRepos} repositories / {githubUser.followers} followers
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section id="projects">
          <h2>Projects</h2>
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
        </section>
      </Reveal>

      <Reveal>
        <section id="links">
          <h2>Links</h2>
          <ul>
            {profile.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>
    </main>
  );
}
