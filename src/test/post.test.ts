import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app  from '../index'; 
import prisma from '../../prisma/client'; 

describe('Post API Integration Tests (without mocks)', () => {

  beforeAll(async () => {
    try {
      
      await prisma.$connect();
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should return an empty array when there are no posts', async () => {
    await prisma.post.deleteMany({});

    const req = new Request('http://localhost:3000/api/posts');
    const res = await app.request(req);
    const body = await res.json();


    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('List Data Posts!');
  });

  it('should create a new post and return it', async () => {
    const newPostData = { title: 'First Post', content: 'This is my first post content.' };

    const req = new Request('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPostData),
    });

    const res = await app.request(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Post Created Successfully!');
    expect(body.data.title).toBe(newPostData.title);
    expect(body.data.content).toBe(newPostData.content);
    expect(body.data.id).toBeDefined();

    const createdPost = await prisma.post.findUnique({ where: { id: body.data.id } });
    expect(createdPost).toBeDefined();

    // await prisma.post.delete({ where: { id: body.data.id } });
  });

  it('should return a specific post when found', async () => {
    const postToFind = await prisma.post.create({
      data: {
        title: 'Post to Find',
        content: 'This post is created for testing.',
      },
    });

    const req = new Request(`http://localhost:3000/api/posts/${postToFind.id}`);
    const res = await app.request(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.data.id).toBe(postToFind.id);
    expect(body.data.title).toBe(postToFind.title);

    // await prisma.post.delete({ where: { id: postToFind.id } });
  });

  it('should return 404 for a post that does not exist', async () => {
    const req = new Request('http://localhost:3000/api/posts/9999');
    const res = await app.request(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.message).toBe('Post Not Found!');
    // expect(body.success).toBe(true);
  });


});
