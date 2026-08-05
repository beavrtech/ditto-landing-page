# Writing craft: rules shared by The Scope and the Ditto blog

This file holds the writing-craft rules that apply to **every Ditto article, on both surfaces**: The Scope (`content/media/`, governed by [TONE-OF-VOICE.md](./TONE-OF-VOICE.md) and [EDITORIAL-LINE.md](./EDITORIAL-LINE.md)) and the Ditto blog (governed by the `ditto-blog-optimisation` skill). The rules are about logic and clarity, not register, so they hold whether a piece is promotional or restrained, in French or in English.

Every rule below came out of a real correction to a real draft. Each carries the before/after that produced it, so the rule is checkable, not abstract.

**Precedence.** The Non-negotiables in [TONE-OF-VOICE.md](./TONE-OF-VOICE.md) §3 (no invented figures, no fabricated sources, no greenwashing, accurate and current regulation) outrank everything here. Each surface's own contract wins on register and structure. These craft rules sit under both and never override a guardrail.

**On the examples.** The examples mix French and English on purpose. A rule shown with a French example holds in English too, and the reverse, unless the rule is explicitly about one language's grammar (only B4 is).

---

## A. Logical coherence

The reader trusts a sentence to mean what it says. These three failures break that trust quietly: the prose still scans, but a careful reader notices that the sentence did not actually say anything, or said the wrong thing, or forgot what it had already said. They are the highest-value checks in this file because they survive a surface read and only a slow read catches them.

### A1. No hollow assertions

A sentence must **state** its claim, not point at one. If the predicate refers to content the sentence does not contain (a number it never gives, a question it never asks, an implication it never draws, a vague "something"), either state the content or cut the sentence.

- Hollow: "The figure behind a cheese's footprint is the one that should change how you buy." (Which figure? The sentence gestures at a number it never gives.)
- Fixed: "That figure, roughly 400 liters of milk per wheel, is the one that should change how you buy."

Test: underline the noun the sentence is really about. If it is a placeholder for something the sentence promises but withholds, the sentence is hollow.

### A2. No object drift

Whatever a sentence names as its object, the verb must be able to act on **that exact thing**. If the frame sets up object A but the verb only works on object B, rebuild the sentence so the verb acts on A, or reframe the sentence around B.

- Drift: "The appellation map explains why two identical wheels can sit a factor of three apart." (A map does not explain, it shows. And what sits apart is the footprint, not the wheels.)
- Fixed: "Two wheels that look identical can have carbon footprints a factor of three apart, and the appellation map does not show why."

### A3. Acknowledge fact and number reuse

When a figure or fact appears a **second** time, mark it as a callback so it does not read as if the writer forgot having said it. A reused number with no signal reads like a machine repeating a token.

- Unflagged: an early paragraph gives "400 liters of milk per wheel"; a later one says, cold, "the 400 liters have to come from somewhere."
- Flagged: "those same 400 liters", "the milk figure from earlier", "as noted above, 400 liters."

---

## B. Sentence-level craft

Seven fixes that turn correct-but-flat prose into prose an editor would keep. Each is a small, mechanical swap.

### B1. Restate the noun instead of a far pronoun

A pronoun that reaches back more than one clause makes the reader re-parse. Restate the noun.

- Weak: "...ce qu'il mesure." Better: "...ce que le score reflète."
- EN: not "what it measures" three clauses after the last noun, but "what the score reflects."

### B2. Concrete domain nouns, not abstract placeholders

Swap "proof", "option", "element" for the real thing in the domain.

- Weak: "une preuve", "une option". Better: "une médaille", "un outil".

### B3. Hedge absolute claims to defensible ones

An absolute invites a counterexample. State the claim you can defend. This also serves the no-overpromising guardrail.

- Weak: "finit par coûter", "la seule option qui permette". Better: "peut finir par coûter", "la meilleure option pour".

### B4. Open a contrast with a real connective, never a sentence-initial "But" / "Mais"

Start a contrast with a connective that carries the turn. This one is about the first word of the sentence only.

- FR: "En revanche, ...", "À l'inverse, ...", "Pourtant, ..." rather than "Mais ...".
- EN: "By contrast, ...", "Yet ...", "Still, ..." rather than "But ...".

The point is to avoid opening a sentence on a bare "Mais" / "But", not to ban the words mid-sentence. Any connective that avoids the flat opener is fine; the list above is not exhaustive.

### B5. Frame either/or as "simply X, or rather Y"

A bare "X, or Y" reads as a shrug. Make the alternative do work.

- Weak: "un coût, ou un investissement". Better: "un simple coût, ou plutôt un investissement".
- EN: "simply a cost, or rather an investment."

### B6. Cut imported rhetorical asides; finish the thought concretely

Delete the borrowed flourish and land on the concrete point.

- Weak: "un coût, même s'il n'apparaît jamais sur une facture". Better: "un coût, en temps et en ressources".

### B7. Personal, concrete subjects over abstract nominalizations

Prefer a subject the reader can picture.

- Weak: "les progrès". Better: "vos efforts".

---

## For the reviewer

The cold-reader pass (`scope-article` step 8, and the equivalent pass on a blog draft) runs against every rule above. Two standing instructions govern **how** that pass behaves, taken from the anti-slop discipline:

- **Minimum effective edit.** Fix what is wrong; do not flatten what is merely distinctive. The goal is to keep the writer's voice and the piece's texture, not to make every paragraph equally tidy. A line that is unusual but works stays.
- **Detect, do not rewrite wholesale.** For each issue: name the pattern, quote the line, give one short fix. Do not silently rewrite the whole draft, do not score it, and do not speculate about whether a machine wrote it. The writer keeps the pen.

---

## Mechanics that do not relax

**Em dashes: none.** On any surface, in either language, in any length of draft. If another style guide says "one or two em dashes are fine in a longer piece", that permission does not apply here. [TONE-OF-VOICE.md](./TONE-OF-VOICE.md) §4 (Mechanics) is the rule: a period for a hard break, a comma for a soft aside, a colon to set up a list, parentheses for a true aside.
