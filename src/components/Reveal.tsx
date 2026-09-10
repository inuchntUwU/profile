// "use client" は「このファイルはブラウザ側でも動かす」という Next.js への宣言。
// スクロール位置の監視はブラウザでしかできないので、この 1 行が必要。
// 逆にこれが無いファイルはサーバー側（ビルド時）だけで処理され、その分 HTML が軽くなる。
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  /** 包む中身。<Reveal> と </Reveal> の間に書いたものがここに入る。 */
  children: ReactNode;
  /** 複数並べるときに少しずつ遅らせる秒数。0.1 ずつずらすと順番に出てくる。 */
  delay?: number;
  /** 外側の div に付けたい Tailwind のクラス */
  className?: string;
};

/**
 * スクロールして画面に入ったときに、下から少し浮き上がりながらフェードインさせる部品。
 *
 * 使い方:
 *   <Reveal>
 *     <section>...</section>
 *   </Reveal>
 *
 * アニメーションのコードをこのファイルに集約しておくことで、
 * 各セクションは <Reveal> で包むだけで済み、motion の書き方を毎回調べなくてよくなる。
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  // OS の「視差効果を減らす / アニメーションを減らす」設定を読む。
  // 動きで気分が悪くなる人がいるので、有効なら動かさない。
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    // アニメーションなしで、最初から表示された状態にする。
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      // 最初の状態: 透明で、本来の位置より 16px 下にいる。
      initial={{ opacity: 0, y: 16 }}
      // 画面内に入ったときの状態: 不透明で、本来の位置。ここへ向かって動く。
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        // once: true で一度表示したら終わり。スクロールで戻っても再生し直さない。
        once: true,
        // 要素の 20% が見えたら開始する。0 だと端がかすった瞬間に始まってしまう。
        amount: 0.2,
      }}
      // ease: "easeOut" は「最初は速く、最後はゆっくり」止まる動き方。自然に見える。
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
