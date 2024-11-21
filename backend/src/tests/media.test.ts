import request from 'supertest';
import app from '../app';
import { urlQueue } from '../infrastructure/queue';
import { describe, it } from 'node:test';
import { createServer } from 'http';
import { assert, expect } from 'chai';

describe('Integration Test: POST /api/media', () => {
  const server = createServer(app);

  it('should handle 5000 concurrent requests to POST /api/media', async () => {
    const mockUrls = Array.from({ length: 5000 }, () => [`https://peticon.edu.vn/hoc-vien`, `https://imagevietnam.vn/`]);
    
    const requests = mockUrls.map((urls) =>
      request(app).post('/api/media').set("Authorization", "Basic YWRtaW46cGFzc3dvcmQ=").send({ urls: urls })
    );

    const responses = await Promise.all(requests);

    assert.equal(responses.length, 5000);

    responses.forEach((res: any) => {
      assert.equal(res.status, 202);
    });

    const queueJobs = await urlQueue.getJobs();
    assert.isArray(queueJobs);
    expect(queueJobs.length).greaterThan(0);
    await server.close();
  });
});

