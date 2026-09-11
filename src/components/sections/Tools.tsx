import { ArrowUpRight, Wrench } from "lucide-react";
import { Section } from "@/components/Section";
import { type ProfileTool, profile } from "@/data/profile";
import { sections } from "@/data/sections";

/**
 * このドメインで公開しているツールの一覧。中身は profile.ts の tools に手で書く。
 * まだ 1 つも無いときは「準備中」のカードを 1 枚だけ出す。
 */
export function Tools() {
  return (
    <Section section={sections.tools}>
      {/* Projects と同じく、スマホ 1 列 / 640px 以上で 2 列 / 1024px 以上で 3 列 */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {profile.tools.length === 0 ? (
          <li>
            <EmptyCard />
          </li>
        ) : (
          profile.tools.map((tool) => (
            <li key={tool.href}>
              <ToolCard tool={tool} />
            </li>
          ))
        )}
      </ul>
    </Section>
  );
}

/** ツール 1 件分のカード */
function ToolCard({ tool }: { tool: ProfileTool }) {
  const isWip = tool.status === "wip";

  // カードの中身は公開中でも開発中でも同じ。違うのは「リンクにするかどうか」だけ。
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-medium transition-colors group-hover:text-brand">
          {tool.name}
        </h3>
        {isWip ? (
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            開発中
          </span>
        ) : (
          <ArrowUpRight
            size={16}
            className="shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
            aria-hidden="true"
          />
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {tool.description}
      </p>
      {/* 公開先のドメイン（hoge.inuch.net など） */}
      <span className="mt-auto font-mono text-xs text-muted-foreground">
        {new URL(tool.href).hostname}
      </span>
    </>
  );

  const card = "flex h-full flex-col gap-3 rounded-xl border border-border p-5";

  if (isWip) {
    // 開発中はリンクにせず、少し薄く表示する（opacity-60）。
    return <div className={`${card} opacity-60`}>{body}</div>;
  }

  return (
    <a
      href={tool.href}
      target="_blank"
      rel="noreferrer"
      className={`group ${card} transition-colors hover:border-brand`}
    >
      {body}
    </a>
  );
}

/** ツールがまだ 1 つも無いときに出すカード。枠線を点線（border-dashed）にしている。 */
function EmptyCard() {
  return (
    <div className="flex h-full flex-col items-start gap-3 rounded-xl border border-dashed border-border p-5 text-muted-foreground">
      <Wrench size={20} className="text-brand" aria-hidden="true" />
      <p className="font-medium text-foreground">Coming soon</p>
      <p className="text-sm leading-relaxed">
        inuch.net で公開するツールをここに載せていく予定です。
      </p>
    </div>
  );
}
