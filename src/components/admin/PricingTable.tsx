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
import { Edit, Trash2, GripVertical, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  deletePricingPlan,
  togglePricingPlanPublished,
  updatePricingPlansOrder,
} from '@/lib/actions/pricing';
import type { PricingPlan } from '@prisma/client';

interface PricingTableProps {
  plans: PricingPlan[];
}

function SortableRow({ plan }: { plan: PricingPlan }) {
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
  } = useSortable({ id: plan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = async () => {
    if (!confirm(`Delete pricing plan "${plan.name}"?`)) return;

    setIsDeleting(true);
    const result = await deletePricingPlan(plan.id);

    if (result.success) {
      toast.success('Pricing plan deleted');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete');
      setIsDeleting(false);
    }
  };

  const handleToggle = async () => {
    setIsToggling(true);
    const result = await togglePricingPlanPublished(plan.id);

    if (result.success) {
      toast.success(plan.published ? 'Unpublished' : 'Published');
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
        <div className="flex items-center gap-2">
          {plan.recommended && (
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          )}
          <div>
            <p className="font-medium text-white">{plan.name}</p>
            <p className="text-sm text-white/50">{plan.slug}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <p className="text-sm text-white/70">{plan.description || '—'}</p>
      </td>
      <td className="p-4">
        <p className="font-semibold text-[#00F5FF]">{plan.price}</p>
        <p className="text-xs text-white/50">/{plan.period}</p>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {plan.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-cyber-dark/50 border border-white/10 rounded text-white/60"
            >
              {feature}
            </span>
          ))}
          {plan.features.length > 3 && (
            <span className="px-2 py-1 text-xs text-white/40">
              +{plan.features.length - 3}
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            plan.published
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {plan.published ? 'Published' : 'Draft'}
        </button>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className="p-2 hover:bg-cyber-dark/50 rounded-lg text-white/60 hover:text-white transition-colors"
            title={plan.published ? 'Unpublish' : 'Publish'}
          >
            {plan.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          <Link
            href={`/dashboard/pricing/${plan.id}/edit`}
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

export function PricingTable({ plans: initialPlans }: PricingTableProps) {
  const router = useRouter();
  const [plans, setPlans] = useState(initialPlans);
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

    const oldIndex = plans.findIndex((p) => p.id === active.id);
    const newIndex = plans.findIndex((p) => p.id === over.id);

    const newPlans = arrayMove(plans, oldIndex, newIndex);
    setPlans(newPlans);

    // Update order in database
    setIsSaving(true);
    const items = newPlans.map((plan, index) => ({
      id: plan.id,
      order: index,
    }));

    const result = await updatePricingPlansOrder(items);

    if (result.success) {
      toast.success('Order updated');
      router.refresh();
    } else {
      toast.error('Failed to update order');
      // Revert on error
      setPlans(initialPlans);
    }
    setIsSaving(false);
  };

  if (plans.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-white/50 mb-4">No pricing plans found</p>
        <Link
          href="/dashboard/pricing/new"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] hover:opacity-90 rounded-lg text-white font-medium transition-opacity"
        >
          Create First Plan
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
                  Plan
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                  Description
                </th>
                <th className="p-4 text-left text-xs font-medium text-white/50 uppercase tracking-wider w-32">
                  Price
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
              items={plans.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {plans.map((plan) => (
                  <SortableRow key={plan.id} plan={plan} />
                ))}
              </tbody>
            </SortableContext>
          </table>
        </div>
      </DndContext>
    </div>
  );
}
