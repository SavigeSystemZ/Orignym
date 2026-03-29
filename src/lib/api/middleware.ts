import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function validateApiKey(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header. Expected "Bearer <api_key>"', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: token },
      include: { organization: true }
    });

    if (!apiKey) {
      return { error: 'Invalid API Key', status: 401 };
    }

    // Update last used timestamp asynchronously (fire and forget to not block response)
    prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { last_used_at: new Date() }
    }).catch(console.error);

    return { apiKey, status: 200 };
  } catch (error) {
    console.error("API Key validation error:", error);
    return { error: 'Internal server error during validation', status: 500 };
  }
}

// Next.js standard middleware could go here, but for API routes we often use wrapper functions
// to maintain type safety with the Prisma client which isn't fully supported in Edge runtime yet.
