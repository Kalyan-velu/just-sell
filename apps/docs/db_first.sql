CREATE TABLE "users" (
  "id" uuid PRIMARY KEY,
  "phone" string UNIQUE NOT NULL,
  "email" varchar UNIQUE,
  "isOnboard" boolean DEFAULT false,
  "timestamp" timestamp DEFAULT (now())
);

CREATE TABLE "customers" (
  "id" uuid PRIMARY KEY,
  "userId" uuid UNIQUE NOT NULL
);

CREATE TABLE "address" (
  "id" uuid PRIMARY KEY,
  "addressLine1" string,
  "addressLine2" string,
  "city" string,
  "state" string,
  "country" string DEFAULT 'india',
  "pinCode" string
);

CREATE TABLE "sellers" (
  "id" uuid PRIMARY KEY,
  "name" string NOT NULL,
  "userId" uuid UNIQUE NOT NULL,
  "address" uuid UNIQUE
);

CREATE TABLE "stores" (
  "id" uuid PRIMARY KEY,
  "name" string NOT NULL,
  "subDomain" varchar UNIQUE NOT NULL,
  "owner" varchar NOT NULL,
  "minCartValue" number NOT NULL,
  "currency" varchar NOT NULL DEFAULT 'INR',
  "charges" number,
  "status" varchar NOT NULL DEFAULT 'active'
);

CREATE TABLE "store_payments" (
  "id" uuid PRIMARY KEY,
  "refId" uuid NOT NULL,
  "upi" varchar NOT NULL
);

CREATE TABLE "socials" (
  "id" uuid PRIMARY KEY,
  "storeId" uuid,
  "sellerId" uuid,
  "key" string DEFAULT 'instagram',
  "value" string
);

CREATE TABLE "categories" (
  "id" uuid PRIMARY KEY,
  "storeId" uuid NOT NULL,
  "name" string NOT NULL,
  "slug" string UNIQUE NOT NULL
);

CREATE TABLE "product_categories" (
  "id" uuid PRIMARY KEY,
  "productId" uuid NOT NULL,
  "categoryId" uuid NOT NULL
);

CREATE TABLE "products" (
  "id" uuid PRIMARY KEY,
  "storeId" uuid NOT NULL,
  "name" string NOT NULL,
  "slug" string UNIQUE NOT NULL,
  "short_description" string,
  "description" jsonb,
  "properties" jsonb,
  "status" varchar NOT NULL DEFAULT 'draft',
  "visibility" varchar NOT NULL DEFAULT 'listed',
  "thumbnailMediaId" uuid,
  "meta_title" string,
  "meta_description" string,
  "meta_canonical" string,
  "meta_og_image" uuid,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "options" (
  "id" uuid PRIMARY KEY,
  "productId" uuid NOT NULL,
  "name" string NOT NULL,
  "display_order" int NOT NULL DEFAULT 0
);

CREATE TABLE "option_values" (
  "id" uuid PRIMARY KEY,
  "optionId" uuid NOT NULL,
  "value" string NOT NULL,
  "display_order" int NOT NULL DEFAULT 0,
  "meta" jsonb
);

CREATE TABLE "variants" (
  "id" uuid PRIMARY KEY,
  "productId" uuid NOT NULL,
  "sku" string UNIQUE NOT NULL,
  "variant_hash" string UNIQUE NOT NULL,
  "title" string,
  "price" number NOT NULL,
  "compare_at_price" number,
  "currency" varchar DEFAULT 'INR',
  "inventory_count" int NOT NULL DEFAULT 0,
  "inventory_policy" varchar NOT NULL DEFAULT 'deny',
  "weight" number,
  "length" number,
  "width" number,
  "height" number,
  "status" varchar NOT NULL DEFAULT 'active',
  "selected_options" jsonb NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "variant_option_values" (
  "id" uuid PRIMARY KEY,
  "variantId" uuid NOT NULL,
  "optionValueId" uuid NOT NULL
);

CREATE TABLE "disabled_combinations" (
  "id" uuid PRIMARY KEY,
  "productId" uuid NOT NULL,
  "option_value_ids" jsonb NOT NULL,
  "reason" string
);

CREATE TABLE "media" (
  "id" uuid PRIMARY KEY,
  "provider" string NOT NULL,
  "storage_key" string NOT NULL,
  "mime_type" string NOT NULL,
  "width" int,
  "height" int,
  "size_bytes" bigint,
  "alt_text" string,
  "type" string NOT NULL DEFAULT 'image',
  "variants" jsonb,
  "uploaded_at" timestamp DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "media_links" (
  "id" uuid PRIMARY KEY,
  "mediaId" uuid NOT NULL,
  "entity_type" string NOT NULL,
  "entity_id" uuid NOT NULL,
  "purpose" string NOT NULL,
  "display_order" int DEFAULT 0,
  "is_cover" boolean DEFAULT false
);

CREATE TABLE "orders" (
  "id" uuid PRIMARY KEY,
  "storeId" uuid NOT NULL,
  "customerId" uuid,
  "guest_name" string,
  "guest_email" string,
  "guest_phone" string,
  "shipping_address" jsonb NOT NULL,
  "subtotal" number NOT NULL,
  "discount" number DEFAULT 0,
  "tax" number DEFAULT 0,
  "shipping_fee" number DEFAULT 0,
  "total" number NOT NULL,
  "currency" string DEFAULT 'INR',
  "status" string NOT NULL DEFAULT 'pending',
  "cashfree_order_id" string,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "order_items" (
  "id" uuid PRIMARY KEY,
  "orderId" uuid NOT NULL,
  "productId" uuid NOT NULL,
  "variantId" uuid NOT NULL,
  "quantity" int NOT NULL,
  "unit_price" number NOT NULL,
  "total_price" number NOT NULL,
  "title" string,
  "selected_options" jsonb
);

CREATE TABLE "payments" (
  "id" uuid PRIMARY KEY,
  "orderId" uuid UNIQUE NOT NULL,
  "cashfree_order_id" string NOT NULL,
  "payment_session_id" string,
  "payment_reference_id" string,
  "payment_signature" string,
  "amount" number NOT NULL,
  "currency" string DEFAULT 'INR',
  "status" string NOT NULL DEFAULT 'pending',
  "raw_request" jsonb,
  "raw_response" jsonb,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE UNIQUE INDEX ON "product_categories" ("productId", "categoryId");

CREATE UNIQUE INDEX ON "options" ("productId", "name");

CREATE UNIQUE INDEX ON "option_values" ("optionId", "value");

CREATE UNIQUE INDEX ON "variant_option_values" ("variantId", "optionValueId");

CREATE UNIQUE INDEX ON "media" ("provider", "storage_key");

COMMENT ON TABLE "users" IS 'All platform users (sellers + customers). Phone is primary login.';

COMMENT ON COLUMN "users"."phone" IS 'Primary identifier for OTP login';

COMMENT ON COLUMN "users"."email" IS 'Optional — not required for guest checkout';

COMMENT ON COLUMN "users"."isOnboard" IS 'True when user completes profile';

COMMENT ON TABLE "customers" IS 'A user becomes a customer only when purchasing or registering.';

COMMENT ON TABLE "address" IS 'Reusable address entity (used mainly for sellers). Orders use snapshots, not FKs.';

COMMENT ON TABLE "sellers" IS 'A seller owns one or more stores.';

COMMENT ON COLUMN "sellers"."address" IS 'Seller business address';

COMMENT ON TABLE "stores" IS 'Each store is independently managed by a seller. Products belong to stores.';

COMMENT ON COLUMN "stores"."subDomain" IS 'Used for multi-tenant storefront URLs';

COMMENT ON COLUMN "stores"."minCartValue" IS 'Minimum order value before checkout';

COMMENT ON COLUMN "stores"."charges" IS 'Any platform or additional store fees';

COMMENT ON TABLE "store_payments" IS 'Store-specific payment settings (UPI, Cashfree keys, etc.)';

COMMENT ON TABLE "socials" IS 'Flexible relationship for seller or store social links.';

COMMENT ON COLUMN "socials"."key" IS 'Platform — instagram, facebook, youtube';

COMMENT ON COLUMN "socials"."value" IS 'Actual profile URL';

COMMENT ON TABLE "categories" IS 'Categories are store-scoped. Products can belong to many categories.';

COMMENT ON TABLE "product_categories" IS 'Many-to-many mapping between products & categories.';

COMMENT ON TABLE "products" IS 'Main product entity. Never deletes — only archived.';

COMMENT ON COLUMN "products"."slug" IS 'Storefront-friendly SEO identifier';

COMMENT ON COLUMN "products"."description" IS 'Rich text or editor blocks';

COMMENT ON COLUMN "products"."properties" IS 'Custom attributes (Material, Fit, GSM, etc.)';

COMMENT ON COLUMN "products"."thumbnailMediaId" IS 'Used for product listing fast-load';

COMMENT ON TABLE "options" IS 'Product attributes (Color, Size, Storage, Material).';

COMMENT ON TABLE "option_values" IS 'Individual option values (Red, Blue, Small, 128GB).';

COMMENT ON COLUMN "option_values"."meta" IS 'Optional: hex color, swatch image';

COMMENT ON TABLE "variants" IS 'SKU = sellable item. Identified by combination of option values.';

COMMENT ON COLUMN "variants"."sku" IS 'Editable by seller OR auto-generated';

COMMENT ON COLUMN "variants"."variant_hash" IS 'Deterministic hash of optionValueIds';

COMMENT ON COLUMN "variants"."title" IS 'Optional override title — e.g., “Red / XL”';

COMMENT ON COLUMN "variants"."selected_options" IS 'Cached snapshot for instant reads';

COMMENT ON TABLE "variant_option_values" IS 'Source of truth mapping for variant configuration.';

COMMENT ON TABLE "disabled_combinations" IS 'Prevents invalid or unavailable variant combos.';

COMMENT ON COLUMN "disabled_combinations"."option_value_ids" IS 'Sorted array for deterministic matching';

COMMENT ON TABLE "media" IS 'Source media stored in Cloud (S3/Azure/R2). Never store full URL.';

COMMENT ON COLUMN "media"."provider" IS 's3 | gcs | azure | cloudflare';

COMMENT ON COLUMN "media"."storage_key" IS 'Path/key inside provider bucket';

COMMENT ON COLUMN "media"."variants" IS 'Generated thumbnails/webp versions';

COMMENT ON COLUMN "media"."deleted_at" IS 'Soft delete — prevents broken references';

COMMENT ON TABLE "media_links" IS 'Universal linking table for product gallery, variant images & swatches.';

COMMENT ON COLUMN "media_links"."entity_type" IS 'product | variant | option_value';

COMMENT ON COLUMN "media_links"."entity_id" IS 'Resolved in application';

COMMENT ON COLUMN "media_links"."purpose" IS 'gallery | thumbnail | swatch | video_thumbnail | manual';

COMMENT ON TABLE "orders" IS 'Supports guest checkout + customer checkout.';

COMMENT ON COLUMN "orders"."customerId" IS 'Null when guest checkout';

COMMENT ON COLUMN "orders"."shipping_address" IS 'Snapshot of address';

COMMENT ON COLUMN "orders"."cashfree_order_id" IS 'Used for Cashfree V2 APIs';

COMMENT ON TABLE "order_items" IS 'Order items are snapshots — never depend on live product data.';

COMMENT ON COLUMN "order_items"."title" IS 'Snapshot of product/variant title';

COMMENT ON COLUMN "order_items"."selected_options" IS 'Snapshot of selected option values';

COMMENT ON TABLE "payments" IS 'One payment per order. Supports Cashfree session + callbacks.';

COMMENT ON COLUMN "payments"."payment_session_id" IS 'Cashfree payment session';

COMMENT ON COLUMN "payments"."payment_reference_id" IS 'Cashfree callback reference';

COMMENT ON COLUMN "payments"."raw_request" IS 'Cache Cashfree create-order request';

COMMENT ON COLUMN "payments"."raw_response" IS 'Cache Cashfree callback';

ALTER TABLE "customers" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "sellers" ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");

ALTER TABLE "sellers" ADD FOREIGN KEY ("address") REFERENCES "address" ("id");

ALTER TABLE "stores" ADD FOREIGN KEY ("owner") REFERENCES "sellers" ("id");

ALTER TABLE "store_payments" ADD FOREIGN KEY ("refId") REFERENCES "stores" ("id");

ALTER TABLE "socials" ADD FOREIGN KEY ("storeId") REFERENCES "stores" ("id");

ALTER TABLE "socials" ADD FOREIGN KEY ("sellerId") REFERENCES "sellers" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("storeId") REFERENCES "stores" ("id");

ALTER TABLE "product_categories" ADD FOREIGN KEY ("productId") REFERENCES "products" ("id");

ALTER TABLE "product_categories" ADD FOREIGN KEY ("categoryId") REFERENCES "categories" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("storeId") REFERENCES "stores" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("thumbnailMediaId") REFERENCES "media" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("meta_og_image") REFERENCES "media" ("id");

ALTER TABLE "options" ADD FOREIGN KEY ("productId") REFERENCES "products" ("id");

ALTER TABLE "option_values" ADD FOREIGN KEY ("optionId") REFERENCES "options" ("id");

ALTER TABLE "variants" ADD FOREIGN KEY ("productId") REFERENCES "products" ("id");

ALTER TABLE "variant_option_values" ADD FOREIGN KEY ("variantId") REFERENCES "variants" ("id");

ALTER TABLE "variant_option_values" ADD FOREIGN KEY ("optionValueId") REFERENCES "option_values" ("id");

ALTER TABLE "disabled_combinations" ADD FOREIGN KEY ("productId") REFERENCES "products" ("id");

ALTER TABLE "media_links" ADD FOREIGN KEY ("mediaId") REFERENCES "media" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("storeId") REFERENCES "stores" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("customerId") REFERENCES "customers" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("orderId") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("productId") REFERENCES "products" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("variantId") REFERENCES "variants" ("id");

ALTER TABLE "payments" ADD FOREIGN KEY ("orderId") REFERENCES "orders" ("id");
