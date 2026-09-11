import { Icon } from "@/components/Icon";
import { Section } from "@/components/Section";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";

/** 外部リンク。1 つずつカードにして、大きなアイコンで並べる。 */
export function Links() {
  return (
    <Section section={sections.links}>
      {/* grid-cols-2 sm:grid-cols-3 … スマホでは 2 列、PC では 3 列 */}
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {profile.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              // マウスを乗せると枠線と文字が差し色になり、カードが少し浮き上がる（-translate-y-1）
              className="group flex h-full flex-col items-center gap-3 rounded-xl border border-border p-6 text-center transition hover:-translate-y-1 hover:border-brand hover:text-brand"
            >
              <Icon name={link.icon} size={48} />
              <span className="font-medium">{link.label}</span>
              {/* リンク先のドメイン（github.com など）を小さく出す */}
              <span className="font-mono text-xs text-muted-foreground">
                {new URL(link.href).hostname}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
