'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { propertiesService } from '../services/properties.service';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

interface SortableImageProps {
  url: string;
  index: number;
  onRemove: (url: string) => void;
}

function SortableImage({ url, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square rounded-xl overflow-hidden border border-grey-15 bg-grey-10 touch-none",
        isDragging && "opacity-50 ring-2 ring-purple-60"
      )}
    >
      <Image
        src={url.startsWith('/') ? `${API_URL}${url}` : url}
        alt={`Property image ${index}`}
        fill
        unoptimized={url.startsWith('/')}
        className="object-cover transition-transform group-hover:scale-105"
      />
      
      {/* Overlay controls */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        <div className="flex justify-between items-start">
          <div 
            {...attributes} 
            {...listeners}
            className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/20"
          >
            <GripVertical className="h-4 w-4 text-white" />
          </div>
          
          <button
            type="button"
            onClick={() => onRemove(url)}
            className="w-8 h-8 rounded-lg bg-red-500/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {index === 0 && (
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-60 text-white text-[10px] font-bold rounded uppercase shadow-lg">
          Capa
        </div>
      )}
    </div>
  );
}

export function ImageUpload({ value, onChange, maxFiles = 10 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags when clicking remove
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = value.indexOf(active.id as string);
      const newIndex = value.indexOf(over.id as string);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setIsUploading(true);
      const uploadedImages = await propertiesService.uploadImages(acceptedFiles);
      const newUrls = uploadedImages.map(img => img.url);
      onChange([...value, ...newUrls].slice(0, maxFiles));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: maxFiles - value.length,
    disabled: isUploading || value.length >= maxFiles
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 text-center min-h-[160px]",
          isDragActive ? "border-purple-60 bg-purple-60/5" : "border-grey-15 bg-grey-10 hover:border-grey-30",
          (isUploading || value.length >= maxFiles) && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="w-12 h-12 rounded-xl bg-grey-08 border border-grey-15 flex items-center justify-center text-purple-60 shadow-inner">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isDragActive ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>

        <div>
          <p className="text-white font-bold text-sm">
            {isDragActive ? "Solte para enviar" : "Arraste fotos aqui ou clique para selecionar"}
          </p>
          <p className="text-grey-60 text-xs mt-1">
            Recomendado: 1200x800px • Máx. {maxFiles} fotos
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence>
              {value.map((url, index) => (
                <SortableImage
                  key={url}
                  url={url}
                  index={index}
                  onRemove={(u) => onChange(value.filter(v => v !== u))}
                />
              ))}
            </AnimatePresence>

            {value.length === 0 && !isUploading && (
              <div className="aspect-square rounded-xl border border-grey-15 bg-grey-10/30 flex flex-col items-center justify-center gap-2 text-grey-40">
                <ImageIcon className="h-6 w-6 opacity-20" />
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-30">Vazio</span>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
