import { Reveal } from "@/components/Reveal";
import { profile } from "@/data/profile";
import { getProjects, githubUser } from "@/lib/github";

/**
 * データの配線だけした骨組み。見た目はここから自由に作り替えてよい。
 *
 *   profile        src/data/profile.ts の手書き情報（tagline / intro / links など）
 *   githubUser     GitHub から取得したプロフィール（アバター・follower 数など）
 *   getProjects()  profile.featured を先頭に並べ替えたリポジトリ一覧
 *
 * shadcn/ui のプリミティブは @/components/ui から使える（card / badge / button / separator）。
 * セクションを増やすときは src/components/sections/ に切り出すと見通しがよい。
 */
export default function Home() {
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
            {projects.map((project) => (
              <li key={project.name}>
                <a href={project.htmlUrl}>{project.name}</a>
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
