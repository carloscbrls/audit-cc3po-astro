# audit.cc3po.com Deployment

## Status

✅ Astro project created
✅ GitHub repo: https://github.com/carloscbrls/audit-cc3po-astro
✅ Build tested successfully
⏳ Netlify connection (manual step required)

## Manual Netlify Setup

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub (if not already connected)
4. Select repository: `carloscbrls/audit-cc3po-astro`
5. Configure build:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Custom Domain Setup

After Netlify deploys:

1. Go to Site settings → Domain management
2. Add custom domain: `audit.cc3po.com`
3. Netlify will provide DNS configuration

## DNS Records at SiteGround

Update these records for `audit.cc3po.com`:

```
Type: CNAME
Name: audit
Value: [netlify-subdomain].netlify.app
TTL: 3600
```

Or use Netlify's DNS for better performance (A records):

```
Type: A
Name: audit
Value: 75.2.81.53
TTL: 3600

Type: A  
Name: audit
Value: 99.83.231.61
TTL: 3600
```

## Features

- **Free Website Audit** landing page
- **Netlify Forms** integration (name, email, website, focus area, message)
- **Success page** after form submission
- **Dark theme** matching CC3PO design system
- **Responsive** mobile-first design
- **SEO optimized** with meta tags and sitemap

## Form Fields

The audit request form includes:
- Name (required)
- Email (required)
- Website URL (required)
- Primary Focus (optional dropdown)
- Message (optional textarea)

Form submissions appear in Netlify dashboard under "Forms" → "audit-request"