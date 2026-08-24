'use server';

import prisma from '@/lib/db';

export async function appendAuditLog(data: {
  actorEmail: string;
  action: string;
  target?: string;
  metadata?: Record<string, any>;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorEmail: data.actorEmail,
        action: data.action,
        target: data.target || '',
        details: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    });
  } catch {
    // Non-blocking — audit failures should not interrupt the main operation
  }
}

export async function getAuditLogs(query?: string) {
  try {
    const logs = await prisma.auditLog.findMany({
      where: query ? {
        OR: [
          { actorEmail: { contains: query, mode: 'insensitive' } },
          { action: { contains: query, mode: 'insensitive' } },
          { target: { contains: query, mode: 'insensitive' } },
        ],
      } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
    return { logs, error: null };
  } catch {
    return { logs: [], error: 'Failed to fetch audit logs' };
  }
}
