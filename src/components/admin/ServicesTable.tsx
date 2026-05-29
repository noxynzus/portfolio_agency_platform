'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';
import {
  deleteService,
  toggleServicePublished,
  updateServicesOrder,
} from '@/lib/actions/services';
import type { Service } from '@prisma/client';

interface ServicesTableProps {
  services: Service[];
}

function SortableRow({ service }: { service: Service }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = (Icons as any)[service.iconName] || Icons.HelpCircle;

  const handleDelete = async () => {
    if (!confirm(`Delete service "${service.title}"?`)) return;

    setIsDeleting(true);
    const result = await deleteService(service.id);

    if (result.success) {
      toast.success('Service deleted');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    const result = await toggleServicePublished(service.id);

    if (result.success) {
      toast.success(service.published ? 'Unpublished' : 'Published');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to toggle');
    }
    setIsToggling(false);
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-white/10">
      <td className="p-4">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60"
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              service.variant === 'cyan'
                ? 'bg-[#00F5FF]/20 text-[#00F5FF]'
                : service.variant === 'purple'
                ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                : 'bg-[#06B6D4]/20 text-[#06B6D4]'
            }`}
          >
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-white">{service.title}</p>
            <p className="text-sm text-white/50">{service.slug}</p>
          </div>
        </div>
      </td>
      <td className="p-4 max-w-md">
        <p className="text-sm text-white/70 line-clamp-2">
          {service.description}
        </p>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {service.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-cyber-dark/50 border border-white/10 rounded text-white/60"
            >
              {feature}
            </span>
          ))}
          {service.features.length > 3 && (
            <span className="px-2 py-1 text-xs text-white/40">
              +{service.features.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            service.published
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {service.published ? 'Published' : 'Draft'}
        </button>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className="p-2 hover:bg-cyber-dark/50 rounded-lg text-white/60 hover:text-white transition-colors"
            title={service.published ? 'Unpublish' : 'Publish'}
          >
            {service.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          <Link
            href={`/dashboard/services/${service.id}/edit`}
            className="p-2 hover:bg-cyber-dark/50 rounded-lg text-white/60 hover:text-[#00F5FF] transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:bg-cyber-dark/50 rounded-lg text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ServicesTable({ services: initialServices }: ServicesTableProps) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = services.findIndex((s) => s.id === active.id);
    const newIndex = services.findIndex((s) => s.id === over.id);

    const newServices = arrayMove(services, oldIndex, newIndex);
    setServices(newServices);

    // Update order in database
    setIsSaving(true);
    const items = newServices.map((service, index) => ({
      id: service.id,
      order: index,
    }));

    const result = await updateServicesOrder(items);

    if (result.success) {
      toast.success('Order updated');
      router.refresh();
    } else {
      toast.error('Failed to update order');
      // Revert on error
      setServices(initialServices);
    }
    setIsSaving(false);
  };

  if (services.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-white/50 mb-4">No services found</p>
        <Link
          href="/dashboard/services/new"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:opacity-90 rounded-lg text-white font-medium transition-opacity"
        >
          Create First Service
        </Link>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {isSaving && (
        <div className="px-4 py-2 bg-[#00F5FF]/10 border-b border-[#00F5FF]/30 text-sm text-[#00F5FF]">
          Saving order...
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-cyber-dark/30">
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider w-12">
                  Order
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Service
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Description
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Features
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <SortableContext
              items={services.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {services.map((service) => (
                  <SortableRow key={service.id} service={service} />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </div>
      </DndContext>
    </div>
  );
}
