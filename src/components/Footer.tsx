import { fetchedAt } from "@/lib/github";

/**
 * ページ最下部。
 * 中身は最小限にしてあるので、必要なものを足していく。
 */
export function Footer() {
  return (
    <footer>
      {/*
        GitHub の情報をいつ取得したかの表示。
        毎日 06:00 JST の自動ビルドで更新されるので、その確認にも使える。
        不要ならこの行ごと消してよい。
        ja-JP を明示しているのは、指定しないとサーバーと閲覧者の環境で
        表記が食い違い、React の警告が出ることがあるため。
      */}
      <p>
        Last updated:{" "}
        {new Date(fetchedAt).toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </footer>
  );
}
