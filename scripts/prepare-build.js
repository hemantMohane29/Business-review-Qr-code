#!/usr/bin/env node

/**
 * Build script for Vercel deployment
 * Copies all necessary files to public/ directory
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Create public directory
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Files and directories to copy
const filesToCopy = [
  'admin.html',
  'customer-review.html',
  '404.html',
  'assets',
  'api',
  'lib'
];

// Copy files
filesToCopy.forEach(item => {
  const source = path.join(__dirname, '..', item);
  const dest = path.join(publicDir, item);
  
  if (fs.existsSync(source)) {
    if (fs.lstatSync(source).isDirectory()) {
      copyDirectory(source, dest);
      console.log(`✅ Copied directory: ${item}`);
    } else {
      fs.copyFileSync(source, dest);
      console.log(`✅ Copied file: ${item}`);
    }
  } else {
    console.warn(`⚠️ Not found: ${item}`);
  }
});

// Helper function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('✅ Build complete! Output directory: public/');
