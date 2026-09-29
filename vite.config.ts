import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Preload the hashed entry JS + CSS in <head> (shortens browser→render chain)
const preloadEntry: any = {
  name: 'preload-entry-assets',
  transformIndexHtml(html: string, ctx: any) {
    const links: string[] = [];
    const bundle = ctx.bundle || {};
    for (const chunk of Object.values<any>(bundle)) {
      if (chunk?.isEntry && chunk?.fileName?.endsWith('.js')) {
        links.push(`<link rel="preload" as="script" href="/${chunk.fileName}" crossorigin />`);
      }
      if (chunk?.fileName?.endsWith('.css')) {
        links.push(`<link rel="preload" as="style" href="/${chunk.fileName}" />`);
      }
    }
    return html.replace('</head>', links.join('\n    ') + '\n  </head>');
  },
};

export default defineConfig({
  plugins: [react(), preloadEntry],
})
