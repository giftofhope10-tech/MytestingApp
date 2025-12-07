import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import type { BlogPost } from '../../../lib/types';
import { validateSession, isAdmin } from '../../../lib/session';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function validateAdminRequest(req: NextApiRequest): Promise<{ valid: boolean; email?: string; error?: string }> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return { valid: false, error: 'No session token provided' };
  }

  const session = await validateSession(token);
  
  if (!session.valid || !session.email) {
    return { valid: false, error: 'Invalid or expired session' };
  }

  const adminCheck = await isAdmin(session.email);
  
  if (!adminCheck.isAdmin) {
    return { valid: false, error: 'Unauthorized: Only admins can perform this action' };
  }

  return { valid: true, email: session.email };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { adminView } = req.query;
      
      if (adminView) {
        const authResult = await validateAdminRequest(req);
        
        if (!authResult.valid) {
          return res.status(401).json({ error: authResult.error });
        }
      }
      
      const blogsRef = adminDb.collection('blogs');
      
      const snapshot = await blogsRef.get();
      
      let blogs: BlogPost[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        blogs.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt || 0,
          updatedAt: data.updatedAt || data.createdAt || 0,
        } as BlogPost);
      });
      
      blogs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      
      if (!adminView) {
        blogs = blogs.filter(blog => blog.status === 'published');
        blogs.sort((a, b) => (b.publishedAt || b.createdAt || 0) - (a.publishedAt || a.createdAt || 0));
      }
      
      return res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  }

  if (req.method === 'POST') {
    const authResult = await validateAdminRequest(req);
    
    if (!authResult.valid) {
      return res.status(401).json({ error: authResult.error });
    }

    try {
      const { title, excerpt, content, status } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const id = uuidv4();
      const slug = generateSlug(title);
      const now = Date.now();

      const newBlog = {
        id,
        slug,
        title,
        excerpt: excerpt || '',
        content,
        author: authResult.email,
        status: status || 'draft',
        createdAt: now,
        updatedAt: now,
        ...(status === 'published' && { publishedAt: now }),
      };

      await adminDb.collection('blogs').doc(id).set(newBlog);

      return res.status(201).json({ id, slug, message: 'Blog post created successfully' });
    } catch (error) {
      console.error('Error creating blog:', error);
      return res.status(500).json({ error: 'Failed to create blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
