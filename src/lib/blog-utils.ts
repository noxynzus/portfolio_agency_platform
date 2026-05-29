/**
 * Blog Utility Functions
 * Shared utilities for blog-related features
 */

/**
 * Calculate estimated reading time based on word count
 * @param content - The blog post content
 * @returns Reading time in minutes
 */
export function calculateReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / 200) // Average reading speed: 200 words/min
  return minutes
}

/**
 * Format date for blog posts
 * @param date - The date to format
 * @returns Formatted date string (e.g., "January 15, 2026")
 */
export function formatPublishDate(date: Date | null): string {
  if (!date) return 'N/A'
  
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get category accent color
 * @param category - Blog post category
 * @returns Hex color code
 */
export function getBlogCategoryColor(category: string | null): string {
  const colors: Record<string, string> = {
    'Web Development': '#3B82F6',
    'System Design': '#00F5FF',
    'AI': '#F97316',
    'UI/UX': '#EC4899',
    'Case Study': '#06B6D4',
    'Performance': '#8B5CF6'
  }
  return colors[category || ''] || '#6B7280'
}

/**
 * Get category gradient for background
 * @param category - Blog post category
 * @returns Tailwind gradient class
 */
export function getBlogCategoryGradient(category: string | null): string {
  const gradients: Record<string, string> = {
    'Web Development': 'from-blue-500/20 to-indigo-500/10',
    'System Design': 'from-cyan-500/20 to-blue-500/10',
    'AI': 'from-orange-500/20 to-amber-500/10',
    'UI/UX': 'from-pink-500/20 to-rose-500/10',
    'Case Study': 'from-emerald-500/20 to-teal-500/10',
    'Performance': 'from-purple-500/20 to-violet-500/10'
  }
  return gradients[category || ''] || 'from-gray-500/20 to-slate-500/10'
}
