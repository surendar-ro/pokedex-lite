# Pokedex Lite

A premium, responsive "Pokedex Lite" web application built for the Frontend Developer Assignment using Next.js, fulfilling all mandatory data-fetching, searching, pagination, and favorites requirements, alongside several bonus features.

## Live Demo
**[Insert your Vercel/Netlify URL here once deployed]**

## Required Features Completed
- **Data Fetching:** Pulls directly from the public PokéAPI endpoints.
- **Listing & Basic UI:** Premium responsive grid that adapts across Mobile, Tablet, and Desktop displays.
- **Search:** Real-time client-side search indexing that filters Pokemon instantly as you type.
- **Filtering by Type:** Refines the list display based on selected type matches (e.g., Fire, Water).
- **Pagination:** Smooth "Load More" functionality appends Pokemon to the list to limit initial payloads.
- **Favorites locally persisted:** "Heart" your favorite Pokémon; saved reliably via LocalStorage to survive page refreshes.
- **Detail View:** SSR-optimized routed pages for deeper stats (Abilities, Base stats with interactive level bars).

## Bonus Features
- **Animations:** Fully driven by `framer-motion` for staggered list appearances and fluid UI micro-interactions.
- **Server Side Rendering (SSR):** Harnessing Next.js App Router for concurrent data pre-fetching and detail view SEO.
- **Mock Authentication Engine:** Contains a demo Header login/logout flow context indicating where your actual OAuth implementation would securely tie in.

## Technical Walkthrough & Libraries Used
- **Framework - Next.js (React)**: Required for seamless SSR architectures and concurrent data fetching logic.
- **Styling - Vanilla SCSS / CSS Modules**: Built strictly without TailwindCSS. SCSS facilitates clean code via native nesting, BEM conventions, and reusable CSS variables establishing a clear Global Design System.
- **State Management - React Hooks**: Used alongside Context and native `localStorage` for responsive client updates.
- **Framer Motion**: The industry standard for complex performant gesture and hover React animations.
- **Lucide React**: For scalable SVG-based iconography.

## Challenges & Solutions
1. **Search with Pagination**: PokéAPI doesn't inherently support server-side partial name searches across the thousands of Pokémon directly out of the box with standard limit queries. 
   - *Solution*: Orchestrated an initial asynchronous background load of all 1,300+ Pokémon simple names arrays. The Search bar then filters this master client-side array instantly and queues specific `fetchDetailed` requests for only the visual subset. This guarantees instant UI response times while keeping data bandwidth extremely low.
   
2. **Hydration Mismatches with LocalStorage**: Next.js Server Side elements throw warnings when the initial rendered page data doesn't map to the client-rendered output (if they have local favorites saved).
   - *Solution*: Encapsulated all `localStorage` functions within a customized `useFavorites` hook featuring an internal `isMounted` state.

## Getting Started Locally

Use the following commands to install dependencies and run the development server locally:

```bash
# Clone the repository
git clone https://github.com/surendar-ro/pokedex-lite.git

# Enter the directory
cd pokedex-lite

# Install Dependencies
npm install

# Start the Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
