import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '../../../lib/firebase-admin';
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
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const blogDoc = await adminDb.collection('blogs').doc(id as string).get();
      
      if (!blogDoc.exists) {
        const blogsRef = adminDb.collection('blogs');
        const slugSnapshot = await blogsRef.where('slug', '==', id).get();
        
        if (slugSnapshot.empty) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        
        let blogData: BlogPost | null = null;
        slugSnapshot.forEach((doc) => {
          blogData = { id: doc.id, ...doc.data() } as BlogPost;
        });
        
        return res.status(200).json(blogData);
      }
      
      return res.status(200).json({ id: blogDoc.id, ...blogDoc.data() });
    } catch (error) {
      console.error('Error fetching blog:', error);
      return res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  }

  if (req.method === 'PUT') {
    const authResult = await validateAdminRequest(req);
    
    if (!authResult.valid) {
      return res.status(401).json({ error: authResult.error });
    }

    try {
      const { title, excerpt, content, status } = req.body;

      const blogDoc = await adminDb.collection('blogs').doc(id as string).get();
      
      if (!blogDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      const existingData = blogDoc.data() as BlogPost;
      const now = Date.now();
      
      const updateData: Partial<BlogPost> = {
        updatedAt: now,
      };

      if (title) {
        updateData.title = title;
        updateData.slug = generateSlug(title);
      }
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (content) updateData.content = content;
      if (status) {
        updateData.status = status;
        if (status === 'published' && existingData.status !== 'published') {
          updateData.publishedAt = now;
        }
      }

      await adminDb.collection('blogs').doc(id as string).update(updateData);

      return res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error) {
      console.error('Error updating blog:', error);
      return res.status(500).json({ error: 'Failed to update blog post' });
    }
  }

  if (req.method === 'DELETE') {
    const authResult = await validateAdminRequest(req);
    
    if (!authResult.valid) {
      return res.status(401).json({ error: authResult.error });
    }

    try {
      const blogDoc = await adminDb.collection('blogs').doc(id as string).get();
      
      if (!blogDoc.exists) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      await adminDb.collection('blogs').doc(id as string).delete();

      return res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      return res.status(500).json({ error: 'Failed to delete blog post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
