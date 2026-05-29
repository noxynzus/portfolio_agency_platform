'use client'

import { useState, useRef, ChangeEvent, useEffect } from 'react'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  existingUrls?: string[]
  label?: string
}

export default function ImageUpload({
  onFilesChange,
  multiple = false,
  maxFiles = 5,
  existingUrls = [],
  label = 'Upload Images'
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingUrls)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif','image/webp']
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [previewUrls])

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    if (!selectedFiles.length) return

    // Validate file count
    if (multiple && files.length + selectedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`)
      return
    }

    // Validate each file
    for (const file of selectedFiles) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: Only JPG, PNG, GIF, and WEBP allowed`)
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: File too large (max 5MB)`)
        return
      }
    }

    // Create blob URLs for preview
    const newBlobUrls = selectedFiles.map(file => URL.createObjectURL(file))
    
    // Update state
    const updatedFiles = multiple ? [...files, ...selectedFiles] : selectedFiles
    const updatedPreviews = multiple 
      ? [...previewUrls, ...newBlobUrls]
      : newBlobUrls

    setFiles(updatedFiles)
    setPreviewUrls(updatedPreviews)
    onFilesChange(updatedFiles)
    
    toast.success(`${selectedFiles.length} image(s) selected`)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const urlToRemove = previewUrls[index]
    
    // Revoke blob URL if it's a blob
    if (urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove)
    }
    
    const newFiles = files.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    
    setFiles(newFiles)
    setPreviewUrls(newPreviews)
    onFilesChange(newFiles)
    
    toast.success('Image removed')
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white/80">
        {label}
      </label>

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={!multiple && previewUrls.length >= 1}
        className="w-full py-8 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 
                   transition glass flex flex-col items-center justify-center gap-3
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="w-8 h-8 text-white/60" />
        <span className="text-white/60">
          Click to upload {multiple ? `(max ${maxFiles})` : ''}
        </span>
        <span className="text-xs text-white/40">
          JPG, PNG, GIF, WEBP up to 5MB
        </span>
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-video rounded-lg overflow-hidden glass"
            >
              <Image
                src={url}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={true}
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 
                           rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Index Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Text */}
      {previewUrls.length > 0 && multiple && (
        <p className="text-xs text-white/40">
          {previewUrls.length} / {maxFiles} images selected
        </p>
      )}
    </div>
  )
}
