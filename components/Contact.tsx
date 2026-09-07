"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { profile } from "@/lib/data";
import Reveal from "@/components/Reveal";
import HalftoneField from "@/components/HalftoneField";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(json.error || "Something went wrong.");
        return;
      }

      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Network error — try again.");
    }
  }

  return (
    <section id="contact" className="relative px-6 md:px-10 py-24 md:py-32 border-t border-line overflow-hidden">
      <HalftoneField className="opacity-50" spacing={24} influence={140} />
      <div className="ambient-blob w-[420px] h-[420px] -top-32 -left-20 animate-float" aria-hidden="true" />
      <div
        className="ambient-blob w-[320px] h-[320px] bottom-0 right-0 opacity-60 animate-float"
        style={{ animationDelay: "-3s" }}
        aria-hidden="true"
      />

      <Reveal className="relative mb-4 text-center flex flex-col items-center">
        <p className="eyebrow mb-6">05 / OPEN FOR WORK · AVAILABLE FOR FREELANCE &amp; FULL-TIME</p>
        <h2 className="font-display text-5xl md:text-8xl uppercase leading-[0.95]">Got a project</h2>
        <h2 className="font-display text-5xl md:text-8xl uppercase leading-[0.95] flex flex-wrap items-baseline justify-center gap-x-4 md:gap-x-6">
          in mind?
          <span className="font-script text-lime normal-case text-6xl md:text-9xl glow-text">
            let&apos;s talk.
          </span>
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="relative mt-10 mb-16 text-center">
        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-3 font-display text-2xl md:text-4xl text-paper hover:text-lime transition-colors"
        >
          {profile.email} ↗
        </a>
      </Reveal>

      <div className="relative grid md:grid-cols-2 gap-16">
        <Reveal delay={0.15}>
          <div className="flex flex-col gap-4 font-mono text-sm tracking-widest2 mb-12">
            <a
              href={`https://${profile.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-lime transition-colors"
            >
              LINKEDIN — {profile.linkedin} ↗
            </a>
            <a
              href={`https://${profile.github}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-lime transition-colors"
            >
              GITHUB — {profile.github} ↗
            </a>
          </div>
          <p className="text-muted text-sm max-w-sm leading-relaxed">
            Based in {profile.location}. Usually replies within a day or two —
            faster if there's an event date attached to it.
          </p>
        </Reveal>

        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">NAME</span>
            <input
              name="name"
              required
              placeholder="Your name"
              className="bg-transparent border-b border-line py-3 placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">EMAIL</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="bg-transparent border-b border-line py-3 placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.65rem] tracking-widest2 text-muted">BRIEF</span>
            <textarea
              name="message"
              required
              rows={4}
              placeholder="What are we building?"
              className="bg-transparent border-b border-line py-3 placeholder:text-muted/50 focus:border-lime focus-visible:outline-none outline-none transition-colors resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="self-start mt-2 rounded-full bg-lime px-6 py-3 font-mono text-xs tracking-widest2 text-lime-ink
                       transition-transform hover:scale-105 hover:shadow-glow-lime disabled:opacity-50"
          >
            {status === "sending" ? "SENDING…" : "SEND ↗"}
          </button>

          {status === "sent" && (
            <p className="font-mono text-xs text-lime">
              Message sent — thanks, I&apos;ll be in touch.
            </p>
          )}
          {status === "error" && <p className="font-mono text-xs text-red-400">{errorMsg}</p>}
        </motion.form>
      </div>

      <div className="relative mt-16 flex items-end justify-between border-t border-line pt-6 font-mono text-[0.65rem] tracking-widest2 text-muted">
        <p>ISLAMABAD · PK &nbsp; 33.7°N 73.0°E</p>
        <p className="text-lime">005 — CONTACT</p>
      </div>
    </section>
  );
}
