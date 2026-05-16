---
name: Smart Waste Management System
colors:
  surface: '#11131a'
  surface-dim: '#11131a'
  surface-bright: '#373941'
  surface-container-lowest: '#0c0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d1f27'
  surface-container-high: '#282a31'
  surface-container-highest: '#32343c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c3c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8d90a0'
  outline-variant: '#434654'
  surface-tint: '#b2c5ff'
  primary: '#b2c5ff'
  on-primary: '#002b73'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#0c56d0'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#ffb59b'
  on-tertiary: '#5b1a00'
  tertiary-container: '#a33500'
  on-tertiary-container: '#ffc6b2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#11131a'
  on-background: '#e1e2ec'
  surface-variant: '#32343c'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-data:
    fontFamily: monospace
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The visual identity of this design system is rooted in the "Mission Control" aesthetic—a high-utility, authoritative environment designed for oversight of critical urban infrastructure. It targets municipal stakeholders, logistics managers, and sanitation engineers who require immediate situational awareness.

The style is **Corporate Modern** with a focus on data density. It prioritizes functionality over flourish, utilizing a systematic approach to information architecture. The emotional response is one of reliability and precision; the interface should feel like a sophisticated tool that empowers users to manage complex real-time logistics with confidence. By balancing deep slate neutrals with high-visibility semantic accents, the design system ensures that critical alerts are never missed while maintaining a professional, calm atmosphere for daily operations.

## Colors

The color palette is engineered for a multi-layered information hierarchy. The **Primary Corporate Blue** (#0052CC) serves as the anchor for navigation and primary actions, providing a sense of institutional stability. 

A rigorous **Severity Accent** system is implemented to categorize bin levels, fleet alerts, and route disruptions. These colors are reserved strictly for status communication to prevent visual fatigue. 
- **Critical (#DC2626)** is used for immediate hardware failures or overflow states.
- **High (#EA580C)** signals 90%+ capacity or missed pickups.
- **Medium (#D97706)** indicates scheduled maintenance or nearing capacity.
- **Low (#0D9488)** and **Success (#16A34A)** denote healthy operational states.

In **Dark Mode**, the background utilizes the deepest slates to reduce glare for night-shift dispatchers. In **Light Mode**, cool grays provide a crisp, clean environment for office-based administrative work.

## Typography

This design system utilizes **Inter** for all UI elements due to its exceptional legibility in data-heavy environments. The hierarchy is tight and optimized for screens where vertical space is at a premium.

For tabular data and sensor readings, a monospace alternative should be used for numerals to ensure tabular alignment and rapid scanning of coordinates or bin IDs. Headlines use a tighter letter-spacing to maintain a modern, "smart city" aesthetic, while labels and small captions use increased tracking to ensure readability at 12px or smaller. Bold weights are reserved for high-level summaries and critical alerts.

## Layout & Spacing

The layout follows a **12-column fluid grid** system designed to adapt from expansive command-center monitors to rugged tablets in the field. A strict **4px/8px baseline grid** ensures vertical rhythm.

Information is grouped into logical clusters. In the Dashboard view, the layout should maximize horizontal space to accommodate maps and side-by-side data tables. Margins are kept at a standard 24px on desktop to provide a professional frame, while internal gutters are 16px to maintain high data density without feeling cluttered.

## Elevation & Depth

To maintain a sophisticated mission-control feel, this design system uses **Tonal Layering** supplemented by subtle ambient shadows. 

- **Surface Level 0 (Base):** The darkest/lightest neutral, used for the main application background.
- **Surface Level 1 (Cards/Panels):** A slightly elevated tone with a subtle 1px border.
- **Surface Level 2 (Modals/Popovers):** Uses a soft, diffused shadow (0px 4px 12px rgba(0, 0, 0, 0.1)) to indicate a clear shift in the focus of the user.

In Dark Mode, elevation is communicated primarily through lighter surface fills rather than shadows to prevent "glow" effects. High-contrast outlines are used on interactive elements to satisfy WCAG 2.1 accessibility standards.

## Shapes

The shape language is professional and balanced. All primary containers, buttons, and input fields utilize an **8px (0.5rem) corner radius**. This provides a modern, approachable feel while remaining structured enough for an enterprise environment. 

Smaller elements like status chips or tag indicators may use a more pronounced "pill" shape (rounded-full) to distinguish them from actionable buttons. Maps and data visualization containers should strictly adhere to the 8px radius to maintain system-wide consistency.

## Components

### Buttons & Navigation
- **Primary:** Solid #0052CC background with white text. High-contrast hover states.
- **Secondary:** Outlined with a 1px slate border for secondary actions.
- **Tertiary:** Ghost buttons for navigation and low-priority adjustments.

### Status Indicators (Chips)
- Compact labels with a light tinted background and dark text (e.g., Critical uses Red-100 background with Red-600 text in light mode).
- Include a 6px status dot for rapid color recognition.

### Data Tables
- Condensed row heights (32px-40px).
- Sticky headers for long scrolls.
- Alternating row stripes (zebra striping) for improved tracking across wide screens.

### Input Fields
- Clear focus rings using the Primary Blue (#0052CC).
- Error states must include both a red border (#DC2626) and an icon for accessibility.

### Cards
- Subtle elevation with a refined 1px border.
- Grouping related metrics (e.g., "Bin Capacity" and "Last Picked Up") within a single card to maximize information density.

### Map Overlays
- Semi-transparent (85% opacity) panels that "float" over the map interface with the 8px roundedness and Level 2 elevation.