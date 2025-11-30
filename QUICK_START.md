# Quick Start Guide - AI Image Generator

This is a quick reference guide for getting started with the AI Image Generator. For detailed documentation, see [README.md](./README.md).

## 🚀 5-Minute Setup

### 1. Install Node.js
- Download from https://nodejs.org/ (version 18 or higher)
- Install it (default settings are fine)

### 2. Get OpenAI API Key
- Go to https://platform.openai.com/
- Sign up or log in
- Go to https://platform.openai.com/api-keys
- Click "Create new secret key"
- Copy the key (starts with `sk-`)

### 3. Setup Project
```bash
# Navigate to project folder
cd image-generator

# Install dependencies
npm install

# Create .env.local file
# Add this line (replace with your actual key):
OPENAI_API_KEY=sk-your-key-here
```

### 4. Run the App
```bash
npm run dev
```

### 5. Open Browser
- Go to http://localhost:3000
- Start generating images!

## 📝 How to Generate Images

1. **Type your prompt** in the text box
   - Example: "A beautiful sunset over mountains"
   
2. **Click "Generate"** or press Enter

3. **Wait 10-30 seconds** for images to appear

4. **Click download button** (⬇️) to save images

## 💡 Prompt Tips

**Good prompts:**
- ✅ "A cute puppy in a garden, photorealistic"
- ✅ "Futuristic city at night with neon lights"
- ✅ "Abstract art with blue and purple colors"

**Better prompts (more detail):**
- ✅ "A serene Japanese garden in spring, cherry blossoms falling, soft morning light, 4K quality"

**Avoid:**
- ❌ Very short: "cat"
- ❌ Inappropriate content

## ⚠️ Common Issues

**"API key not configured"**
- Make sure `.env.local` file exists
- Check the key is correct (starts with `sk-`)
- Restart the server after adding the key

**"Rate limit exceeded"**
- Wait a few minutes
- Check your OpenAI account limits

**Images won't load**
- Check internet connection
- Try refreshing the page

## 🎯 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Experiment with different prompts
- Try the fullscreen viewer (click any image)
- Download your favorite creations

---

**Need more help?** Check the troubleshooting section in [README.md](./README.md)

