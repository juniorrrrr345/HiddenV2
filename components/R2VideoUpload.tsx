'use client';

import R2Upload from './R2Upload';

interface R2VideoUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  className?: string;
}

export default function R2VideoUpload({ onUpload, currentUrl, className }: R2VideoUploadProps) {
  return (
    <R2Upload
      onUpload={onUpload}
      resourceType="video"
      currentUrl={currentUrl}
      className={className}
    />
  );
}