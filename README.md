# Daan van Vugt — Portfolio

[daanvanvugt.com](https://daanvanvugt.com)

Built with React, TypeScript, Vite, Tailwind CSS and Three.js.

![Portfolio preview](docs/landing-preview.jpg)

## Development

Use Node.js 24.

```sh
npm ci
npm run dev
```

Run `npm run verify` for formatting, lint, tests, TypeScript and the production build.
Use `npm run format` or `npm run lint:fix` to apply fixes.

Regenerate the sharing image with `npm run social:image` after editing its generator in `scripts/`.

## Releases

`dev` and pull requests get Vercel previews. Merge `dev` into protected `main`
through a PR with passing CI to publish production. Use a merge commit, then
merge `origin/main` back into `dev` before starting the next change.

Vercel runs the same verification before publishing. To roll back, restore the
previous production deployment in Vercel, then submit a Git revert PR through
`dev` so the repository matches the restored version.

## Contact form

Copy `.env.example` to `.env.local` and set `VITE_FORMSPREE_FORM_ID` for local use.
In Vercel, set this public Formspree ID for **Production only**. Leave it unset
in previews; those show the direct-email alternative.

[Asset credits](docs/credits.md)
