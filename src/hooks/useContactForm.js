import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONTACT_TOPICS as TOPICS } from '@/data/contact';
import { deliverEnquiry } from '@/api/contact';
import { PRODUCTS } from '@/data/products';
const EMPTY = { name: '', email: '', company: '', city: '', message: '' };
export function useContactForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const topic = TOPICS.find((item) => item.id === searchParams.get('topic')) ?? TOPICS[2];
  const product = PRODUCTS.find((item) => item.id === searchParams.get('product'));
  const productMessage = product ? `I’d like to enquire about ${product.name}.` : '';
  const [values, setValues] = useState(() => ({ ...EMPTY, message: productMessage }));
  const previousProductMessage = useRef(productMessage);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [received, setReceived] = useState(false);
  const [failure, setFailure] = useState('');
  const summaryRef = useRef(null);
  const statusRef = useRef(null);
  useEffect(() => {
    const previousMessage = previousProductMessage.current;
    setValues((current) =>
      current.message === previousMessage || !current.message
        ? { ...current, message: productMessage }
        : current,
    );
    previousProductMessage.current = productMessage;
  }, [productMessage]);
  useEffect(() => {
    if (Object.keys(errors).length) summaryRef.current?.focus();
  }, [errors]);
  useEffect(() => {
    if (received) statusRef.current?.focus();
  }, [received]);
  const chooseTopic = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('topic', id);
    setSearchParams(next, { replace: true, preventScrollReset: true });
    setReceived(false);
    setFailure('');
  };
  const submit = async (event) => {
    event.preventDefault();
    if (pending) return;
    const next = {};
    if (!values.name.trim()) next.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = 'Please enter a valid email address.';
    if (values.message.trim().length < 10)
      next.message = 'Please write at least 10 characters so we can help.';
    setErrors(next);
    setFailure('');
    if (Object.keys(next).length) return;
    setPending(true);
    try {
      const enquiry = { ...values, topic: topic.label };
      await deliverEnquiry(enquiry);
      setReceived(true);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };
  const reset = () => {
    setValues({ ...EMPTY, message: productMessage });
    setErrors({});
    setFailure('');
    setReceived(false);
  };
  return {
    reset,
    topic,
    values,
    errors,
    pending,
    received,
    failure,
    summaryRef,
    statusRef,
    chooseTopic,
    submit,
    setValues,
    setReceived,
  };
}
