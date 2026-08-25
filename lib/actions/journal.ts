'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function getArticles(status?: 'DRAFT' | 'PUBLISHED', options?: { take?: number; includeContent?: boolean }) {
  try {
    const includeContent = options?.includeContent ?? true;
    const articles = await prisma.journalArticle.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      take: options?.take,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: includeContent,
        image: true,
        author: true,
        status: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { articles, error: null };
  } catch {
    return { articles: [], error: 'Failed to fetch articles' };
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.journalArticle.findUnique({ where: { slug } });
    return { article, error: null };
  } catch {
    return { article: null, error: 'Failed to fetch article' };
  }
}

export async function createArticle(data: {
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}) {
  if (!data.title?.trim()) return { article: null, error: 'Title is required' };
  if (!data.content?.trim()) return { article: null, error: 'Content is required' };

  const slug = toSlug(data.title);
  try {
    const article = await prisma.journalArticle.create({
      data: {
        title: data.title.trim(),
        slug,
        excerpt: data.excerpt?.trim() || null,
        content: data.content.trim(),
        image: data.image?.trim() || null,
        status: data.status || 'DRAFT',
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    });
    revalidatePath('/admin/journal');
    revalidatePath('/journal');
    return { article, error: null };
  } catch (e: any) {
    if (e.code === 'P2002') return { article: null, error: 'An article with this title already exists' };
    return { article: null, error: 'Failed to create article' };
  }
}

export async function updateArticle(id: string, data: {
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  status?: 'DRAFT' | 'PUBLISHED';
}) {
  try {
    const existing = await prisma.journalArticle.findUnique({ where: { id } });
    if (!existing) return { article: null, error: 'Article not found' };

    const newSlug = data.title ? toSlug(data.title) : existing.slug;
    const article = await prisma.journalArticle.update({
      where: { id },
      data: {
        title: data.title?.trim() ?? existing.title,
        slug: newSlug,
        excerpt: data.excerpt?.trim() ?? existing.excerpt,
        content: data.content?.trim() ?? existing.content,
        image: data.image?.trim() ?? existing.image,
        status: data.status ?? existing.status,
        publishedAt: data.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
    revalidatePath('/admin/journal');
    revalidatePath('/journal');
    revalidatePath(`/journal/${newSlug}`);
    return { article, error: null };
  } catch {
    return { article: null, error: 'Failed to update article' };
  }
}

export async function deleteArticle(id: string) {
  try {
    await prisma.journalArticle.delete({ where: { id } });
    revalidatePath('/admin/journal');
    revalidatePath('/journal');
    return { error: null };
  } catch {
    return { error: 'Failed to delete article' };
  }
}
