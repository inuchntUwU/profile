import { profile } from "@/data/profile";
import { fetchedAt } from "@/lib/github";

/** ページ最下部。 */
export function Footer() {
  // GitHub の情報を取得した日。毎日 06:00 JST の自動ビルドで更新される。
  const updated = new Date(fetchedAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <footer className="py-10 text-center text-xs text-muted-foreground">
      <p>
        © {profile.handle} · Last updated {updated}
      </p>
    </footer>
  );
}
