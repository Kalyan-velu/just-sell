# Storefront Backend Schema Documentation

This document provides a detailed explanation of the database schema, entity relationships, design principles, and best practices discussed and refined throughout the conversation. It covers users, sellers, stores, products, options, variants, media, and supporting systems.

## 1. Overview
This schema is designed for a scalable e-commerce storefront backend using PostgreSQL. It supports multi-store architecture, product catalogs, variants, media management, and seller–customer ecosystems.

---

## 2. Core Entities

### **Users**
Represents platform users identified by phone/email. Used by sellers and customers.
- Tracks onboarding.

### **Customers**
Linked directly to a user. Represents buyers.

### **Sellers**
Sellers own stores. Each seller is tied to a user account and optional address.

---

## 3. Stores & Payments
Stores contain product catalogs. Each store:
- Has its own currency, charges, and minimum cart value.
- Is tied to a seller (owner).

Payments table stores UPI/payment configurations for stores.

---

## 4. Socials
A flexible table linking social media info to:
- Sellers
- Stores
- Customers

`refId` supports multi-entity association.

---

## 5. Categories
Categories are store-scoped. Products can belong to multiple categories through `product_categories`.

---

## 6. Product System
### **Products**
Products belong to stores and contain:
- Name, slug
- Description (text + rich JSON)
- SEO fields
- Thumbnail
- Arbitrary properties (JSONB)
- Status & visibility

### **Options**
Attributes like "Color", "Size", etc. Each product can have unlimited options.

### **Option Values**
Each option has multiple values such as "Red", "Large", etc.
- Supports `meta` for swatch colors, images, etc.

---

## 7. Variants
A variant is a sellable unit determined by a combination of option values.

Variants contain:
- SKU (admin override or auto-generated)
- Unique `variant_hash` (deterministic hash of option_value IDs)
- Price & compare price
- Inventory
- Shipping dimensions
- Status
- `selected_options` cached JSON for fast reads

### **variant_option_values**
Source-of-truth mapping between variants and option values.

### **disabled_combinations**
Stores invalid option combinations for a product.
Used to prevent impossible or unavailable variant combinations.

---

## 8. Media System
### **media**
Stores uploaded media assets including:
- Provider
- Storage key
- MIME type
- Transformed variants
- Metadata

### **media_links** (Polymorphic)
Links media to:
- Products
- Variants
- Option Values

Supports purposes like:
- gallery
- thumbnail
- swatch
- manual

---

## 9. Indexing & Performance Strategies
- Unique indexes on options, option values, and variant combinations.
- GIN indexing recommended for JSONB fields.
- Polymorphic media requires application-level validation.
- Using `selected_options` reduces join-heavy reads.
- `variant_hash` prevents duplicate combinations.

---

## 10. SEO & Metadata
Products include:
- meta_title
- meta_description
- canonical link
- OG image

---

## 11. Shipping Support
Variants support dimensional weight through:
- weight
- height
- width
- length

---

## 12. Storefront Compatibility
The schema supports:
- Multi-store systems
- Shopify-like variant structures
- Option-based variant generation
- Polymorphic media like Saleor/Medusa

---

## 13. Future Extensions
- Product versioning
- Draft autosaves
- Collection pages
- Discounts, coupons
- Inventory reservations
- Order & checkout system

---

## 14. Final DBML Output
The entire DBML generated in the conversation has been implemented based on:
- performance
- scalability
- correctness
- e-commerce best practices

(Refer to the schema section in the conversation for the code.)

---

## 15. Summary
This schema is:
- Production-ready
- Highly scalable
- Compatible with modern e-commerce architectures
- Ready for NestJS + Sequelize + PostgreSQL

It covers every essential part of a real-world product and variant system including media, categories, combinations, and seller relationships.

---

End of documentation.

