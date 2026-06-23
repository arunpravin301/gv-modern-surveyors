import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import TurndownService from 'turndown';

const DRAFTS_DIR = path.join(process.cwd(), 'drafts');
const PROCESSED_DIR = path.join(DRAFTS_DIR, 'processed');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'guides');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

async function processDrafts() {
  if (!fs.existsSync(DRAFTS_DIR)) {
    console.log('No drafts/ folder found. Skipping.');
    return;
  }
  if (!fs.existsSync(PROCESSED_DIR)) {
    fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(DRAFTS_DIR);
  const docxFiles = files.filter(f => f.endsWith('.docx'));

  if (docxFiles.length === 0) {
    console.log('No .docx files found in drafts/.');
    return;
  }

  for (const file of docxFiles) {
    const filePath = path.join(DRAFTS_DIR, file);
    // Create a URL-safe slug from the filename
    const slug = path.basename(file, '.docx').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    console.log(`Processing: ${file}`);
    
    try {
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const markdown = turndownService.turndown(html);
      
      // Auto-generate title by removing dashes and capitalizing words
      const titleRaw = path.basename(file, '.docx').replace(/-/g, ' ');
      const title = titleRaw.charAt(0).toUpperCase() + titleRaw.slice(1);
      const date = new Date().toISOString().split('T')[0];
      
      const frontmatter = `---
title: "${title}"
excerpt: "New article converted directly from Microsoft Word."
category: "GENERAL"
readTime: "5 MIN READ"
date: ${date}
---

`;
      
      const finalContent = frontmatter + markdown;
      const outputPath = path.join(OUTPUT_DIR, `${slug}.md`);
      
      fs.writeFileSync(outputPath, finalContent);
      console.log(`✅ Successfully generated: ${outputPath}`);
      
      // Move processed file to prevent reprocessing
      fs.renameSync(filePath, path.join(PROCESSED_DIR, file));
      
    } catch (err) {
      console.error(`❌ Failed to process ${file}:`, err);
    }
  }
  
  console.log('🎉 All Word documents processed successfully!');
}

processDrafts();
