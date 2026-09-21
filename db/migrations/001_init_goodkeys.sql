CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS gk;

CREATE TABLE IF NOT EXISTS gk.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'tenant'
    CHECK (role IN ('tenant', 'agent', 'landlord', 'admin')),
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'disabled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gk.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES gk.users(id) ON DELETE CASCADE,
  business_name TEXT,
  bio TEXT,
  office_address TEXT,
  cac_number TEXT,
  profile_image_url TEXT,
  verification_status TEXT NOT NULL DEFAULT 'unverified'
    CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected', 'suspended')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gk.agent_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  id_type TEXT,
  id_document_url TEXT,
  selfie_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES gk.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gk.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  property_type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms INTEGER NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  toilets INTEGER NOT NULL DEFAULT 0 CHECK (toilets >= 0),
  state TEXT NOT NULL,
  lga TEXT,
  area TEXT NOT NULL,
  street_address TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  annual_rent NUMERIC(14,2) NOT NULL CHECK (annual_rent >= 0),
  agency_fee NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (agency_fee >= 0),
  legal_fee NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (legal_fee >= 0),
  caution_fee NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (caution_fee >= 0),
  service_charge NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (service_charge >= 0),
  inspection_fee NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (inspection_fee >= 0),
  other_charges NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (other_charges >= 0),
  furnished BOOLEAN NOT NULL DEFAULT FALSE,
  serviced BOOLEAN NOT NULL DEFAULT FALSE,
  parking_spaces INTEGER NOT NULL DEFAULT 0 CHECK (parking_spaces >= 0),
  listing_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (listing_status IN ('draft', 'submitted', 'pending_review', 'approved', 'active', 'rejected', 'inactive', 'rented')),
  verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  available_from DATE,
  views_count INTEGER NOT NULL DEFAULT 0 CHECK (views_count >= 0),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gk_properties_location
  ON gk.properties (state, lga, area);

CREATE INDEX IF NOT EXISTS idx_gk_properties_search
  ON gk.properties (listing_status, property_type, bedrooms, annual_rent);

CREATE INDEX IF NOT EXISTS idx_gk_properties_agent
  ON gk.properties (agent_user_id);

CREATE TABLE IF NOT EXISTS gk.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES gk.properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gk_property_images_property
  ON gk.property_images (property_id, sort_order);

CREATE TABLE IF NOT EXISTS gk.property_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES gk.properties(id) ON DELETE CASCADE,
  amenity TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, amenity)
);

CREATE TABLE IF NOT EXISTS gk.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES gk.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, property_id)
);

CREATE TABLE IF NOT EXISTS gk.inspection_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES gk.properties(id) ON DELETE CASCADE,
  tenant_user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  agent_user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  requested_at TIMESTAMPTZ NOT NULL,
  visitor_count INTEGER NOT NULL DEFAULT 1 CHECK (visitor_count > 0),
  tenant_note TEXT,
  agent_note TEXT,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'declined', 'no_show')),
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gk_inspections_tenant
  ON gk.inspection_bookings (tenant_user_id, requested_at);

CREATE INDEX IF NOT EXISTS idx_gk_inspections_agent
  ON gk.inspection_bookings (agent_user_id, requested_at);

CREATE TABLE IF NOT EXISTS gk.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES gk.properties(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gk.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES gk.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS gk.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES gk.conversations(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gk_messages_conversation
  ON gk.messages (conversation_id, created_at);

CREATE TABLE IF NOT EXISTS gk.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gk_notifications_user
  ON gk.notifications (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS gk.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id UUID REFERENCES gk.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES gk.properties(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES gk.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES gk.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gk.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES gk.users(id) ON DELETE RESTRICT,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gk.schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
