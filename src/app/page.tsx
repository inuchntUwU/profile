import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { About } from "@/components/sections/About";
import { Links } from "@/components/sections/Links";
import { Projects } from "@/components/sections/Projects";
import { Tools } from "@/components/sections/Tools";

/**
 * トップページ。上から順にカードを並べているだけ。
 * 各カードの中身は src/components/sections/ の同じ名前のファイルにある。
 *
 * 並び順を変えたいときはここの行を入れ替え、src/data/sections.ts の navSections も合わせる。
 */
export default function Home() {
  return (
    <>
      <Header />

      {/*
        id="top" … ヘッダーのサイト名を押したときの戻り先
        pt-28 … 固定ヘッダー（80px）+ 余白（32px）の分だけ下げる。
                ヘッダーの高さを変えたら、ここも「ヘッダーの高さ以上」になるよう合わせる
        max-w-5xl mx-auto … 横幅を最大 1024px にして中央に寄せる
        flex flex-col gap-8 … カードを縦に並べ、間を 32px 空ける
      */}
      <main id="top" className="mx-auto flex max-w-5xl flex-col gap-8 px-6 pt-28">
        <About />
        <Projects />
        <Tools />
        <Links />
        <Footer />
      </main>
    </>
  );
}
