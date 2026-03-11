import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We'll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl lg:text-4xl font-bold text-heading mb-8">Contact Us</h1>
        <div className="grid lg:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="rounded-lg h-12" />
            <Input type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required className="rounded-lg h-12" />
            <Textarea placeholder="Your Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required className="rounded-lg min-h-[150px]" />
            <Button type="submit" className="rounded-pill px-8 h-12">Send Message</Button>
          </form>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-heading mb-2">📍 Address</h3>
              <p className="text-body text-sm">Saket, New Delhi, India</p>
            </div>
            <div>
              <h3 className="font-semibold text-heading mb-2">📧 Email</h3>
              <a href="mailto:glowthegadgets@gmail.com" className="text-primary text-sm hover:underline">glowthegadgets@gmail.com</a>
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Contact;
