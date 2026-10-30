import { post } from './client';
export async function deliverEnquiry(enquiry) {
  const result = await post('/contact', enquiry);
  if (result.success !== true)
    throw new Error('We couldn’t send your message. Your details are still here — please try again.');
}
