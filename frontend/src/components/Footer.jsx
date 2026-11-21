import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Code2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-icon">
                <BookOpen size={20} />
              </div>
              <span className="brand-text">Blog<span className="brand-accent">Sphere</span></span>
            </Link>
            <p className="footer-tagline">
              A modern, lightweight blogging platform designed for developers, writers, and curious minds to express ideas freely.
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/my-blogs">My Blogs</Link></li>
              <li><Link to="/create-blog">Create Blog</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/?category=Technology">Technology</Link></li>
              <li><Link to="/?category=Backend">Backend</Link></li>
              <li><Link to="/?category=Design">Design</Link></li>
              <li><Link to="/?category=General">General</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} BlogSphere. Built with React, Vite, Node.js, Express & MongoDB.
          </p>
          <div className="footer-stack-badges">
            <span className="tech-badge">MERN Stack</span>
            <span className="tech-badge">JWT Auth</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
