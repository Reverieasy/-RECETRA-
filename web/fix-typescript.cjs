const fs = require('fs');
const path = require('path');

// Function to recursively find all .js files
function findJsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules') {
      files.push(...findJsFiles(fullPath));
    } else if (item.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to remove TypeScript syntax
function removeTypeScriptSyntax(content) {
  // Remove React.FC type annotations
  content = content.replace(/:\s*React\.FC(?:<[^>]*>)?/g, '');
  
  // Remove type annotations in function parameters
  content = content.replace(/:\s*string/g, '');
  content = content.replace(/:\s*number/g, '');
  content = content.replace(/:\s*boolean/g, '');
  content = content.replace(/:\s*any/g, '');
  content = content.replace(/:\s*\[\]/g, '');
  content = content.replace(/:\s*\{[^}]*\}/g, '');
  
  // Remove interface and type definitions
  content = content.replace(/interface\s+\w+\s*\{[^}]*\}/g, '');
  content = content.replace(/type\s+\w+\s*=\s*[^;]+;/g, '');
  
  return content;
}

// Main execution
const webDir = __dirname;
const jsFiles = findJsFiles(webDir);

console.log(`Found ${jsFiles.length} JavaScript files to process...`);

for (const file of jsFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const cleanedContent = removeTypeScriptSyntax(content);
    
    if (content !== cleanedContent) {
      fs.writeFileSync(file, cleanedContent, 'utf8');
      console.log(`✅ Fixed: ${path.relative(webDir, file)}`);
    } else {
      console.log(`✅ Already clean: ${path.relative(webDir, file)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log('\n🎉 TypeScript syntax removal complete!');
