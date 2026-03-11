import { Layout } from '@/components/Layout';
import { Hero } from '@/components/Hero';
import { TrustStrip } from '@/components/TrustStrip';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';

const Index = () => (
  <Layout>
    <Hero />
    <TrustStrip />
    <FeaturedProducts />
    <WhyChooseUs />
    <Testimonials />
    <Newsletter />
  </Layout>
);

export default Index;
