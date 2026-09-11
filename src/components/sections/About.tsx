import Image from "next/image";
import { Section } from "@/components/Section";
import { profile } from "@/data/profile";
import { sections } from "@/data/sections";
import { githubUser } from "@/lib/github";

/**
 * ページ最上部のプロフィールカード。アバター・ハンドル名・一行紹介・自己紹介。
 * スマホでは縦並び、PC ではアバターが左・文章が右の横並びになる。
 *
 * カードの高さはほぼアバターの大きさで決まる。高さを変えたいときは
 * width / height と size-32 の 3 か所をそろえて変える（size-32 = 128px）。
 */
export function About() {
  return (
    <Section section={sections.about}>
      {/* flex-col sm:flex-row … スマホでは縦、画面幅 640px 以上では横に並べる */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Image
          src={githubUser.avatarUrl}
          alt={`${profile.handle} のアイコン`}
          width={128}
          height={128}
          // size-32 … 128px 四方 / shrink-0 … 横並びのとき文章に押されて縮まないようにする
          // self-center … 縦並び（スマホなど幅が狭いとき）はアイコンだけ中央に寄せる
          // sm:self-auto … 横並び（幅 640px 以上）では元の位置（上下中央・左端）に戻す
          className="size-32 shrink-0 self-center rounded-full border-2 border-brand sm:self-auto"
        />

        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {profile.handle}
          </h1>
          <p className="text-lg text-brand">{profile.tagline}</p>
          <p className="max-w-2xl leading-relaxed text-muted-foreground">
            {profile.intro}
          </p>
        </div>
      </div>
    </Section>
  );
}
