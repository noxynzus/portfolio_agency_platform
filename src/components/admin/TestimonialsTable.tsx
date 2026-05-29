'use client';

import { useState } from 'react';
import { Testimonial } from '@prisma/client';
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
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  deleteTestimonial,
  toggleTestimonialPublished,
  reorderTestimonials,
} from '@/lib/actions/testimonials';

type SerializedTestimonial = Omit<Testimonial, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

interface TestimonialsTableProps {
  initialTestimonials: SerializedTestimonial[];
  onEdit: (testimonial: SerializedTestimonial) => void;
}

function SortableRow({
  testimonial,
  onEdit,
  onDelete,
  onTogglePublished,
}: {
  testimonial: SerializedTestimonial;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublished: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-white/10 hover:bg-white/5 ${
        isDragging ? 'bg-white/10' : ''
      }`}
    >
      {/* Drag Handle */}
      <td className="p-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-cyan-500 transition"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>

      {/* Name & Company */}
      <td className="p-4">
        <div>
          <p className="font-medium">{testimonial.name}</p>
          <p className="text-sm text-white/60">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </td>

      {/* Content Preview */}
      <td className="p-4">
        <p className="text-sm text-white/60 line-clamp-2 max-w-md">
          {testimonial.content}
        </p>
      </td>

      {/* Rating */}
      <td className="p-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? 'text-yellow-500 fill-yellow-500'
                  : 'text-white/20'
              }`}
            />
          ))}
        </div>
      </td>

      {/* Status */}
      <td className="p-4">
        <button
          onClick={onTogglePublished}
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            testimonial.published
              ? 'bg-green-500/10 text-green-500'
              : 'bg-gray-500/10 text-gray-400'
          }`}
        >
          {testimonial.published ? (
            <>
              <Eye className="w-3 h-3" />
              Published
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3" />
              Draft
            </>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-cyan-500/10 text-cyan-500 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function TestimonialsTable({
  initialTestimonials,
  onEdit,
}: TestimonialsTableProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = testimonials.findIndex((s) => s.id === active.id);
      const newIndex = testimonials.findIndex((s) => s.id === over.id);

      const newOrder = arrayMove(testimonials, oldIndex, newIndex);
      setTestimonials(newOrder);

      // Update order in database
      const items = newOrder.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      const result = await reorderTestimonials(items);
      if (!result.success) {
        toast.error('Failed to reorder testimonials');
        setTestimonials(initialTestimonials); // Revert on error
      } else {
        toast.success('Order updated');
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from ${name}?`)) return;

    const result = await deleteTestimonial(id);
    if (result.success) {
      setTestimonials(testimonials.filter((s) => s.id !== id));
      toast.success('Testimonial deleted');
    } else {
      toast.error(result.error || 'Failed to delete');
    }
  };

  const handleTogglePublished = async (id: string) => {
    const result = await toggleTestimonialPublished(id);
    if (result.success && result.data) {
      const serialized: SerializedTestimonial = {
        ...result.data,
        createdAt: result.data.createdAt.toISOString(),
        updatedAt: result.data.updatedAt.toISOString(),
      };
      setTestimonials(
        testimonials.map((s) => (s.id === id ? serialized : s))
      );
      toast.success(
        result.data.published ? 'Published' : 'Unpublished'
      );
    } else {
      toast.error(result.error || 'Failed to toggle status');
    }
  };

  if (testimonials.length === 0) {
    return (
      <div className="glass p-12 rounded-xl border border-white/10 text-center">
        <p className="text-white/60 mb-4">No testimonials yet</p>
        <p className="text-sm text-white/40">
          Create your first testimonial to get started
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-white/10 overflow-hidden">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-left text-sm font-medium text-white/60 w-12">
                  Order
                </th>
                <th className="p-4 text-left text-sm font-medium text-white/60">
                  Client
                </th>
                <th className="p-4 text-left text-sm font-medium text-white/60">
                  Content
                </th>
                <th className="p-4 text-left text-sm font-medium text-white/60">
                  Rating
                </th>
                <th className="p-4 text-left text-sm font-medium text-white/60">
                  Status
                </th>
                <th className="p-4 text-left text-sm font-medium text-white/60 w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={testimonials.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {testimonials.map((testimonial) => (
                  <SortableRow
                    key={testimonial.id}
                    testimonial={testimonial}
                    onEdit={() => onEdit(testimonial)}
                    onDelete={() => handleDelete(testimonial.id, testimonial.name)}
                    onTogglePublished={() => handleTogglePublished(testimonial.id)}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
      </DndContext>
    </div>
  );
}
