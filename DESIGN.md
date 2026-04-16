# Design Brief

## Tone
Dark professional SaaS with bold, tech-forward aesthetic. Premium minimalism—zero clutter, selective use of color for emphasis. Conveys trust, efficiency, and creative power.

## Color Palette

| Token | Light | Dark |
| --- | --- | --- |
| Background | 0.98 0 0 (near-white) | 0.08 0 0 (near-black) |
| Foreground | 0.15 0 0 (dark grey) | 0.95 0 0 (near-white) |
| Primary (Deep Purple) | 0.55 0.18 290 | 0.68 0.2 290 |
| Accent (Electric Blue) | 0.58 0.2 255 | 0.65 0.22 255 |
| Success (Green) | 0.55 0.19 142 | 0.68 0.21 142 |
| Card | 0.995 0 0 (light) | 0.13 0 0 (dark card) |
| Border | 0.88 0.01 0 (light grey) | 0.22 0.01 0 (dark grey) |
| Destructive | 0.55 0.22 25 (red/orange) | 0.65 0.19 22 |

## Typography
Display: **Space Grotesk** (geometric, tech-forward, distinctive). Body: **system-ui** (clean, legible). Mono: **JetBrains Mono** (code-friendly).

## Structural Zones
- **Header**: `bg-card` with subtle `border-b`, navigation. Logo with primary accent.
- **Main Content**: `bg-background`, card-based layout with `bg-card` sections. Video generation form centered with gradient button.
- **Analytics Widget**: Card-grid showing total views, watch time, completion % with chart colors. Per-video stats on detail page.
- **Social Share Zone**: Monospace URL field with copy-to-clipboard button, feedback badge on success.
- **YouTube Publish**: OAuth status badge (disconnected/connected), publish form modal with `shadow-elevated`, publish status indicator on video cards.
- **Footer**: Minimal, `bg-card` with `border-t`.

## Shape Language
Radii: `rounded-lg` (10px default), `sm` (6px for badges/inputs), `full` for pill badges. Shadows: `shadow-card` for elevation, `shadow-elevated` for modals. No blur or glassmorphism.

## Accent Usage
Deep purple for primary CTAs (Generate, Publish, Copy). Electric blue for highlights, progress indicators, hover states. Success green for publish confirmations, share feedback. Gradient (purple→blue) on hero buttons only.

## Motion & Interaction
Fade-in on page load (`animate-fade-in`). Button hover: scale and shadow via smooth transitions. Progress pulse on generation. Success feedback: badge scale + color shift on "Copied!" or "Published!".

## New Feature Patterns
- **Share Widget**: Monospace URL display, primary-colored copy button, success badge feedback.
- **Analytics Cards**: Large metric value (display font, 1.875rem), uppercase label (muted, 0.875rem), background `muted/30` for subtle depth.
- **YouTube Status**: Pill-shaped badge showing channel name or "Connect YouTube". Green for published, grey for pending. No animation on status—static clarity.
- **Publish Modal**: Elevated shadow, card background, form fields with input tokens, submit button uses gradient accent.

## Constraints
- No rainbow gradients, no neon glow.
- Accent gradients reserved for CTAs only.
- Success token used for confirmations and positive state feedback.
- All interactive elements respond to pointer with opacity or color shift, never scale.
- Status badges are read-only indicators—no animation.

## Signature Detail
Gradient-accent button on video generation form. Social share "Copied!" badge shifts to success green. YouTube publish modal presents as elevated card with smooth entrance animation.
