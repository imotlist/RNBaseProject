#!/usr/bin/env node

/**
 * Screen Generator CLI
 *
 * A command-line tool to generate new screens from templateScreen templates.
 * Usage: node scripts/generateScreen.js <featureName> <layoutType>
 *
 * @example
 *   node scripts/generateScreen.js productList list
 *   node scripts/generateScreen.js userSettings container
 */

const fs = require('fs')
const path = require('path')

// ============================================================================
// Configuration
// ============================================================================

const TEMPLATES_DIR = path.join(__dirname, '../app/templateScreen')
const SCREENS_DIR = path.join(__dirname, '../app/screens')
const LAYOUT_TEMPLATES = {
  list: 'layoutList',
  container: 'layoutContainer',
}

// ============================================================================
// Template Placeholders
// ============================================================================

const PLACEHOLDERS = {
  '{{FEATURE_NAME}}': (name) => name,
  '{{FEATURE_NAME_PASCAL}}': toPascalCase,
  '{{FEATURE_NAME_CAMEL}}': toCamelCase,
  '{{FEATURE_NAME_SNAKE}}': toSnakeCase,
  '{{FEATURE_NAME_KEBAB}}': toKebabCase,
}

// ============================================================================
// String Utility Functions
// ============================================================================

function toPascalCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\s+/g, '')
}

function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toSnakeCase(str) {
  return str
    .replace(/[-\s]/g, '_')
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
}

function toKebabCase(str) {
  return str
    .replace(/[_\s]/g, '-')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
}

// ============================================================================
// File Processing Functions
// ============================================================================

/**
 * Replace all placeholders in content with actual values
 */
function replacePlaceholders(content, featureName) {
  let result = content

  // Sort placeholders by length (longest first) to avoid partial replacements
  const sortedPlaceholders = Object.entries(PLACEHOLDERS)
    .sort(([, a], [, b]) => {
      const lenA = typeof a === 'function' ? a('x').length : 0
      const lenB = typeof b === 'function' ? b('x').length : 0
      return lenB - lenA
    })

  for (const [placeholder, transformer] of sortedPlaceholders) {
    const replacement = typeof transformer === 'function'
      ? transformer(featureName)
      : transformer

    // Use regex with global flag to replace all occurrences
    const regex = new RegExp(escapeRegExp(placeholder), 'g')
    result = result.replace(regex, replacement)
  }

  return result
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Read a template file and process it
 */
function processTemplateFile(templatePath, featureName) {
  const content = fs.readFileSync(templatePath, 'utf-8')
  return replacePlaceholders(content, featureName)
}

/**
 * Get the target filename based on template filename and feature name
 */
function getTargetFilename(templateFilename, featureName) {
  // Keep index.ts as is
  if (templateFilename === 'index.ts') {
    return 'index.ts'
  }

  // Handle layoutType.tsx files (main screen component)
  const mainMatch = templateFilename.match(/^(layoutList|layoutContainer)\.tsx$/)
  if (mainMatch) {
    const layoutType = mainMatch[1] // layoutList or layoutContainer
    const suffix = layoutType === 'layoutList' ? 'List' : 'Container'
    return `${toPascalCase(featureName)}${suffix}.tsx`
  }

  // Handle layoutType.filter.tsx files
  const filterMatch = templateFilename.match(/^(layoutList|layoutContainer)\.filter\.tsx$/)
  if (filterMatch) {
    const layoutType = filterMatch[1]
    const suffix = layoutType === 'layoutList' ? 'List' : 'Container'
    return `${toPascalCase(featureName)}${suffix}Filter.tsx`
  }

  // Handle layoutType.view.tsx files
  const viewMatch = templateFilename.match(/^(layoutList|layoutContainer)\.view\.tsx$/)
  if (viewMatch) {
    const layoutType = viewMatch[1]
    const suffix = layoutType === 'layoutList' ? 'List' : 'Container'
    return `${toPascalCase(featureName)}${suffix}View.tsx`
  }

  // Handle layoutType.menu.tsx files
  const menuMatch = templateFilename.match(/^(layoutList|layoutContainer)\.menu\.tsx$/)
  if (menuMatch) {
    const layoutType = menuMatch[1]
    const suffix = layoutType === 'layoutList' ? 'List' : 'Container'
    return `${toPascalCase(featureName)}${suffix}ActionSheet.tsx`
  }

  // Handle layoutType.styles.ts files
  const stylesMatch = templateFilename.match(/^(layoutList|layoutContainer)\.styles\.ts$/)
  if (stylesMatch) {
    const layoutType = stylesMatch[1]
    const suffix = layoutType === 'layoutList' ? 'List' : 'Container'
    return `${toPascalCase(featureName)}${suffix}.styles.ts`
  }

  // Default: return original filename
  return templateFilename
}

// ============================================================================
// Directory Operations
// ============================================================================

/**
 * Check if a directory exists
 */
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory()
  } catch {
    return false
  }
}

/**
 * Create a directory recursively
 */
function createDirectory(dirPath) {
  if (!directoryExists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// ============================================================================
// Screen Generation
// ============================================================================

/**
 * Generate a screen from template
 */
function generateScreen(featureName, layoutType) {
  // Validate inputs
  if (!featureName) {
    console.error('Error: Feature name is required')
    process.exit(1)
  }

  const templateKey = layoutType || 'list'
  const templateDir = path.join(TEMPLATES_DIR, LAYOUT_TEMPLATES[templateKey])

  if (!directoryExists(templateDir)) {
    console.error(`Error: Template layout "${templateKey}" not found`)
    console.error(`Available layouts: ${Object.keys(LAYOUT_TEMPLATES).join(', ')}`)
    process.exit(1)
  }

  // Determine target directory
  const targetDir = path.join(SCREENS_DIR, featureName)

  // Check if screen already exists
  if (directoryExists(targetDir)) {
    console.error(`Error: Screen directory "${targetDir}" already exists`)
    console.error('To regenerate, delete the existing directory first')
    process.exit(1)
  }

  // Create target directory
  createDirectory(targetDir)
  console.log(`\n📁 Created directory: ${targetDir}`)

  // Get all template files
  const templateFiles = fs.readdirSync(templateDir)
  const generatedFiles = []

  // Process each template file
  for (const file of templateFiles) {
    const templatePath = path.join(templateDir, file)
    const stat = fs.statSync(templatePath)

    if (stat.isFile()) {
      const processedContent = processTemplateFile(templatePath, featureName)
      const targetFilename = getTargetFilename(file, featureName)
      const targetPath = path.join(targetDir, targetFilename)

      fs.writeFileSync(targetPath, processedContent, 'utf-8')
      generatedFiles.push(targetFilename)
      console.log(`   ✓ Generated: ${targetFilename}`)
    }
  }

  // Success message
  console.log(`\n✅ Successfully generated "${featureName}" screen with "${templateKey}" layout`)
  console.log(`\n📄 Generated ${generatedFiles.length} files:`)
  generatedFiles.forEach((file) => console.log(`   - ${file}`))
  console.log(`\n📦 Next steps:`)
  console.log(`   1. Update the API call in ${toPascalCase(featureName)}${toPascalCase(templateKey === 'list' ? 'List' : 'Container')}.tsx`)
  console.log(`   2. Add the screen to your navigator`)
  console.log(`   3. Update imports and types as needed\n`)
}

// ============================================================================
// CLI Entry Point
// ============================================================================

function main() {
  const args = process.argv.slice(2)
  const featureName = args[0]
  const layoutType = args[1]?.toLowerCase()

  generateScreen(featureName, layoutType)
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { generateScreen }
