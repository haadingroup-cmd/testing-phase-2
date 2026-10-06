"use client";
import { useState } from "react";
import type { AuditReport } from "@/lib/seo/types";
import { aiEvidence, type AITask } from "@/lib/seo/ai-evidence";
export default function ManualAI({ report }: { report: AuditReport }) {
  const [task, setTask] = useState<AITask>("summary");
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");
  function prepare() { const evidence = aiEvidence(report, task); setPrompt(evidence.instructions + "\nReturn a headline, explanation, and labelled action items.\n\n" + evidence.input); setNotice("Prompt prepared locally from this audit. No AI assessment has run."); }
  async function copy() { try { await navigator.clipboard.writeText(prompt); setNotice("Prompt copied. Paste it into your chosen AI app and review its suggestions."); } catch { setNotice("Copy is unavailable. Select the prompt text and copy it manually."); } }
  return <section className="hg-panel space-y-4"><h3>AI review without an API key</h3><p>Prepare a prompt using observed page evidence, then paste it into an AI app you already use. This step sends nothing automatically. Review the text and share only information you are authorized to share. AI suggestions do not change measured scores.</p><label>Review type <select className="hg-input" value={task} onChange={e => { setTask(e.target.value as AITask); setPrompt(""); setNotice(""); }}><option value="summary">Priority action plan</option><option value="content">Topics and search intent</option><option value="meta">Metadata drafts</option></select></label><button className="hg-button hg-button-outline" onClick={prepare}>Prepare AI review prompt</button>{prompt && <><label>Review and edit before sharing<textarea className="hg-input" rows={10} value={prompt} onChange={e => setPrompt(e.target.value)} /></label><button className="hg-button hg-button-primary" onClick={copy}>Copy review prompt</button></>}{notice && <p role="status">{notice}</p>}</section>;
}
