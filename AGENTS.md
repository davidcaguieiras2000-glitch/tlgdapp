<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> Lovable.
<!-- LOVABLE:END -->

- Keep TLGD operational sections as separate TanStack routes sharing one app shell, so navigation remains deep-linkable and consistent.
- Render maps with the Google Maps browser key, while route-cost estimates stay deterministic and user-triggered to avoid an open billable API proxy.
- Keep the app's reading size in one place: raise or lower text by editing the `--text-*` scale and `body` font-size in `src/styles.css`, and let components use plain `text-*` utilities instead of per-component sizes, so the whole app scales together.
- Scope Operations Dashboard brand overrides through its wrapper and semantic CSS variables, so changing its palette does not restyle other operational sections.
