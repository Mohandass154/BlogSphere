/**
 * BlogSphere Automated API & Integration Test Suite
 */
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.token && { Authorization: `Bearer ${options.token}` }),
    ...options.headers
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json();
  return { status: response.status, ok: response.ok, data };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✓ ${message}`);
}

async function runTests() {
  console.log('\n========================================');
  console.log('🧪 Starting BlogSphere Test Suite');
  console.log('========================================\n');

  try {
    // 1. Health check
    console.log('Test 1: Server Health Check');
    const health = await request('/health');
    assert(health.status === 200, 'Health endpoint responds with 200 OK');
    assert(health.data.status === 'ok', 'Server status is ok');

    // 2. Fetch seeded posts
    console.log('\nTest 2: Fetch Seeded Blog Posts');
    const postsRes = await request('/posts');
    assert(postsRes.status === 200, 'GET /posts returns 200 OK');
    assert(postsRes.data.success === true, 'Response contains success=true');
    assert(postsRes.data.posts.length >= 3, `Found ${postsRes.data.posts.length} blog posts`);

    // 3. Search and Category Filter
    console.log('\nTest 3: Search and Category Filtering');
    const searchRes = await request('/posts?search=Architecture');
    assert(searchRes.status === 200, 'Search query returns 200 OK');
    assert(searchRes.data.posts.length > 0, 'Found post matching "Architecture"');

    const catRes = await request('/posts?category=Design');
    assert(catRes.status === 200, 'Category filter returns 200 OK');
    assert(catRes.data.posts.every(p => p.category === 'Design'), 'All returned posts have category "Design"');

    // 4. User Registration Validation
    console.log('\nTest 4: User Registration & Validation');
    const weakPassRes = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Test User', email: 'test@example.com', password: '123' }
    });
    assert(weakPassRes.status === 400, 'Registration with password < 6 chars fails with 400');

    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await request('/auth/register', {
      method: 'POST',
      body: {
        name: 'Jordan Lee',
        email: testEmail,
        password: 'password123',
        bio: 'Automated test suite runner.'
      }
    });
    assert(regRes.status === 201, 'Registration returns 201 Created');
    assert(regRes.data.token, 'Registration returns JWT token');
    const jordanToken = regRes.data.token;
    const jordanUser = regRes.data.user;

    // Duplicate email registration should fail
    const dupRes = await request('/auth/register', {
      method: 'POST',
      body: { name: 'Jordan Duplicate', email: testEmail, password: 'password123' }
    });
    assert(dupRes.status === 400, 'Duplicate email registration fails with 400');

    // 5. User Login
    console.log('\nTest 5: User Login');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'password123' }
    });
    assert(loginRes.status === 200, 'Login returns 200 OK');
    assert(loginRes.data.token, 'Login returns JWT token');

    const badLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: testEmail, password: 'wrongpassword' }
    });
    assert(badLogin.status === 401, 'Invalid credentials rejected with 401 Unauthorized');

    // 6. Current User Profile (/auth/me)
    console.log('\nTest 6: Verify Authenticated User (/auth/me)');
    const meRes = await request('/auth/me', { token: jordanToken });
    assert(meRes.status === 200, 'GET /auth/me returns 200 OK');
    assert(meRes.data.user.email === testEmail, 'User profile matches logged-in user');

    // 7. Create a New Blog Post
    console.log('\nTest 7: Create Blog Post');
    const unauthPost = await request('/posts', {
      method: 'POST',
      body: { title: 'Unauthorized', content: 'No token' }
    });
    assert(unauthPost.status === 401, 'Creating post without token returns 401 Unauthorized');

    const newPostRes = await request('/posts', {
      method: 'POST',
      token: jordanToken,
      body: {
        title: 'Building Modern Realtime Web Apps with React & Node',
        category: 'Technology',
        excerpt: 'An end-to-end breakdown of building reactive full-stack web applications.',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        content: `Realtime fullstack web applications require great developer tooling, robust state sync, and dependable authentication.

### Why React and Vite
The speed of modern tooling unlocks unprecedented developer productivity.`
      }
    });
    assert(newPostRes.status === 201, 'POST /posts returns 201 Created');
    assert(newPostRes.data.post.title === 'Building Modern Realtime Web Apps with React & Node', 'Post title matches');
    assert(newPostRes.data.post.author._id === jordanUser._id, 'Author assigned correctly');
    const createdPostId = newPostRes.data.post._id;

    // 8. Edit Blog Post & Authorization Check
    console.log('\nTest 8: Edit Blog Post & Ownership Protection');
    // Login as Sarah to try unauthorized edit
    const sarahLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'sarah@example.com', password: 'password123' }
    });
    const sarahToken = sarahLogin.data.token;

    const unauthEdit = await request(`/posts/${createdPostId}`, {
      method: 'PUT',
      token: sarahToken,
      body: { title: 'Hacked by Sarah' }
    });
    assert(unauthEdit.status === 403, 'Non-owner editing post is rejected with 403 Forbidden');

    // Jordan (the owner) updates the post
    const authEdit = await request(`/posts/${createdPostId}`, {
      method: 'PUT',
      token: jordanToken,
      body: {
        title: 'Building Modern Realtime Web Apps with React & Node (Updated Edition)',
        category: 'Technology'
      }
    });
    assert(authEdit.status === 200, 'Post owner can update post with 200 OK');
    assert(authEdit.data.post.title.includes('Updated Edition'), 'Updated title confirmed in response');

    // 9. Comments & Ownership Protection
    console.log('\nTest 9: Comments Creation and Deletion');
    const commentRes = await request(`/posts/${createdPostId}/comments`, {
      method: 'POST',
      token: sarahToken,
      body: { content: 'Fantastic article Jordan! Very clear explanation.' }
    });
    assert(commentRes.status === 201, 'Sarah can comment on Jordans post');
    const createdCommentId = commentRes.data.comment._id;

    // Fetch comments
    const listComments = await request(`/posts/${createdPostId}/comments`);
    assert(listComments.status === 200, 'GET comments returns 200 OK');
    assert(listComments.data.comments.some(c => c._id === createdCommentId), 'Created comment is in the list');

    // Jordan tries to delete Sarah's comment -> Should be 403 Forbidden
    const unauthDelComment = await request(`/comments/${createdCommentId}`, {
      method: 'DELETE',
      token: jordanToken
    });
    assert(unauthDelComment.status === 403, 'Non-author cannot delete comment (403 Forbidden)');

    // Sarah deletes her own comment -> Should succeed
    const authDelComment = await request(`/comments/${createdCommentId}`, {
      method: 'DELETE',
      token: sarahToken
    });
    assert(authDelComment.status === 200, 'Comment author can delete own comment');

    // 10. My Blogs Endpoint
    console.log('\nTest 10: My Blogs Dashboard Endpoint');
    const myBlogs = await request('/posts/user/me', { token: jordanToken });
    assert(myBlogs.status === 200, 'GET /posts/user/me returns 200 OK');
    assert(myBlogs.data.posts.some(p => p._id === createdPostId), 'User sees their own post in My Blogs');

    // 11. Delete Post & Authorization Check
    console.log('\nTest 11: Delete Blog Post & Ownership Protection');
    const unauthDelPost = await request(`/posts/${createdPostId}`, {
      method: 'DELETE',
      token: sarahToken
    });
    assert(unauthDelPost.status === 403, 'Non-owner cannot delete post (403 Forbidden)');

    const authDelPost = await request(`/posts/${createdPostId}`, {
      method: 'DELETE',
      token: jordanToken
    });
    assert(authDelPost.status === 200, 'Owner can delete own post');

    // Verify post is gone
    const verifyDel = await request(`/posts/${createdPostId}`);
    assert(verifyDel.status === 404, 'Deleted post returns 404 Not Found');

    console.log('\n========================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED (100%)');
    console.log('========================================\n');
  } catch (error) {
    console.error('\n❌ Test failure:', error.message);
    process.exit(1);
  }
}

runTests();
