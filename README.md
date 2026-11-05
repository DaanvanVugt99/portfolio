# Daan van Vugt — Portfolio

My personal portfolio, built with React, TypeScript, Vite, Tailwind CSS, and Three.js.

![Portfolio preview](docs/landing-preview.jpg)

## Development

```sh
npm ci
npm run dev
```

## Checks

```sh
npm run lint
npm run format:check
npm test
npm run build
```

Run `npm run format` to format the project, or `npm run lint:fix` to apply automatic lint fixes.

## Contact form

Create a form in [Formspree](https://formspree.io), verify the recipient email, and
enable email notifications. Copy `.env.example` to `.env.local` and set
`VITE_FORMSPREE_FORM_ID` to its public form ID, then restart Vite. Use Formspree's
spam filtering with CAPTCHA disabled; the form also includes a honeypot.
Until configured, visitors can use the direct email link.

[Asset credits](docs/credits.md)
