Simple filters are suported by the backend as follows:
Simple filtering
   Uses parameters, field[op]=value, with a match={all|any} parameter to "and" or "or" all together.
   valid op values for strings are: contains, doesNotcontain, eq, ne, startsWith, endsWith, isEmpty, isNotEmpty
   valid op values for numbers are: eq, ne, gt, gte, lt, lte
   valid op values for dates, times and timestamps are: eq, ne, gt, gte, lt, lte
   Example: GET /api/v1/properties?registration[contains]=454123-000&firstDate[ge]=20260202&match=all

---

Properties have lots of fields and related tables, since it is very large, we need to implement separate desktop and mobile versions of the view/edit forms. The forms will have view and edit modes, depending on the user role, ADMIN role is required to edit.
In view mode

tags,
images,
observations
AppraisalValue


Property:
- id, matricula, assetType (INMUEBLE/VEHICULO), status, area, currency
Location (cascading)
- province, canton, district (province → canton → district)
Auction (related)
- firstAuctionDate, firstAuctionTime, firstAuctionBase
- secondAuctionDate, secondAuctionTime, secondAuctionBase
- thirdAuctionDate, thirdAuctionTime, thirdAuctionBase
Legal (related)
- notes, libreDeGravamenes (boolean)
- gravamenes/servidumbres: list items (type, description, reference, createdAt)
Edict linkage (related)
- rawEdict: reference, caseNumber, publication, publicationCount
- bulletin: year, volume, url
Tags (related)
- tags: array of (id, name, color)
Activity (related)
- activityLog: list (timestamp, user, action, diff summary)
Media (optional)
- attachments/photos: list

PropertyForm (view + edit modes)
- Supports “view mode” (read-only fields) and “edit mode” (editable inputs).
- Edit toggle, Save, Cancel are already handled outside; your form must expose:
  - current values
  - validation errors
  - dirty-state (isDirty)
  - a submit handler callback
  - a reset/cancel handler
- Use React Hook Form + Zod (preferred) OR a lightweight custom validator if the app already standardizes differently. Follow existing project conventions.

2) Desktop form UX (form content only)
- Form is split into sections (these are NOT global navigation tabs; treat as form sections):
  - General
  - Location
  - Auction
  - Legal
  - Financial (if applicable; otherwise omit)
  - Tags
  - Edict
  - Media (optional)
  - Notes
  - Activity (read-only list)
- Each section:
  - Has a heading, optional description, and a compact two-column grid layout on desktop.
  - Uses consistent label alignment, helper text, and error messages.
  - Long text uses full width (one-column).
  - Sub-panels may be collapsible (e.g., 2nd/3rd auction, long gravamen list).

3) Mobile form UX (form content only)
- Single-column layout.
- Sections displayed as accordion panels OR a segmented control (choose the better fit).
- Keep form completion manageable: show “General” first, then “Auction”, “Location”, “Legal”, etc.
- Ensure inputs are touch-friendly, with adequate spacing and large hit targets.
- Keep validation messages short; avoid clutter.

Relations UX rules (CRITICAL)
- Do NOT inline complex related “sub-forms” inside the main form.
- For related entities, the form should show:
  - A compact summary block inside the section (read-only fields + key values).
  - “Open…” buttons that trigger existing drawers/modals (already implemented elsewhere).
- Specifically:
  - Tags section: show chips + “Manage tags” button (opens existing tag manager drawer/modal).
  - Edict section: show key fields + “Open edict details” and “View raw edict text” buttons.
  - Gravámenes/Servidumbres: show a compact list/table with add/edit/remove in edit mode ONLY if your project already supports list editing. Otherwise show list with “Manage…” button.
  - Activity: read-only list preview; “View all” link handled elsewhere.

Validation + dirty state
- Validate:
  - numeric fields (area, auction bases) accept formatted input but store normalized strings/numbers per existing backend convention.
  - dates in YYYY-MM-DD and time in HH:mm (24h).
  - province/canton/district required only when applicable (define rules clearly).
- Dirty-state:
  - Track dirty fields and expose isDirty.
  - If province changes, reset canton/district; show a non-blocking warning inline (e.g., “Changing province resets canton/district”).
- Error handling:
  - Inline field errors under inputs.
  - Section-level error summary at top of the section if multiple errors.

Form components to implement (minimum)
- <PropertyForm /> (main orchestrator)
- <SectionGeneral />
- <SectionLocation /> (cascading selects)
- <SectionAuction /> (1st/2nd/3rd auction panels)
- <SectionLegal /> (notes, flags, gravamen list summary/actions)
- <SectionTags /> (chips + manage action)
- <SectionEdict /> (summary + open actions)
- <SectionMedia /> (summary + open actions) [optional]
- <SectionActivity /> (read-only preview)

Implementation constraints
- Use existing UI primitives in the project (Inputs, Selects, Date/Time pickers, Buttons, Chips, Table, Accordion) — do NOT introduce a new design system.
- Use Tailwind utility classes only; respect existing theme tokens/classes.
- Keep spacing compact (enterprise admin style) while preserving accessibility (focus rings, labels, aria).
- Avoid heavy re-renders: memoize sections; avoid watching the entire form when only one field is needed.

Output format
- First, a brief design spec describing each section and its fields (desktop + mobile behavior).
- Then, output code with file paths before each block, ONLY for the form components (no app shell, no routing, no layout).
- Include:
  - Zod schema (or equivalent)
  - Default values mapping from a provided Property object
  - Example usage snippet showing how a parent page would render <PropertyForm /> and pass handlers (but do NOT modify the page).

Deliverable
- Provide complete, production-ready form components implementing the above UX.
- Do not implement navigation, drawers/modals, or pages—assume they already exist and just call their open handlers via props.
