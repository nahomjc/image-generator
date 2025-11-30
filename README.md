# AI Image Generator - Complete Documentation

A modern, full-featured web application built with Next.js 14 and TypeScript that generates stunning images using OpenAI's DALL-E 2 API. This project provides an intuitive interface for creating AI-generated images with a beautiful, responsive design.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started (For Beginners)](#getting-started-for-beginners)
- [Project Architecture (For Professionals)](#project-architecture-for-professionals)
- [How to Generate Images](#how-to-generate-images)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

This AI Image Generator is a Next.js application that leverages OpenAI's DALL-E 2 API to create high-quality images from text descriptions. The application features:

- **Modern UI/UX**: Beautiful gradient design with smooth animations
- **Real-time Generation**: Generate up to 4 images simultaneously
- **Image Management**: View, select, download, and zoom images
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

---

## ✨ Features

- 🎨 **AI-Powered Image Generation** - Create images using DALL-E 2
- 🖼️ **Multiple Image Generation** - Generate 4 images per request
- 📥 **Image Download** - Download generated images with one click
- 🔍 **Fullscreen Viewer** - View images in fullscreen with zoom capabilities
- ⚡ **Fast Performance** - Optimized with Next.js Edge Runtime
- 🎭 **Beautiful Animations** - Smooth transitions using Framer Motion
- 🛡️ **Error Handling** - Comprehensive error messages and validation
- 📱 **Responsive Design** - Works on all screen sizes
- 🎯 **Welcome Screen** - Animated welcome screen on first visit

---

## 🚀 Getting Started (For Beginners)

### Step 1: Prerequisites

Before you begin, make sure you have:

1. **Node.js** installed (version 18.0 or later)
   - Download from: https://nodejs.org/
   - Verify installation: Open terminal/command prompt and run `node --version`

2. **npm** or **yarn** package manager
   - npm comes with Node.js
   - Verify: Run `npm --version` in terminal

3. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Get your API key from: https://platform.openai.com/api-keys
   - ⚠️ **Important**: Keep your API key secret and never share it publicly

### Step 2: Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd image-generator
   ```
   
   Or if you downloaded a ZIP file, extract it and navigate to the folder.

2. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install all required packages. Wait for it to complete (may take 1-2 minutes).

3. **Create environment file**
   - Create a new file named `.env.local` in the root directory (same folder as `package.json`)
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your-api-key-here
     ```
   - Replace `your-api-key-here` with your actual OpenAI API key
   - ⚠️ **Never commit this file to version control!**

### Step 3: Run the Application

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to: http://localhost:3000
   - You should see the welcome screen

3. **You're ready!** Start generating images (see [How to Generate Images](#how-to-generate-images) below)

---

## 🏗️ Project Architecture (For Professionals)

### Technology Stack

- **Framework**: Next.js 14.1.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion 12.6
- **API Client**: OpenAI SDK 4.28
- **Icons**: Lucide React

### Project Structure

```
image-generator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── generate/      # Image generation endpoint
│   │   │   │   └── route.ts   # POST /api/generate
│   │   │   └── download/      # Image download proxy
│   │   │       └── route.ts   # GET /api/download
│   │   ├── page.tsx           # Main page component
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── image-generator/   # Feature-specific components
│   │   │   ├── PromptInput.tsx    # Text input for prompts
│   │   │   ├── ImageGrid.tsx      # Grid display for images
│   │   │   ├── ImageCard.tsx      # Individual image card
│   │   │   ├── ImageViewer.tsx    # Fullscreen image viewer
│   │   │   ├── DownloadDialog.tsx # Download confirmation
│   │   │   └── ErrorDisplay.tsx   # Error message display
│   │   └── ui/                # Reusable UI components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   └── lib/
│       └── utils.ts           # Utility functions
├── public/                     # Static assets
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config
└── .env.local                # Environment variables (not in repo)
```

### Key Design Patterns

1. **Component-Based Architecture**: Modular, reusable React components
2. **API Routes**: Server-side API endpoints using Next.js Route Handlers
3. **Client-Server Separation**: Client components for UI, server routes for API calls
4. **Type Safety**: Full TypeScript implementation with interfaces
5. **Error Boundaries**: Comprehensive error handling at multiple levels

### Data Flow

```
User Input (Prompt)
    ↓
PromptInput Component
    ↓
generateImages() function (page.tsx)
    ↓
POST /api/generate
    ↓
OpenAI API (DALL-E 2)
    ↓
Response with image URLs
    ↓
ImageGrid Component
    ↓
ImageCard Components (display)
```

---

## 🎨 How to Generate Images

### For Beginners: Step-by-Step Guide

#### Step 1: Enter Your Prompt
1. Look for the text input box at the top of the page
2. Type a description of the image you want to create
   - **Example**: "A sunset over mountains with a lake in the foreground"
   - **Tip**: Be descriptive! More details = better results

#### Step 2: Generate Images
1. Click the **"Generate"** button (or press Enter)
2. Wait for the images to generate (usually 10-30 seconds)
3. You'll see a loading animation while waiting

#### Step 3: View Your Images
1. Four images will appear in a grid below
2. Click on any image to view it in fullscreen
3. Use the zoom controls in fullscreen mode

#### Step 4: Download Images
1. Click the **download button** (⬇️) on any image
2. Confirm the download in the dialog
3. The image will download to your default download folder

### Prompt Writing Tips

**Good Prompts:**
- ✅ "A futuristic cityscape at night with neon lights and flying cars"
- ✅ "A cute puppy playing in a garden, photorealistic style"
- ✅ "Abstract art with blue and purple gradients, minimalist design"

**Better Prompts (More Detailed):**
- ✅ "A serene Japanese garden in spring, cherry blossoms falling, soft morning light, 4K quality, photorealistic"
- ✅ "A steampunk-style mechanical owl with brass gears, Victorian era, detailed illustration, warm lighting"

**What to Avoid:**
- ❌ Very short prompts: "cat" (too vague)
- ❌ Inappropriate content (will be rejected by OpenAI)
- ❌ Copyrighted characters or brands

### Advanced Usage

**Regenerate Images:**
- After generating images, click **"Generate More Like This"** to create new variations with the same prompt

**Image Selection:**
- Click on an image to select it (highlighted border)
- Selected images can be used for future features

---

## 📡 API Documentation

### POST /api/generate

Generates images using DALL-E 2 API.

**Request:**
```typescript
POST /api/generate
Content-Type: application/json

{
  "prompt": "Your image description here"
}
```

**Response (Success):**
```typescript
{
  "images": [
    {
      "url": "https://...",
      "revised_prompt": "Enhanced version of your prompt"
    },
    // ... 3 more images
  ]
}
```

**Response (Error):**
```typescript
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing prompt or content policy violation)
- `429` - Rate limit exceeded
- `500` - Server error
- `504` - Timeout

**Configuration:**
- Model: `dall-e-2`
- Images per request: `4`
- Size: `1024x1024`
- Quality: `standard`
- Style: `vivid`
- Timeout: `60 seconds`

### GET /api/download

Proxies image download to avoid CORS issues.

**Request:**
```
GET /api/download?url=<encoded-image-url>
```

**Response:**
- Binary image data with appropriate headers
- Content-Type: `image/png` (or original type)
- Content-Disposition: `attachment; filename="generated-image.png"`

---

## 🧩 Component Documentation

### Main Page (`src/app/page.tsx`)

The main application component that orchestrates all functionality.

**State Management:**
- `prompt`: Current text input
- `images`: Array of generated images
- `loading`: Loading state
- `selectedImage`: Currently selected image
- `error`: Error message (if any)
- `downloadDialogOpen`: Download dialog visibility
- `showWelcome`: Welcome screen visibility

**Key Functions:**
- `generateImages()`: Fetches images from API
- `handleDownloadClick()`: Opens download dialog
- `handleDownloadConfirm()`: Initiates download

### PromptInput Component

Text input field for entering image prompts.

**Props:**
```typescript
interface PromptInputProps {
  prompt: string;
  loading: boolean;
  onPromptChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}
```

**Features:**
- Enter key to submit
- Disabled during loading
- Placeholder text with examples

### ImageGrid Component

Displays generated images in a responsive grid.

**Props:**
```typescript
interface ImageGridProps {
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  onSelectImage: (image: GeneratedImage | null) => void;
  onDownloadImage: (url: string, e: MouseEvent) => void;
  loading?: boolean;
}
```

**Features:**
- Responsive grid (1-4 columns based on screen size)
- Loading skeletons
- Empty state message

### ImageCard Component

Individual image card with actions.

**Features:**
- Image display with loading state
- Download button
- Fullscreen view button
- Selection highlighting
- Hover effects

### ImageViewer Component

Fullscreen image viewer with zoom.

**Features:**
- Fullscreen modal
- Zoom in/out controls
- Pan when zoomed
- Close button
- Keyboard navigation (ESC to close)

### ErrorDisplay Component

Displays error messages to users.

**Props:**
```typescript
interface ErrorDisplayProps {
  error: string | null;
}
```

**Features:**
- Animated error messages
- Auto-dismisses after display
- User-friendly error text

### DownloadDialog Component

Confirmation dialog for image downloads.

**Features:**
- Confirmation before download
- Prevents accidental downloads
- Accessible dialog component

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Important Notes:**
- Never commit `.env.local` to version control
- The file is already in `.gitignore`
- Restart the dev server after changing environment variables

### API Configuration

Edit `src/app/api/generate/route.ts` to customize:

```typescript
const response = await openai.images.generate({
  model: "dall-e-2",        // Change model version
  prompt: prompt,
  n: 4,                     // Number of images (1-10)
  size: "1024x1024",        // Options: "256x256", "512x512", "1024x1024"
  quality: "standard",      // Options: "standard", "hd"
  style: "vivid",           // Options: "vivid", "natural"
  response_format: "url",    // Options: "url", "b64_json"
});
```

**Available Sizes:**
- `256x256` - Smallest, fastest, cheapest
- `512x512` - Medium size
- `1024x1024` - Largest, best quality (current default)

**Cost Considerations:**
- DALL-E 2 pricing varies by size
- Larger images cost more
- Check OpenAI pricing: https://openai.com/pricing

### Styling Configuration

Tailwind CSS configuration is in `tailwind.config.ts`. Customize:
- Colors
- Fonts
- Spacing
- Breakpoints
- Animations

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "OpenAI API key is not configured"
**Problem:** Missing or incorrect API key

**Solution:**
- Check that `.env.local` exists in the root directory
- Verify the file contains: `OPENAI_API_KEY=sk-...`
- Make sure there are no spaces around the `=` sign
- Restart the development server after adding the key

#### 2. "Rate limit exceeded"
**Problem:** Too many requests to OpenAI API

**Solution:**
- Wait a few minutes before trying again
- Check your OpenAI account usage limits
- Consider upgrading your OpenAI plan

#### 3. "Content policy violation"
**Problem:** Prompt contains inappropriate content

**Solution:**
- Review OpenAI's usage policies: https://openai.com/policies/usage-policies
- Modify your prompt to avoid prohibited content
- Be more specific about what you want

#### 4. Images not loading
**Problem:** Images appear broken or don't display

**Solution:**
- Check your internet connection
- Verify the API response in browser DevTools (Network tab)
- Check browser console for CORS errors
- Try refreshing the page

#### 5. "Failed to download image"
**Problem:** Download button doesn't work

**Solution:**
- Check browser popup blocker settings
- Verify the image URL is still valid (OpenAI URLs expire)
- Try right-clicking the image and "Save image as..."

#### 6. Development server won't start
**Problem:** `npm run dev` fails

**Solution:**
- Make sure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Check for port conflicts (try `npm run dev -- -p 3001`)

#### 7. TypeScript errors
**Problem:** Red squiggly lines in code editor

**Solution:**
- Run `npm install` to ensure all dependencies are installed
- Restart your code editor/IDE
- Check that TypeScript version matches: `npx tsc --version`

### Debugging Tips

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Check Server Logs**
   - Look at terminal where `npm run dev` is running
   - Error messages will appear there

3. **Verify API Key**
   - Test your API key directly: https://platform.openai.com/playground
   - Make sure it has DALL-E access enabled

4. **Check Environment Variables**
   - Verify `.env.local` is in the correct location
   - Make sure variable name is exactly `OPENAI_API_KEY`
   - No quotes needed around the value

---

## 🚀 Deployment

### Building for Production

```bash
npm run build
npm start
```

### Environment Variables in Production

When deploying (Vercel, Netlify, etc.):

1. Add `OPENAI_API_KEY` in your hosting platform's environment variables
2. Never commit `.env.local` to your repository
3. Restart your application after adding variables

### Recommended Hosting Platforms

- **Vercel** (Recommended for Next.js)
  - Automatic deployments
  - Built-in environment variable management
  - Free tier available

- **Netlify**
  - Easy deployment
  - Good for static sites

- **Railway / Render**
  - Full-stack hosting
  - Easy environment variable setup

---

## 📚 Learning Resources

### For Beginners

- **Next.js Tutorial**: https://nextjs.org/learn
- **React Basics**: https://react.dev/learn
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **OpenAI API Docs**: https://platform.openai.com/docs

### For Professionals

- **Next.js App Router**: https://nextjs.org/docs/app
- **OpenAI Node.js SDK**: https://github.com/openai/openai-node
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue describing the problem
2. **Suggest Features**: Share your ideas for improvements
3. **Submit Pull Requests**: 
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Submit a pull request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenAI** for the DALL-E 2 API
- **Next.js Team** for the amazing framework
- **shadcn** for beautiful UI components
- **Framer Motion** for smooth animations

---

## 📞 Support

Need help? Here's where to get support:

1. **Check this documentation** - Most questions are answered here
2. **Review troubleshooting section** - Common issues and solutions
3. **Open an issue** - For bugs or feature requests
4. **Check OpenAI Status** - https://status.openai.com/

---

**Made with ❤️ for creators and developers**

*Last updated: 2024*
