"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function Hero({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center h-screen">
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Step into the LLM Lab".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.2,
            delay: 0.4,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          Experiment with temperature, top_p, and more. Generate multiple
          responses, compute custom quality metrics and compare outputs.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.2,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
export const ExploreTheLab = () => {
  return (
    <Link href="/lab" aria-label="Explore the Lab" className="">
      <motion.span
        className=" underline flex items-center gap-2 hover:cursor-pointer text-center "
        animate={{ y: [0, 2, 3, 2, 0] }}
        transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
      >
        <ArrowRight className="size-4" />
        Explore the Lab
      </motion.span>
    </Link>
  );
};
