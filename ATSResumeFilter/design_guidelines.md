# Design Guidelines: ATS Filtro Application

## Design Approach

**Selected Approach:** Design System-Based (Material Design principles)
**Justification:** This is a utility-focused HR/educational tool requiring trust, clarity, and efficiency. The dual-mode interface (applicant/moderator) demands consistent, learnable patterns while maintaining professional credibility for school branding.

## Typography System

**Font Stack:**
- Primary: 'Inter' or 'DM Sans' from Google Fonts via CDN
- Fallback: system-ui, sans-serif

**Hierarchy:**
- H1 (App Title): 32px/2rem, weight 800, letter-spacing -0.02em
- H2 (Section Headers): 22px/1.375rem, weight 700
- Body Text: 16px/1rem, weight 400-500
- Small Text (Status/Helper): 14px/0.875rem, weight 400
- Button Text: 16px/1rem, weight 600-700

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24, 32
- Component padding: p-6 (24px) for cards
- Section margins: mb-8, mt-12
- Element spacing: gap-4, space-y-6
- Container max-width: max-w-2xl (672px) for forms

**Grid Structure:**
- Single column layout centered on viewport
- Cards with consistent 16px border-radius
- Generous whitespace between major sections (mb-12 to mb-16)

## Component Library

### Core Components

**1. Application Header**
- Logo/branding centered at top
- Fallback to initials badge (80px circle) if image fails
- App title directly below logo
- Total header height: ~140px with spacing

**2. Card Containers**
- Elevated cards with subtle shadow (0 10px 25px rgba(0,0,0,0.08))
- Rounded corners: 16px border-radius
- Internal padding: 24px (p-6)
- Max width: 640px for primary content, 420px for modal-style dialogs

**3. File Upload Zone**
- Large drop zone: minimum 120px height
- Dashed border (2px) indicating interactivity
- Icon above text (Upload icon, 24px size)
- Hover state: slightly elevated, border style change
- Center-aligned content with generous padding (p-6)

**4. Image Preview**
- Contained within card flow
- Max height: 380px with object-fit contain
- Rounded corners: 12px
- Subtle shadow for depth
- Smooth fade-in animation (0.3s)

**5. Form Elements**

*Text Input/Password:*
- Full width within container
- Height: 48px (p-3)
- Border: 1px solid with 8px border-radius
- Clear focus states (ring or border change)

*Textarea:*
- Full width, 6 rows minimum for job descriptions
- Padding: 12px
- Border: 1px solid with 8px border-radius

*Primary Buttons:*
- Full width within cards
- Height: 48px (py-3 px-4)
- Border-radius: 10px
- Weight 700 text
- Smooth transitions on interaction (0.15s)

**6. Icon Buttons**
- Small, minimalist (24-32px touch target)
- No background by default
- Positioned in card headers (absolute right or flex end)
- Help icon and logout icon styles

**7. Status Messages**
- Small text (14px)
- Positioned below action buttons
- Margin top: 16px
- Left-aligned for readability

### Navigation & Flow

**State Management Display:**
- Three distinct states: Applicant View, Password Prompt, Moderator View
- Single view displayed at a time (conditional rendering)
- Smooth transitions between states (fade in/out 0.2s)

**Access Toggle:**
- Help circle icon button in applicant view header (top right)
- Logout icon button in moderator view header (top right)

## Animations

**Use sparingly - only where functional:**
- Initial page load: Header fade-in from top (-20px to 0), 0.3s
- Image preview: Fade-in opacity transition, 0.3s
- State transitions: Cross-fade between views, 0.2s
- NO hover animations, NO scroll effects, NO decorative motion

## Layout Details

### Applicant View Structure
1. Centered header (logo + title) - mb-8
2. Upload card containing:
   - Section header with action icon
   - Drop zone
   - Conditional preview image
   - Conditional submit button
   - Conditional status message

### Password Prompt Structure
1. Smaller centered card (max-w-md)
2. Tight vertical spacing (gap-4)
3. Header, input, button flow

### Moderator View Structure
1. Header with logout action
2. Textarea for job description (larger, prominent)
3. Publish button
4. Clear visual distinction from applicant mode

## Accessibility

- Maintain consistent 48px minimum touch targets for all interactive elements
- Proper label associations for file inputs (visually hidden label, clickable zone)
- Clear focus indicators on all form fields (2px ring or border change)
- Adequate contrast ratios throughout (will be verified with color implementation)
- Semantic HTML structure with proper heading hierarchy

## Branding Integration

**Logo Placement:**
- Centered at top of page, 80x80px
- 8px margin below image
- Graceful fallback to circular badge with initials "SR"
- Badge styling: same dimensions, centered text, weight 700

**Visual Consistency:**
- Professional gradient backgrounds (subtle, non-distracting)
- Consistent card elevation creates hierarchy
- Clean, trustworthy aesthetic appropriate for educational institution

## Key Design Principles

1. **Clarity Over Decoration:** Every element serves a functional purpose
2. **Generous Whitespace:** Breathing room between sections enhances readability
3. **Predictable Interactions:** Standard patterns for uploads, forms, authentication
4. **Trust Through Polish:** Subtle shadows, smooth transitions, professional typography build credibility
5. **Mobile-First Considerations:** While desktop-optimized, ensure touch targets and spacing work on smaller viewports

## Component-Specific Notes

**File Upload Flow:**
- Clear visual feedback at each stage (empty → file selected → preview shown → uploaded)
- Disable submit until file selected
- Replace preview and reset state after successful upload

**Password Protection:**
- Simple, focused modal-style card
- Minimal distraction from authentication task
- Clear error messaging for incorrect passwords

**Job Offer Publishing:**
- Textarea dominates the interface (primary task)
- Single action button (publish)
- Confirmation after successful publish

This design creates a professional, trustworthy interface that prioritizes usability and clarity while maintaining visual polish appropriate for an educational institution's recruitment tool.