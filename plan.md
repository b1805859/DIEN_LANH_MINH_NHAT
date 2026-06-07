You are a Senior Software Architect, Senior Fullstack Engineer, Senior SEO Specialist, Senior UI/UX Designer, and Technical Lead.

Build a production-ready website for:

# ĐIỆN LẠNH MINH NHẬT

A professional HVAC and Home Repair Service company located in Can Tho, Vietnam.

The project must be built as a real-world commercial product with clean architecture, scalability, maintainability, excellent SEO, and outstanding user experience.

==================================================
BUSINESS GOALS
==============

The website should:

* Introduce services professionally
* Build trust with customers
* Generate leads
* Increase phone calls
* Increase Zalo conversations
* Increase Facebook Messenger conversations
* Allow customers to request quotations
* Allow customers to book services online
* Improve local SEO rankings
* Dominate Google search results in Can Tho

The website is NOT just a company profile.

It is a Local SEO + Lead Generation platform.

==================================================
BRAND INFORMATION
=================

Brand Name:

ĐIỆN LẠNH MINH NHẬT

Business Type:

HVAC and Home Repair Services

Primary Location:

Can Tho, Vietnam

==================================================
PRIMARY SEO TARGET
==================

Target City:

Can Tho

Priority Districts:

* Ninh Kieu
* Cai Rang
* Binh Thuy
* O Mon

The SEO architecture must prioritize these districts.

==================================================
SERVICES
========

Create dedicated service pages for:

1. Tháo Lắp Máy Lạnh
2. Vệ Sinh Máy Lạnh
3. Sửa Máy Lạnh
4. Nạp Gas Máy Lạnh
5. Sửa Tủ Lạnh
6. Sửa Máy Giặt
7. Vệ Sinh Máy Giặt
8. Sửa Chữa Điện Nước

==================================================
TECHNOLOGY STACK
================

Frontend:

* Next.js 15 (App Router)
* React 19
* TypeScript
* TailwindCSS
* Shadcn/UI
* TanStack Query
* React Hook Form
* Zod
* Axios

Backend:

* NestJS
* TypeScript
* PostgreSQL
* Prisma ORM
* JWT Authentication

Infrastructure:

* Docker
* Nginx

Architecture:

* Clean Architecture
* Modular Architecture
* REST API
* Scalable Folder Structure
* Production Ready

==================================================
RENDERING STRATEGY
==================

Use Next.js App Router.

SSR (Server Side Rendering):

* Homepage
* Service Pages
* Service + District Pages
* Contact Page
* FAQ Pages

SSG (Static Site Generation):

* Blog Articles
* Blog Categories
* Service Guides

ISR (Incremental Static Regeneration):

* Blog Content
* FAQ Content
* SEO Landing Pages

All SEO pages must be rendered on the server.

The initial HTML response must contain:

* Page content
* Metadata
* Open Graph
* Structured Data
* FAQ Schema
* Local Business Schema

before JavaScript executes.

==================================================
WEBSITE PAGES
=============

Public Pages:

* Home
* About Us
* Services
* Service Detail
* Blog
* Blog Detail
* Booking
* Contact
* FAQ
* Privacy Policy
* Terms of Service

Admin Pages:

* Dashboard
* Service Management
* Blog Management
* Booking Management
* Contact Management
* Media Management
* SEO Management
* User Management

==================================================
HOMEPAGE SECTIONS
=================

* Hero Banner
* Company Introduction
* Service Categories
* Why Choose Us
* Service Coverage Areas
* Online Booking Form
* Customer Testimonials
* Service Process
* Emergency Hotline
* FAQ Section
* Latest Blog Posts
* Contact Information
* Google Maps

==================================================
CONVERSION FEATURES
===================

Global Floating Hotline Button

Global Floating Zalo OA Button

Global Floating Facebook Messenger Button

Sticky Mobile Call Button

Quick Booking Form

Request Quotation Form

Contact Form

Click-To-Call Functionality

==================================================
BOOKING SYSTEM
==============

Allow customers to:

* Select Service
* Select District
* Select Date
* Select Time
* Enter Address
* Enter Customer Information
* Add Notes

Booking Status:

* Pending
* Confirmed
* In Progress
* Completed
* Cancelled

Admin can:

* View Bookings
* Confirm Bookings
* Update Status
* Contact Customers

==================================================
CMS SYSTEM
==========

Build a complete Admin CMS.

Features:

* Login
* Dashboard
* Manage Services
* Manage Locations
* Manage Blog Posts
* Manage Categories
* Manage Tags
* Manage FAQs
* Manage Testimonials
* Manage Contact Requests
* Manage Bookings
* Manage Media Files
* Manage SEO Metadata

==================================================
PROGRAMMATIC SEO (HIGH PRIORITY)
================================

Create CMS entities:

Services

Locations

Locations:

* Ninh Kieu
* Cai Rang
* Binh Thuy
* O Mon

Automatically generate SEO landing pages for every:

Service × Location

Examples:

/areas/ninh-kieu/sua-may-lanh

/areas/ninh-kieu/ve-sinh-may-lanh

/areas/cai-rang/sua-may-lanh

/areas/binh-thuy/sua-may-giat

/areas/o-mon/sua-dien-nuoc

The system must automatically generate:

* URL Slugs
* SEO Titles
* Meta Descriptions
* Canonical URLs
* Open Graph
* Breadcrumbs
* Internal Links
* Sitemap Entries
* Structured Data

without creating pages manually.

==================================================
LOCAL SEO REQUIREMENTS
======================

Each District Page must contain:

* District Introduction
* Services Available
* Service Coverage Information
* Testimonials
* FAQs
* Booking CTA
* Contact CTA
* Google Maps Embed

Each Service + District Page must contain:

* Localized Content
* Service Benefits
* Service Process
* Pricing Information
* FAQs
* Related Services
* Related Blog Posts
* Contact CTA
* Booking CTA

==================================================
BLOG SYSTEM
===========

Build a complete SEO-focused blog.

Categories:

* Máy Lạnh
* Máy Giặt
* Tủ Lạnh
* Điện Nước
* Tiết Kiệm Điện

Features:

* Categories
* Tags
* Search
* Related Articles
* Table of Contents
* Featured Images
* Social Sharing
* SEO Metadata

Example Articles:

* Bao lâu nên vệ sinh máy lạnh một lần?
* Dấu hiệu máy lạnh cần nạp gas
* Máy lạnh không lạnh nguyên nhân do đâu?
* Máy lạnh chảy nước phải làm sao?
* Các lỗi thường gặp ở tủ lạnh
* Khi nào cần vệ sinh máy giặt?
* Mẹo tiết kiệm điện khi sử dụng máy lạnh

==================================================
SEO REQUIREMENTS
================

Implement:

* Metadata API
* Dynamic Metadata
* Open Graph
* Twitter Cards
* Canonical URLs
* Dynamic Sitemap
* Robots.txt
* JSON-LD
* Schema.org

Required Schemas:

* LocalBusiness
* HVACBusiness
* Service
* FAQPage
* BreadcrumbList
* BlogPosting
* Article

Additional SEO Features:

* Internal Linking
* Automatic Slug Generation
* SEO Friendly URLs
* Image Optimization
* Lazy Loading
* Structured Data
* Core Web Vitals Optimization

==================================================
PERFORMANCE REQUIREMENTS
========================

Google Lighthouse:

* SEO > 95
* Performance > 95
* Accessibility > 90
* Best Practices > 90

Core Web Vitals:

* LCP < 2.5s
* CLS < 0.1
* INP < 200ms

Implement:

* Code Splitting
* Route Splitting
* Lazy Loading
* Image Optimization
* Compression
* Browser Caching
* Server Caching
* CDN Ready Architecture

==================================================
SECURITY REQUIREMENTS
=====================

* JWT Authentication
* Refresh Token Strategy
* Input Validation
* Rate Limiting
* Role Based Access Control
* XSS Protection
* CSRF Protection
* Secure API Design

==================================================
DATABASE DESIGN
===============

PostgreSQL

Tables:

* Users
* Roles
* Services
* Locations
* Bookings
* ContactRequests
* BlogPosts
* Categories
* Tags
* FAQs
* Testimonials
* MediaFiles
* SEOSettings

==================================================
INTEGRATIONS
============

* Google Maps
* Google Analytics
* Google Search Console
* Facebook Messenger
* Zalo Official Account

==================================================
UI/UX REQUIREMENTS
==================

Design Style:

* Modern
* Clean
* Professional
* Trustworthy
* Conversion Focused

Color Palette:

* Blue
* White
* Light Gray

Requirements:

* Mobile First
* Fully Responsive
* Fast Loading
* Accessible
* User Friendly
* SEO Friendly

==================================================
DELIVERABLES
============

Generate:

* Complete Folder Structure
* Frontend Architecture
* Backend Architecture
* Database Design
* Prisma Schema
* REST API Design
* Authentication System
* Authorization System
* Admin CMS
* Blog System
* Booking System
* Programmatic SEO System
* SSR Implementation
* SEO Architecture
* Reusable Components
* Docker Configuration
* Nginx Configuration
* Environment Variables Example
* Deployment Guide

Build this project as a real-world production-ready application optimized for Local SEO dominance in Can Tho, especially in Ninh Kieu, Cai Rang, Binh Thuy, and O Mon.


AI INSTRUCTIONS

Before making any code changes:

Read this entire document.
Treat this file as the single source of truth.
Do not implement features not defined here.
Break implementation into phases.
Implement one phase at a time.
Explain architectural decisions.
Update task progress after each phase.
Follow all SEO requirements.
Follow all architecture requirements.
Follow all technology stack requirements.

Implementation Order:

Phase 1:

Project Setup
Docker
PostgreSQL
Prisma
NestJS
Next.js

Phase 2:

Authentication
Authorization

Phase 3:

CMS

Phase 4:

Booking System

Phase 5:

Blog System

Phase 6:

SEO

Phase 7:

Programmatic SEO

Phase 8:

Integrations

Phase 9:

Optimization
Testing
Production Deployment