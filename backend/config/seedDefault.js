const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

const seedDefaultIfEmpty = async () => {
  try {
    const postCount = await Post.countDocuments();
    if (postCount > 0) {
      console.log(`Database already has ${postCount} posts.`);
      return;
    }

    console.log('Database is empty. Seeding initial BlogSphere content...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    let user1 = await User.findOne({ email: 'sarah@example.com' });
    if (!user1) {
      user1 = await User.create({
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        password: passwordHash,
        bio: 'Tech enthusiast, full-stack engineer and writer.'
      });
    }

    let user2 = await User.findOne({ email: 'alex@example.com' });
    if (!user2) {
      user2 = await User.create({
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: passwordHash,
        bio: 'Digital nomad exploring modern web frameworks and UI/UX design.'
      });
    }

    const post1 = await Post.create({
      title: 'The Future of Modern Web Development in 2026',
      category: 'Technology',
      excerpt: 'Exploring how modern toolchains, AI-assisted development, and reactive architectures are reshaping how we build web apps.',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      content: `Web development has evolved dramatically over the last few years. The shift toward streamlined developer experience, lightning-fast bundlers like Vite, and unified full-stack mental models has redefined product engineering.

### The Rise of Component-Driven Design
Modularity is no longer just a best practice—it is the foundation of scalable systems. Clean architectures with reusable UI elements, clear separation of backend logic, and declarative state make modern software resilient and enjoyable to build.

### Fast, Lean, and Accessible
Users expect web applications to load instantly and behave predictably across both desktop workstations and mobile screens. Adopting lightweight utility styling, semantic HTML, and responsive layouts allows us to deliver high performance without sacrificing visual elegance.`,
      author: user1._id
    });

    const post2 = await Post.create({
      title: 'Mastering Clean Architecture with Express and MongoDB',
      category: 'Backend',
      excerpt: 'A practical guide to structuring RESTful APIs with Node.js, Express, and Mongoose for maintainability and scalability.',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      content: `When building backend applications, getting the structure right early saves hours of refactoring down the road. 

### Why Layered Architecture Matters
Separating concerns into Controllers, Models, Routes, and Middleware ensures:
1. **Controllers** handle incoming requests, validate input, and send responses.
2. **Models** define your data schema and encapsulate business rules.
3. **Middleware** handles cross-cutting concerns such as authentication, request logging, and global error handling.

### Secure By Default
Security should never be an afterthought. Using salted password hashing with bcrypt, stateless JWT authentication, and scoped resource authorization guarantees that users can only modify their own content.`,
      author: user2._id
    });

    const post3 = await Post.create({
      title: 'Designing Minimalist User Interfaces That Users Love',
      category: 'Design',
      excerpt: 'Why minimalism and thoughtful whitespace create delightful, intuitive digital experiences.',
      coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      content: `Good design is as little design as possible. When every element on the screen serves a purpose, users can focus effortlessly on what matters most: content.

### Visual Hierarchy and Typography
By carefully balancing font weights, line heights, and subtle color contrasts, you can guide the reader's eye naturally from titles to paragraphs and calls to action without visual clutter.

### Micro-interactions and Polish
Smooth hover transitions, thoughtful loading feedback, and intuitive confirmations transform functional apps into delightful products.`,
      author: user1._id
    });

    await Comment.create({
      post: post1._id,
      author: user2._id,
      content: 'Fantastic read Sarah! The point about modular components and responsive layouts resonates deeply.'
    });

    await Comment.create({
      post: post2._id,
      author: user1._id,
      content: 'Well written Alex! Having strong error handling and authorization middleware is so critical.'
    });

    console.log('🌱 Successfully initialized default sample posts and comments.');
  } catch (error) {
    console.error('Initial seeding notice:', error.message);
  }
};

module.exports = seedDefaultIfEmpty;
