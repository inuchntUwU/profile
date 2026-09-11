import { ArrowUpRight, Star } from "lucide-react";
import { Section } from "@/components/Section";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";
import { getProjects } from "@/lib/github";

/** リポジトリ一覧。GitHub から自動取得したものをカードで並べる。 */
export function Projects() {
  const projects = getProjects();

  return (
    <Section section={sections.projects}>
      {/* スマホでは 1 列、画面幅 640px 以上で 2 列、1024px 以上で 3 列 */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.name}>
            <a
              href={project.htmlUrl}
              // 別タブで開く。rel="noreferrer" は開いた先から元のページを操作されないための決まり文句。
              target="_blank"
              rel="noreferrer"
              // group … 中の要素が「このカードにマウスが乗っているか」で見た目を変えられるようにする
              // hover:border-brand … マウスを乗せると枠線が差し色になる
              className="group flex h-full flex-col gap-3 rounded-xl border border-border p-5 transition-colors hover:border-brand"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium transition-colors group-hover:text-brand">
                  {project.name}
                </h3>
                {/* 右上の矢印。カードにマウスが乗ると右上に少し動く。 */}
                <ArrowUpRight
                  size={16}
                  className="shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                  aria-hidden="true"
                />
              </div>

              {/* 説明文は未設定のリポジトリもあるので、あるときだけ出す */}
              {project.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              ) : null}

              {/* mt-auto … カードの一番下に寄せる。説明文の長さが違っても下の行が揃う */}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                {profile.featured.includes(project.name) ? (
                  <span className="text-brand">★ Pick</span>
                ) : null}
                {project.language ? <span>{project.language}</span> : null}
                {project.stars > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} aria-hidden="true" />
                    {project.stars}
                  </span>
                ) : null}
                <span>
                  {new Date(project.pushedAt).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
