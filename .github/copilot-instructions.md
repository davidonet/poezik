# GitHub Copilot Instructions

This project uses Svelte 5 with the runes API and Tailwind CSS for styling.

For Tailwind CSS usage:

- Use utility classes directly in your HTML/Svelte markup
- Prefer utility classes over custom CSS when possible
- Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:, 2xl:) for responsive design
- Leverage Tailwind's color palette and spacing scale
- Use arbitrary values sparingly: `w-[123px]` only when standard utilities don't suffice

When generating code, please use:

- $state for reactive variables
- $derived for computed values
- $effect for side effects
- $props for component props
- {@render children()} for rendering slots/snippets

Do not use Svelte 4 syntax like:

- $: for reactive declarations
- export let for props
- onMount/onDestroy lifecycle hooks
- <slot />

Thank you!
