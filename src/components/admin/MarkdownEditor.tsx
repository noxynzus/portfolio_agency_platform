'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// Dynamically import the editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
}

export default function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Write your content in Markdown...',
  height = 500 
}: MarkdownEditorProps) {
  const [previewMode, setPreviewMode] = useState<'edit' | 'live' | 'preview'>('live')
  
  return (
    <div className="markdown-editor-wrapper" data-color-mode="dark">
      <style jsx global>{`
        .markdown-editor-wrapper .w-md-editor {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
        }
        
        .markdown-editor-wrapper .w-md-editor-toolbar {
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px;
        }
        
        .markdown-editor-wrapper .w-md-editor-toolbar button {
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.2s;
        }
        
        .markdown-editor-wrapper .w-md-editor-toolbar button:hover {
          color: rgba(0, 245, 255, 1);
          background: rgba(0, 245, 255, 0.1);
        }
        
        .markdown-editor-wrapper .w-md-editor-content {
          background: transparent;
        }
        
        .markdown-editor-wrapper .w-md-editor-text-pre,
        .markdown-editor-wrapper .w-md-editor-text-input {
          color: white !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .markdown-editor-wrapper .w-md-editor-preview {
          background: rgba(255, 255, 255, 0.02);
          color: white;
          padding: 16px;
        }
        
        /* Markdown preview styling */
        .markdown-editor-wrapper .wmde-markdown {
          background: transparent;
          color: white;
          font-size: 15px;
          line-height: 1.7;
        }
        
        .markdown-editor-wrapper .wmde-markdown h1 {
          color: #00F5FF;
          font-size: 2em;
          font-weight: 700;
          margin-top: 1em;
          margin-bottom: 0.5em;
          border-bottom: 2px solid rgba(0, 245, 255, 0.2);
          padding-bottom: 0.3em;
        }
        
        .markdown-editor-wrapper .wmde-markdown h2 {
          color: #00F5FF;
          font-size: 1.5em;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
          border-bottom: 1px solid rgba(0, 245, 255, 0.1);
          padding-bottom: 0.3em;
        }
        
        .markdown-editor-wrapper .wmde-markdown h3 {
          color: #8B5CF6;
          font-size: 1.25em;
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .markdown-editor-wrapper .wmde-markdown h4,
        .markdown-editor-wrapper .wmde-markdown h5,
        .markdown-editor-wrapper .wmde-markdown h6 {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        
        .markdown-editor-wrapper .wmde-markdown p {
          margin-bottom: 1em;
        }
        
        .markdown-editor-wrapper .wmde-markdown a {
          color: #00F5FF;
          text-decoration: none;
          border-bottom: 1px solid rgba(0, 245, 255, 0.3);
          transition: all 0.2s;
        }
        
        .markdown-editor-wrapper .wmde-markdown a:hover {
          color: #00D4E0;
          border-bottom-color: #00D4E0;
        }
        
        .markdown-editor-wrapper .wmde-markdown code {
          background: rgba(139, 92, 246, 0.1);
          color: #A78BFA;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9em;
        }
        
        .markdown-editor-wrapper .wmde-markdown pre {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          margin: 1em 0;
        }
        
        .markdown-editor-wrapper .wmde-markdown pre code {
          background: transparent;
          color: white;
          padding: 0;
          border-radius: 0;
          font-size: 13px;
        }
        
        .markdown-editor-wrapper .wmde-markdown blockquote {
          border-left: 4px solid #00F5FF;
          padding-left: 16px;
          margin: 1em 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          background: rgba(0, 245, 255, 0.05);
          padding: 12px 16px;
          border-radius: 4px;
        }
        
        .markdown-editor-wrapper .wmde-markdown ul,
        .markdown-editor-wrapper .wmde-markdown ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        .markdown-editor-wrapper .wmde-markdown li {
          margin: 0.5em 0;
        }
        
        .markdown-editor-wrapper .wmde-markdown img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        
        .markdown-editor-wrapper .wmde-markdown table {
          width: 100%;
          border-collapse: collapse;
          margin: 1em 0;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          overflow: hidden;
        }
        
        .markdown-editor-wrapper .wmde-markdown table th {
          background: rgba(0, 245, 255, 0.1);
          color: #00F5FF;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid rgba(0, 245, 255, 0.3);
        }
        
        .markdown-editor-wrapper .wmde-markdown table td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .markdown-editor-wrapper .wmde-markdown hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin: 2em 0;
        }
        
        /* Code syntax highlighting */
        .markdown-editor-wrapper .wmde-markdown .hljs {
          background: transparent;
        }
        
        .markdown-editor-wrapper .wmde-markdown .hljs-keyword {
          color: #C792EA;
        }
        
        .markdown-editor-wrapper .wmde-markdown .hljs-string {
          color: #C3E88D;
        }
        
        .markdown-editor-wrapper .wmde-markdown .hljs-function {
          color: #82AAFF;
        }
        
        .markdown-editor-wrapper .wmde-markdown .hljs-number {
          color: #F78C6C;
        }
        
        .markdown-editor-wrapper .wmde-markdown .hljs-comment {
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
        }
        
        /* Scrollbar styling */
        .markdown-editor-wrapper .w-md-editor-text,
        .markdown-editor-wrapper .w-md-editor-preview {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 245, 255, 0.3) transparent;
        }
        
        .markdown-editor-wrapper .w-md-editor-text::-webkit-scrollbar,
        .markdown-editor-wrapper .w-md-editor-preview::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .markdown-editor-wrapper .w-md-editor-text::-webkit-scrollbar-track,
        .markdown-editor-wrapper .w-md-editor-preview::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .markdown-editor-wrapper .w-md-editor-text::-webkit-scrollbar-thumb,
        .markdown-editor-wrapper .w-md-editor-preview::-webkit-scrollbar-thumb {
          background: rgba(0, 245, 255, 0.3);
          border-radius: 4px;
        }
        
        .markdown-editor-wrapper .w-md-editor-text::-webkit-scrollbar-thumb:hover,
        .markdown-editor-wrapper .w-md-editor-preview::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 245, 255, 0.5);
        }
      `}</style>
      
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        height={height}
        preview={previewMode}
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={true}
        highlightEnable={true}
        textareaProps={{
          placeholder: placeholder
        }}
      />
      
      <div className="mt-2 flex items-center justify-between text-xs text-white/40">
        <span>💡 Tip: Drag the separator to resize editor/preview</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode('edit')}
            className={`px-2 py-1 rounded transition ${
              previewMode === 'edit' 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'hover:bg-white/5'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('live')}
            className={`px-2 py-1 rounded transition ${
              previewMode === 'live' 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'hover:bg-white/5'
            }`}
          >
            Split
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('preview')}
            className={`px-2 py-1 rounded transition ${
              previewMode === 'preview' 
                ? 'bg-cyan-500/20 text-cyan-400' 
                : 'hover:bg-white/5'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}
