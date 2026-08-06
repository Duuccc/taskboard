import { describe, it, expect, beforeEach } from "vitest";
import { query } from "../../db/index.js"
import { createTestUser, authPost, authGet } from "../helper.js"
import app from "../../app.js";
import request from "supertest"

beforeEach(async () => {
  await query('DELETE FROM tasks');
  await query('DELETE FROM refresh_tokens');  // before users
  await query('DELETE FROM boards');
  await query('DELETE FROM users');           // last
});

describe('POST /api/tasks', () => {
  it('creates a task on a board', async () => {
    const user = await createTestUser();

    console.log(user)

    // create a board first
    const boardRes = await authPost(user.accessToken, '/api/boards', {
      title: 'Test Board',
    });
    const boardId = boardRes.body.id;

    // create a task on that board
    const res = await authPost(user.accessToken, '/api/tasks', {
      board_id: boardId,
      title: 'My first task',
      status: 'todo',
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('My first task');
    expect(res.body.status).toBe('todo');
    expect(res.body.board_id).toBe(boardId);
  });

  it('returns 401 without a token', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ board_id: 1, title: 'Task' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/tasks', () => {
  it('returns paginated tasks for a board', async () => {
    const user = await createTestUser();

    const boardRes = await authPost(user.accessToken, '/api/boards', {
      title: 'Test Board',
    });
    const boardId = boardRes.body.id;

    // create 3 tasks
    for (let i = 1; i <= 3; i++) {
      await authPost(user.accessToken, '/api/tasks', {
        board_id: boardId,
        title: `Task ${i}`,
      });
    }

    const res = await authGet(
      user.accessToken,
      `/api/tasks?board_id=${boardId}`
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(3);
    expect(res.body.meta.total).toBe(3);
  });
});