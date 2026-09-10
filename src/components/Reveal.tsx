"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** 複数並べるときに少しずつ遅らせる（秒） */
  delay?: number;
  className?: string;
};

/**
 * スクロールで画面に入ったら一度だけフェードインさせる共通ラッパー。
 * motion を直接触るのはこのファイルだけにして、各セクションは <Reveal> で包むだけにする。
 * OS の「視差効果を減らす」設定が有効なときはアニメーションせず即座に表示する。
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
