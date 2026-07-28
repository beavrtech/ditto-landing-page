# MDX components

Article bodies are MDX: markdown plus the components below. They are defined in `src/features/media/components/mdx/`. Nothing else is available — an unknown component is a build error, not a silently dropped tag.

Plain markdown covers the rest: `##` and `###` headings, lists, `**bold**`, links, blockquotes, and GitHub-flavored tables.

Your `##` headings become the article's table of contents, in the side rail on desktop and an accordion on narrow screens, so write them as scannable statements rather than labels. A `<FAQ>` block is added to that list automatically.

## `<KeyTakeaways>`

Three to five bullets a reader could act on without reading further. Goes near the top, after the first paragraph or before it.

```mdx
<KeyTakeaways>
- REACH applies to you as an importer even when you manufacture nothing.
- The obligation that catches most mid-sized companies is Article 33.
</KeyTakeaways>

<KeyTakeaways title="À retenir">
- La liste candidate est mise à jour environ deux fois par an.
</KeyTakeaways>
```

`title` is optional and defaults to "Key takeaways". **In a French body, always pass `title="À retenir"`** — the default is not translated automatically.

Write takeaways as claims, not topics. "The Candidate List is updated twice a year" earns its place; "Candidate List updates" does not.

## `<FAQ>`

Visible questions and answers, plus `FAQPage` structured data. Use it only when practitioners genuinely ask these questions.

```mdx
<FAQ
  title="Questions fréquentes"
  items={[
    {
      question: "Does REACH apply if we only import finished components?",
      answer: "Yes. Importing an article into the EU makes you responsible for Article 33 communication, even if you carry out no chemical process yourself."
    }
  ]}
/>
```

Rules, because this markup gets read out of context by search and answer engines:

- Answers must be **self-contained**. Never "as we saw above", never a pronoun referring to the article.
- Answers must be **plain text**, one to four sentences. No markdown inside the string, no links.
- Never mark up a question whose answer is not visible on the page.
- No marketing copy in an answer. It is an answer.
- Omit the component entirely rather than inventing questions.
- In a French body pass a French `title`; the default is "FAQ", which happens to work in both.

## `<PullQuote>`

A line worth stopping on. At most one per article.

```mdx
<PullQuote attribution="A pattern we see repeatedly in assessment preparation">
The gap is rarely between what a company does and what good practice requires.
</PullQuote>
```

`attribution` is optional. If the quote is from a named person, attribute them fully: `"Name, Title, Company"`. Never attribute a sentence to a person who did not say it, including a composite or illustrative quote.

## `<ArticleImage>`

An inline figure with an optional caption.

```mdx
<ArticleImage
  src="/media/illustrations/reach-scope.svg"
  alt="Diagram of an assembly broken into its component articles"
  caption="Each part is assessed separately against the 0.1% threshold."
/>
```

`alt` describes the image for someone who cannot see it. `caption` adds information for everyone. They should not be the same sentence.

## `<YouTube>`

```mdx
<YouTube id="dQw4w9WgXcQ" title="What the double-materiality assessment involves" />
```

Renders a lazy-loaded, cookie-less embed (`youtube-nocookie.com`). `title` is required: it is the accessible name of the frame and the visible caption. Describe the video's content, not "Video".

## Tables

Standard GFM tables. They scroll horizontally on small screens automatically.

```mdx
| Document | What it proves | Where it breaks |
|---|---|---|
| Bill of materials | You know what you are selling | Free-text descriptions |
```

Keep cells short. Explanation belongs in the prose around the table, not inside it.

## Callouts written as prose

"Good to know:" and "Key takeaway:" asides are part of the house style but have **no component today** — they are written as ordinary paragraphs beginning with those words, in bold or plain:

```mdx
Good to know: an "article" under REACH is defined by its shape and function, not by how you buy it.
```

In French: `Bon à savoir :`. If these become frequent enough to deserve visual treatment, that is a component to add, not a style to hand-roll in a body.

## Not available

No raw HTML, no `<div>`, no inline styles, no `<script>`. If a body needs something the list above cannot express, add a component in `src/features/media/components/mdx/` and document it here, so every article can use it and it can be restyled centrally later.
