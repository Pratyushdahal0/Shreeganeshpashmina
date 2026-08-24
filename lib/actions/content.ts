'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

const DEFAULT_SITE_CONTENT: Record<string, { title: string; data: Record<string, any> }> = {
  homepage: {
    title: 'Homepage Sections & Text',
    data: {
      eyebrow: 'Kathmandu · Nepal',
      heroTitle: 'Softness, with a point of view.',
      heroCopy: 'Pashmina, cashmere, silk and wool shaped into quiet pieces for modern wardrobes.',
      introEyebrow: 'The collection',
      introTitle: 'Made to be\nremembered.',
      introCopy: 'From fine pashmina shawls to everyday cashmere, each piece balances heritage craft with a modern, international sensibility.',
      craftEyebrow: 'Our craft',
      craftTitle: 'Woven slowly.\nFinished by hand.',
      craftCopy: 'Our pieces begin with fibre and end with a finished textile that feels almost weightless. The craft is patient: preparation, spinning, weaving, finishing and careful inspection.',
      footerEyebrow: 'Shree Ganesh Pashmina',
      footerTitle: 'Crafted in Kathmandu.\nWorn everywhere.',
      footerCopy: 'A modern expression of Nepalese textile craft for people who care about material, finish and the feeling of a piece.',
    },
  },
  hero_banners: {
    title: 'Hero & Visual Banners',
    data: {
      heroImg: '/images/hero-editorial.jpg',
      collectionImg: '/images/collection-shawls.jpg',
      craftLoomImg: '/images/craft-loom.jpg',
    },
  },
  brand_story: {
    title: 'Brand Story',
    data: {
      eyebrow: 'Our story',
      title: 'A modern house\nrooted in craft.',
      introCopy: 'Shree Ganesh Pashmina is being shaped in Kathmandu with one ambition: to bring the feeling of exceptional Himalayan textiles to a global wardrobe.',
      detailText: 'The brand combines pashmina, cashmere, silk and wool with an editorial approach to design. Rooted in traditional Nepalese weaving traditions.',
      image: '/images/hero-editorial.jpg',
    },
  },
  craftsmanship: {
    title: 'Craftsmanship',
    data: {
      eyebrow: 'Our craft',
      title: 'Woven slowly.\nMade to last.',
      loomEyebrow: '01 · Weaving',
      loomTitle: 'Hands at the loom.',
      loomCopy: 'The rhythm of the loom gives every textile its character. We combine traditional wooden handlooms with meticulously selected Himalayan cashmere and pashmina fibers.',
      loomImage: '/images/craft-loom.jpg',
    },
  },
  factory_story: {
    title: 'Factory Story',
    data: {
      title: 'Himalayan Weaving Atelier',
      subtitle: 'Inside our Kathmandu production facility',
      processText: 'From raw cashmere carding, hand-spinning yarn, precision loom setup, to natural dyeing and hand-fringing.',
      image: '/images/craft-loom.jpg',
    },
  },
  contact: {
    title: 'Contact Information',
    data: {
      eyebrow: 'Contact',
      title: "Let's talk\nabout textiles.",
      location: 'Kathmandu, Nepal',
      shipping: 'Worldwide shipping available.',
      phone: '+977 9849220167',
      email: 'info@shreeganeshpashmina.com',
    },
  },
  faqs: {
    title: 'Frequently Asked Questions',
    data: {
      faq1_q: 'Where are your products made?',
      faq1_a: 'All pieces are hand-crafted in Kathmandu, Nepal by experienced master artisans.',
      faq2_q: 'How should I care for my pashmina?',
      faq2_a: 'Dry clean or delicate hand wash in cold water using gentle cashmere shampoo.',
      faq3_q: 'Do you ship internationally?',
      faq3_a: 'Yes, we provide worldwide express shipping to over 100 countries.',
    },
  },
  policies: {
    title: 'Customer Policies',
    data: {
      shippingPolicy: 'Standard worldwide shipping takes 4-7 business days. Complimentary delivery unlocked on orders over $400 USD.',
      returnsPolicy: 'We accept returns within 14 days of delivery for unworn items in original packaging.',
      privacyPolicy: 'Your privacy is important to us. We do not sell or share customer data.',
      termsPolicy: 'By using our website, you agree to our standard commerce and order terms.',
    },
  },
  pages: {
    title: 'General Page Meta',
    data: {
      siteName: 'Shree Ganesh Pashmina',
      tagline: 'Crafted in Kathmandu, Worn Everywhere',
    },
  },
};

export async function getSiteContent(key: string) {
  try {
    const content = await prisma.siteContent.findUnique({
      where: { key },
    });

    const defaultSection = DEFAULT_SITE_CONTENT[key] || {
      title: key.replace(/_/g, ' '),
      data: {},
    };

    if (!content) {
      return {
        key,
        title: defaultSection.title,
        data: defaultSection.data,
        isDefault: true,
        error: null,
      };
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(content.data);
    } catch {
      parsedData = defaultSection.data;
    }

    return {
      key: content.key,
      title: content.title || defaultSection.title,
      data: { ...defaultSection.data, ...parsedData },
      isDefault: false,
      error: null,
    };
  } catch (err: any) {
    console.error(`Error fetching site content for key ${key}:`, err);
    const defaultSection = DEFAULT_SITE_CONTENT[key] || { title: key, data: {} };
    return {
      key,
      title: defaultSection.title,
      data: defaultSection.data,
      isDefault: true,
      error: null,
    };
  }
}

export async function updateSiteContent(key: string, title: string, data: Record<string, any>) {
  try {
    const updated = await prisma.siteContent.upsert({
      where: { key },
      update: {
        title,
        data: JSON.stringify(data),
      },
      create: {
        key,
        title,
        data: JSON.stringify(data),
      },
    });

    // Revalidate all storefront pages
    revalidatePath('/');
    revalidatePath('/craft');
    revalidatePath('/story');
    revalidatePath('/contact');
    revalidatePath('/shop');
    revalidatePath('/journal');
    revalidatePath('/privacy');
    revalidatePath('/terms');
    revalidatePath('/returns');
    revalidatePath('/shipping');
    revalidatePath(`/admin/content/${key}`);

    return { content: updated, error: null };
  } catch (err: any) {
    console.error(`Error updating site content for key ${key}:`, err);
    return { content: null, error: 'Failed to save site content' };
  }
}
