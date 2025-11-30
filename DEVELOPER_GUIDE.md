# Developer Guide - AI Image Generator

This guide is for developers who want to understand, modify, or extend the codebase.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Code Structure](#code-structure)
- [Key Components Deep Dive](#key-components-deep-dive)
- [API Implementation](#api-implementation)
- [State Management](#state-management)
- [Styling System](#styling-system)
- [Extending the Application](#extending-the-application)
- [Best Practices](#best-practices)

---

## 🏗️ Architecture Overview

### Tech Stack

```
Frontend:
├── Next.js 14 (App Router)
├── React 18 (Client Components)
├── TypeScript 5
├── Tailwind CSS 4
└── Framer Motion 12

Backend:
├── Next.js API Routes (Edge Runtime)
├── OpenAI SDK 4.28
└── Next.js Server Actions (if needed)

UI Components:
├── shadcn/ui (Radix UI primitives)
├── Lucide React (Icons)
└── Custom components
```

### Design Patterns

1. **Component Composition**: Small, focused components
2. **Props Drilling**: State lifted to page component
3. **API Routes**: Server-side endpoints for external APIs
4. **Error Boundaries**: Try-catch at multiple levels
5. **Type Safety**: Full TypeScript coverage

---

## 📁 Code Structure

### Directory Layout

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── generate/
│   │   │   └── route.ts         # POST handler for image generation
│   │   └── download/
│   │       └── route.ts         # GET handler for image proxy
│   ├── page.tsx                 # Main page (Client Component)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/
│   ├── image-generator/         # Feature-specific components
│   │   ├── PromptInput.tsx      # Text input with validation
│   │   ├── ImageGrid.tsx        # Responsive grid layout
│   │   ├── ImageCard.tsx        # Individual image display
│   │   ├── ImageViewer.tsx      # Fullscreen modal viewer
│   │   ├── DownloadDialog.tsx   # Confirmation dialog
│   │   └── ErrorDisplay.tsx     # Error message component
│   └── ui/                      # Reusable UI primitives
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ...
│
└── lib/
    └── utils.ts                 # Utility functions (cn, etc.)
```

### File Naming Conventions

- **Components**: PascalCase (`ImageCard.tsx`)
- **Utilities**: camelCase (`utils.ts`)
- **API Routes**: lowercase (`route.ts`)
- **Types**: PascalCase interfaces (`GeneratedImage`)

---

## 🔍 Key Components Deep Dive

### 1. Main Page (`src/app/page.tsx`)

**Purpose**: Orchestrates the entire application state and UI.

**Key Responsibilities:**
- State management for all application data
- API communication
- Event handling
- Component composition

**State Structure:**
```typescript
interface AppState {
  prompt: string;                    // User input
  images: GeneratedImage[];          // Generated images
  loading: boolean;                  // Loading state
  selectedImage: GeneratedImage | null; // Selected image
  error: string | null;              // Error message
  downloadDialogOpen: boolean;       // Dialog state
  imageToDownload: string | null;    // Image URL to download
  showWelcome: boolean;              // Welcome screen state
}
```

**Key Functions:**

```typescript
// Generates images via API
async function generateImages() {
  // 1. Validate prompt
  // 2. Set loading state
  // 3. Call API endpoint
  // 4. Handle response/errors
  // 5. Update state
}

// Handles download initiation
function handleDownloadClick(url: string, event: MouseEvent) {
  // Prevents event bubbling
  // Opens download dialog
}

// Confirms and executes download
async function handleDownloadConfirm() {
  // Uses proxy endpoint to download
  // Handles errors
}
```

**Component Tree:**
```
Home
├── AnimatePresence (Welcome Screen)
├── PromptInput
├── ErrorDisplay
├── ImageGrid
│   └── ImageCard[] (x4)
│       └── ImageViewer (on click)
└── DownloadDialog
```

### 2. API Route (`src/app/api/generate/route.ts`)

**Purpose**: Server-side endpoint that communicates with OpenAI API.

**Configuration:**
```typescript
export const runtime = "edge";        // Edge runtime for speed
export const maxDuration = 60;        // 60 second timeout
export const dynamic = "force-dynamic"; // Always dynamic
```

**Request Flow:**
```
1. Receive POST request with { prompt }
2. Validate prompt exists
3. Check OPENAI_API_KEY is set
4. Call OpenAI API
5. Transform response
6. Return JSON
```

**Error Handling:**
- Content policy violations → 400
- Rate limits → 429
- Timeouts → 504
- API errors → 500
- Generic errors → 500

**Response Transformation:**
```typescript
// OpenAI Response
{
  data: [
    { url: "...", revised_prompt: "..." },
    ...
  ]
}

// Our Response
{
  images: [
    { url: "...", revised_prompt: "..." },
    ...
  ]
}
```

### 3. PromptInput Component

**Features:**
- Controlled input (React pattern)
- Enter key submission
- Loading state (disabled)
- Placeholder examples

**Props Interface:**
```typescript
interface PromptInputProps {
  prompt: string;
  loading: boolean;
  onPromptChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}
```

**Implementation Notes:**
- Uses shadcn Input component
- Handles keyboard events (Enter key)
- Shows loading state visually

### 4. ImageGrid Component

**Responsive Grid:**
```typescript
// Tailwind classes for responsive grid
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
// 1 column on mobile
// 2 columns on tablet
// 4 columns on desktop
```

**Loading State:**
- Shows skeleton loaders
- Uses shadcn Skeleton component
- Maintains grid layout

**Empty State:**
- Shows message when no images
- Provides user guidance

### 5. ImageCard Component

**Features:**
- Image display with loading state
- Selection highlighting
- Download button
- Fullscreen button
- Hover effects

**Event Handling:**
```typescript
// Prevents event bubbling
onClick={(e) => {
  e.stopPropagation();
  onDownload(image.url, e);
}}
```

### 6. ImageViewer Component

**Fullscreen Modal:**
- Uses Radix UI Dialog
- Keyboard navigation (ESC to close)
- Zoom functionality
- Pan when zoomed

**Zoom Implementation:**
- State: `zoom` (number)
- Controls: zoom in/out buttons
- Transform: CSS `scale()`

---

## 🔌 API Implementation

### Generate Endpoint

**File**: `src/app/api/generate/route.ts`

**Method**: POST

**Request Body:**
```typescript
{
  prompt: string;
}
```

**Response:**
```typescript
// Success (200)
{
  images: Array<{
    url: string;
    revised_prompt?: string;
  }>;
}

// Error (4xx/5xx)
{
  error: string;
  details?: string;
}
```

**OpenAI Configuration:**
```typescript
{
  model: "dall-e-2",
  prompt: string,
  n: 4,                    // Number of images
  size: "1024x1024",       // Image dimensions
  quality: "standard",     // "standard" | "hd"
  style: "vivid",          // "vivid" | "natural"
  response_format: "url",  // "url" | "b64_json"
}
```

**Error Codes:**
- `content_policy_violation` → 400
- `rate_limit_exceeded` → 429
- `timeout` → 504
- Other API errors → 500

### Download Endpoint

**File**: `src/app/api/download/route.ts`

**Method**: GET

**Query Parameters:**
- `url`: Encoded image URL

**Response:**
- Binary image data
- Headers:
  - `Content-Type`: image/png (or original)
  - `Content-Disposition`: attachment

**Purpose:**
- Proxies image download
- Avoids CORS issues
- Provides consistent filename

---

## 🎨 State Management

### State Flow

```
User Input
    ↓
PromptInput (controlled input)
    ↓
page.tsx state (prompt)
    ↓
generateImages() function
    ↓
API call (/api/generate)
    ↓
Response handling
    ↓
State update (images)
    ↓
ImageGrid re-render
    ↓
ImageCard components display
```

### State Updates

**Loading State:**
```typescript
setLoading(true);  // Start
// ... API call ...
setLoading(false); // End (in finally block)
```

**Error Handling:**
```typescript
try {
  // API call
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
```

**Image Selection:**
```typescript
// Single selection pattern
const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

// Toggle selection
onClick={() => {
  setSelectedImage(
    selectedImage?.url === image.url ? null : image
  );
}}
```

---

## 🎨 Styling System

### Tailwind CSS

**Configuration**: `tailwind.config.ts`

**Custom Colors:**
- Gradient backgrounds
- Custom color palette
- Dark mode support

**Responsive Breakpoints:**
```typescript
sm: '640px'   // Small devices
md: '768px'   // Tablets
lg: '1024px'  // Desktops
xl: '1280px'  // Large desktops
```

### Component Styling

**Pattern:**
```typescript
// Utility classes
className="flex items-center justify-center"

// Conditional classes
className={cn(
  "base-classes",
  condition && "conditional-classes"
)}
```

**Gradients:**
```typescript
// Text gradient
className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"

// Background gradient
className="bg-gradient-to-b from-gray-900 to-gray-800"
```

### Animations

**Framer Motion:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
```

**Common Patterns:**
- Fade in/out
- Slide up/down
- Scale animations
- Stagger children

---

## 🚀 Extending the Application

### Adding New Features

#### 1. Image Filters/Effects

**Location**: `src/components/image-generator/ImageCard.tsx`

**Implementation:**
```typescript
// Add filter state
const [filter, setFilter] = useState<string>('none');

// Apply CSS filter
<img
  src={image.url}
  style={{ filter }}
  className="..."
/>

// Filter selector
<select onChange={(e) => setFilter(e.target.value)}>
  <option value="none">None</option>
  <option value="grayscale(100%)">Grayscale</option>
  <option value="sepia(100%)">Sepia</option>
</select>
```

#### 2. Image History

**Location**: `src/app/page.tsx`

**Implementation:**
```typescript
// Add history state
const [history, setHistory] = useState<GeneratedImage[][]>([]);

// Save to history after generation
useEffect(() => {
  if (images.length > 0) {
    setHistory(prev => [...prev, images]);
  }
}, [images]);

// History component
<HistoryPanel history={history} onSelect={setImages} />
```

#### 3. Prompt Templates

**Location**: `src/components/image-generator/PromptInput.tsx`

**Implementation:**
```typescript
const templates = [
  "A beautiful sunset over mountains",
  "Futuristic cityscape at night",
  // ...
];

<select onChange={(e) => setPrompt(e.target.value)}>
  {templates.map(t => (
    <option key={t} value={t}>{t}</option>
  ))}
</select>
```

#### 4. Batch Generation

**Location**: `src/app/api/generate/route.ts`

**Implementation:**
```typescript
// Accept multiple prompts
const { prompts } = await request.json();

// Generate in parallel
const results = await Promise.all(
  prompts.map(prompt => 
    openai.images.generate({ prompt, ... })
  )
);

// Return combined results
return NextResponse.json({ 
  images: results.flatMap(r => r.data) 
});
```

#### 5. Image Variations

**Location**: `src/app/api/generate/route.ts`

**Implementation:**
```typescript
// New endpoint: /api/variations
const { image_url } = await request.json();

const response = await openai.images.createVariation({
  image: image_url,
  n: 4,
  size: "1024x1024",
});
```

### Modifying API Configuration

**File**: `src/app/api/generate/route.ts`

**Change Model:**
```typescript
// Switch to DALL-E 3
model: "dall-e-3",
size: "1024x1024", // or "1792x1024", "1024x1792"
quality: "hd",     // or "standard"
```

**Change Image Count:**
```typescript
n: 1, // DALL-E 3 only supports 1 image
```

**Change Size:**
```typescript
size: "512x512", // Smaller, faster, cheaper
```

### Adding Authentication

**Implementation:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const token = request.headers.get('authorization');
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Verify token
  // ...
}

export const config = {
  matcher: '/api/:path*',
};
```

---

## ✅ Best Practices

### Code Organization

1. **Component Size**: Keep components under 200 lines
2. **Single Responsibility**: One component, one purpose
3. **Prop Types**: Always define TypeScript interfaces
4. **Error Handling**: Handle errors at appropriate levels

### Performance

1. **Image Optimization**: Use Next.js Image component (if needed)
2. **Lazy Loading**: Load images as needed
3. **Memoization**: Use `useMemo` for expensive calculations
4. **Code Splitting**: Dynamic imports for heavy components

### Security

1. **API Keys**: Never expose in client code
2. **Input Validation**: Validate all user inputs
3. **Error Messages**: Don't leak sensitive information
4. **Rate Limiting**: Implement rate limiting (if needed)

### Accessibility

1. **ARIA Labels**: Add labels to interactive elements
2. **Keyboard Navigation**: Support keyboard shortcuts
3. **Focus Management**: Manage focus in modals
4. **Color Contrast**: Ensure sufficient contrast

### Testing

**Recommended Tests:**
```typescript
// Component tests
describe('PromptInput', () => {
  it('calls onGenerate on Enter key', () => {
    // ...
  });
});

// API tests
describe('POST /api/generate', () => {
  it('returns images on valid prompt', async () => {
    // ...
  });
});
```

---

## 🔧 Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Debugging

**Browser DevTools:**
- Console: Check for errors
- Network: Monitor API calls
- React DevTools: Inspect component state

**Server Logs:**
- Check terminal output
- Add `console.log()` for debugging
- Use `console.error()` for errors

**TypeScript:**
- Check editor for type errors
- Run `npx tsc --noEmit` to check types

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

**Happy Coding! 🚀**

