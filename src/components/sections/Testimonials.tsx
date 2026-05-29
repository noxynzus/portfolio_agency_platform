import { getPublishedTestimonials } from '@/lib/actions/testimonials'
import TestimonialsClient from './TestimonialsClient'

export default async function Testimonials() {
  const result = await getPublishedTestimonials();
  const testimonials = result.success ? result.data || [] : [];

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return <TestimonialsClient testimonials={testimonials} />;
}
