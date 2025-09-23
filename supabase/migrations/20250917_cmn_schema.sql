-- =====================================================
-- COMPREHENSIVE SAAS ANALYTICS DATA WAREHOUSE SCHEMA
-- =====================================================
-- Supports: Multi-tenant, B2B/B2C/Hybrid, GDPR compliance,
-- Revenue recognition, Real-time capabilities, Advanced analytics
-- =====================================================

-- =====================================================
-- 1. CORE CALENDAR DIMENSION
-- =====================================================
-- Create schema if it does not exist
CREATE SCHEMA IF NOT EXISTS cmn;

-- Create schema if it does not exist
CREATE SCHEMA IF NOT EXISTS SAS;

-- Create schema if it does not exist
CREATE SCHEMA IF NOT EXISTS app;


CREATE TABLE cmn.tb_cmd_clndr (
    clndr_id INTEGER PRIMARY KEY,              
    cal_dt DATE NOT NULL UNIQUE,               
    day_start_dt TIMESTAMP NOT NULL,           
    day_end_dt TIMESTAMP NOT NULL,
    
    -- Day attributes
    day_of_week_nm VARCHAR(10) NOT NULL,       
    day_of_week_nbr INTEGER NOT NULL,          
    is_weekend_ind CHAR(1) NOT NULL DEFAULT 'N',
    is_holiday_ind CHAR(1) NOT NULL DEFAULT 'N',
    is_weekday_ind CHAR(1) NOT NULL DEFAULT 'Y',
    is_month_end_ind CHAR(1) DEFAULT 'N',
    is_quarter_end_ind CHAR(1) DEFAULT 'N',
    is_year_end_ind CHAR(1) DEFAULT 'N',
    
    -- Calendar week attributes (ISO standard)
    clndr_wk_num INTEGER NOT NULL,             
    clndr_yr_and_wk VARCHAR(7) NOT NULL,       
    wk_begin_dt DATE NOT NULL,
    wk_end_dt DATE NOT NULL,
    prior_wk_begin_dt DATE NOT NULL,
    prior_wk_end_dt DATE NOT NULL,
    
    -- Fiscal week attributes  
    fiscal_wk_nbr INTEGER NOT NULL,
    fiscal_wk_age INTEGER,                     
    fiscal_wk_begin_dt DATE NOT NULL,
    fiscal_wk_end_dt DATE NOT NULL,
    ly_fiscal_wk_end_dt DATE,                  
    
    -- Calendar month attributes
    clndr_mth_nm VARCHAR(10) NOT NULL,         
    clndr_mth_nbr INTEGER NOT NULL,            
    clndr_yr_and_mth VARCHAR(7) NOT NULL,      
    mth_begin_dt DATE NOT NULL,
    mth_end_dt DATE NOT NULL,
    prior_mth_begin_dt DATE NOT NULL,
    prior_mth_end_dt DATE NOT NULL,
    
    -- Fiscal month attributes
    fiscal_mth_nbr INTEGER NOT NULL,
    fiscal_mth_nm VARCHAR(10) NOT NULL,
    fiscal_mth_age INTEGER,                    
    fiscal_mth_begin_dt DATE NOT NULL,
    fiscal_mth_end_dt DATE NOT NULL,
    ly_fiscal_mth_end_dt DATE,                 
    
    -- Quarter attributes
    clndr_qtr_nbr INTEGER NOT NULL,            
    clndr_yr_and_qtr VARCHAR(7) NOT NULL,      
    qtr_begin_dt DATE NOT NULL,
    qtr_end_dt DATE NOT NULL,
    
    -- Fiscal quarter attributes
    fiscal_qtr_nbr INTEGER NOT NULL,
    fiscal_qtr_age INTEGER,                    
    fiscal_qtr_begin_dt DATE NOT NULL,
    fiscal_qtr_end_dt DATE NOT NULL,
    
    -- Year attributes
    clndr_yr_nbr INTEGER NOT NULL,             
    fiscal_yr_nbr INTEGER NOT NULL,
    fiscal_yr_age INTEGER,                     
    fiscal_yr_begin_dt DATE NOT NULL,
    fiscal_yr_end_dt DATE NOT NULL,
    ly_fiscal_day_end_dt DATE,                 
    
    -- Reporting period helpers
    reporting_wk VARCHAR(20),                  
    reporting_mth VARCHAR(20),                   
    reporting_qtr VARCHAR(20),                 
    reporting_yr VARCHAR(20),                  
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE cmn.tb_cmd_clndr IS 'Calendar dimension containing all date attributes and fiscal periods. Central table for all time-based analytics.';
COMMENT ON COLUMN cmn.tb_cmd_clndr.clndr_id IS 'Primary key. Julian date in YYYYMMDD format (e.g., 20241217). Used as foreign key in all fact tables.';

-- =====================================================
-- 2. BUSINESS MODEL & ORGANIZATION STRUCTURE
-- =====================================================

CREATE TABLE cmn.tb_cmd_business_model (
    business_model_cd INTEGER PRIMARY KEY,
    model_nm VARCHAR(50) NOT NULL,
    model_desc VARCHAR(255),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_business_model VALUES 
(1, 'B2C', 'Business to Consumer - Individual customers'),
(2, 'B2B', 'Business to Business - Corporate accounts'),
(3, 'HYBRID', 'Mixed model - Both individual and corporate');

-- Organizations/Tenants
CREATE TABLE sas.tb_sas_org (
    org_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_nm VARCHAR(255) NOT NULL,
    org_domain VARCHAR(255),
    org_plan VARCHAR(50) DEFAULT 'trial',
    
    -- Business model determination
    business_model_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_business_model(business_model_cd),
    
    -- B2B specific settings (NULL for B2C orgs)
    enable_account_hierarchy_ind CHAR(1) DEFAULT 'N',
    enable_seat_management_ind CHAR(1) DEFAULT 'N',
    enable_dept_tracking_ind CHAR(1) DEFAULT 'N',
    
    -- B2C specific settings (NULL for B2B orgs)
    enable_individual_subscriptions_ind CHAR(1) DEFAULT 'Y',
    
    org_settings JSONB DEFAULT '{}'::jsonb,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

COMMENT ON TABLE sas.tb_sas_org IS 'SaaS analytics platform tenants. Each org can operate B2B, B2C, or hybrid business models.';

-- =====================================================
-- 3. REFERENCE TABLES - ACCOUNT CLASSIFICATION
-- =====================================================

CREATE TABLE cmn.tb_cmd_account_type (
    account_type_cd INTEGER PRIMARY KEY,
    type_nm VARCHAR(50) NOT NULL,
    type_desc VARCHAR(255),
    applies_to_b2c_ind CHAR(1) DEFAULT 'N',
    applies_to_b2b_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_account_type VALUES 
(1, 'INDIVIDUAL', 'B2C Individual customer', 'Y', 'N'),
(2, 'SMALL_BUSINESS', 'B2B Small business account', 'N', 'Y'),
(3, 'ENTERPRISE', 'B2B Enterprise account', 'N', 'Y'),
(4, 'FAMILY', 'B2C Family/household account', 'Y', 'N'),
(5, 'TEAM', 'Hybrid - Small team account', 'Y', 'Y');

CREATE TABLE cmn.tb_cmd_account_tier (
    account_tier_cd INTEGER PRIMARY KEY,
    tier_nm VARCHAR(50) NOT NULL,
    tier_desc VARCHAR(255),
    tier_order INTEGER,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmd_industry (
    industry_cd INTEGER PRIMARY KEY,
    industry_nm VARCHAR(100) NOT NULL,
    industry_desc VARCHAR(255),
    naics_code VARCHAR(10),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmd_company_size (
    company_size_cd INTEGER PRIMARY KEY,
    size_category_nm VARCHAR(50) NOT NULL,
    size_desc VARCHAR(255),
    employee_min INTEGER,
    employee_max INTEGER,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmd_territory (
    territory_cd INTEGER PRIMARY KEY,
    territory_nm VARCHAR(100) NOT NULL,
    territory_desc VARCHAR(255),
    region_nm VARCHAR(50),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

-- =====================================================
-- 4. UNIVERSAL ACCOUNT/CUSTOMER MODEL
-- =====================================================

-- Single entity that can represent B2C customers OR B2B accounts
CREATE TABLE sas.tb_sas_account (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    
    -- Universal fields (B2B and B2C)
    account_nm VARCHAR(255) NOT NULL,  -- Individual name OR company name
    primary_email VARCHAR(255),
    account_type_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_account_type(account_type_cd),
    
    -- B2C Individual fields (NULL for B2B)
    individual_first_nm VARCHAR(100),
    individual_last_nm VARCHAR(100),
    individual_birth_dt DATE,
    
    -- B2B Company fields (NULL for B2C) 
    company_legal_nm VARCHAR(255),
    duns_nbr VARCHAR(20),
    parent_account_id UUID REFERENCES sas.tb_sas_account(account_id),
    industry_cd INTEGER REFERENCES cmn.tb_cmd_industry(industry_cd),
    company_size_cd INTEGER REFERENCES cmn.tb_cmd_company_size(company_size_cd),
    annual_revenue_range_cd INTEGER,
    employee_count_range_cd INTEGER,
    
    -- Geographic (both B2B and B2C)
    country_cd VARCHAR(3),
    state_cd VARCHAR(5),
    city_nm VARCHAR(100),
    postal_cd VARCHAR(20),
    territory_cd INTEGER REFERENCES cmn.tb_cmd_territory(territory_cd),
    
    -- Lifecycle tracking (both)
    tier_cd INTEGER REFERENCES cmn.tb_cmd_account_tier(account_tier_cd),
    first_engagement_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    first_purchase_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    -- Hybrid model transition tracking
    is_hybrid_converted_ind CHAR(1) DEFAULT 'N',
    converted_from_b2c_dt DATE,
    converted_to_b2b_dt DATE,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

COMMENT ON TABLE sas.tb_sas_account IS 'Universal account entity. For B2C orgs: individual customers. For B2B orgs: company accounts. For HYBRID: both.';

-- =====================================================
-- 5. CONTACT MANAGEMENT
-- =====================================================

CREATE TABLE cmn.tb_cmd_contact_role (
    contact_role_cd INTEGER PRIMARY KEY,
    role_nm VARCHAR(50) NOT NULL,
    role_desc VARCHAR(255),
    is_decision_maker_role_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

-- Contacts can be primary users (B2C) OR stakeholders within accounts (B2B)
CREATE TABLE sas.tb_sas_contact (
    contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    
    -- Universal contact fields
    first_nm VARCHAR(100),
    last_nm VARCHAR(100),
    email_addr VARCHAR(255),
    phone_nbr VARCHAR(20),
    
    -- B2C fields (individual user context)
    is_primary_user_ind CHAR(1) DEFAULT 'N',  -- Main account holder for B2C
    
    -- B2B fields (business context) - NULL for B2C
    job_title VARCHAR(100),
    department_nm VARCHAR(100),
    contact_role_cd INTEGER REFERENCES cmn.tb_cmd_contact_role(contact_role_cd),
    is_decision_maker_ind CHAR(1) DEFAULT 'N',
    is_influencer_ind CHAR(1) DEFAULT 'N',
    is_champion_ind CHAR(1) DEFAULT 'N',
    
    -- Universal engagement tracking
    lead_source_cd INTEGER,
    engagement_level_cd INTEGER,
    last_activity_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

COMMENT ON TABLE sas.tb_sas_contact IS 'Flexible contact model. B2C: individual users and family members. B2B: business stakeholders and decision makers.';

-- =====================================================
-- 6. DEPARTMENT STRUCTURE (B2B Only)
-- =====================================================

CREATE TABLE cmn.tb_cmd_dept_type (
    dept_type_cd INTEGER PRIMARY KEY,
    dept_type_nm VARCHAR(50) NOT NULL,
    dept_type_desc VARCHAR(255),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

-- Only populated for B2B organizations
CREATE TABLE sas.tb_sas_account_dept (
    account_dept_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    parent_dept_id UUID REFERENCES sas.tb_sas_account_dept(account_dept_id),
    
    dept_nm VARCHAR(100) NOT NULL,
    dept_type_cd INTEGER REFERENCES cmn.tb_cmd_dept_type(dept_type_cd),
    cost_center_cd VARCHAR(50),
    
    dept_head_contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    allocated_seats_qty INTEGER DEFAULT 0,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

COMMENT ON TABLE sas.tb_sas_account_dept IS 'Department structure within B2B accounts. NULL/empty for B2C organizations.';

-- =====================================================
-- 7. PRODUCT CATALOG
-- =====================================================

CREATE TABLE cmn.tb_cmd_pymt_pln (
    pymt_pln_cd INTEGER PRIMARY KEY,
    pymt_pln_nm VARCHAR(50) NOT NULL,
    pymt_pln_desc VARCHAR(255),
    billing_frequency_mth INTEGER NOT NULL,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_pymt_pln VALUES 
(1, 'MONTHLY', 'Monthly billing cycle', 1),
(2, 'QUARTERLY', 'Quarterly billing cycle', 3),
(3, 'ANNUALLY', 'Annual billing cycle', 12),
(4, 'WEEKLY', 'Weekly billing cycle for testing', 0);

CREATE TABLE cmn.tb_cmd_prdct_plan (
    prdct_plan_cd INTEGER PRIMARY KEY,
    prdct_plan_nm VARCHAR(100) NOT NULL,
    prdct_plan_desc VARCHAR(500),
    plan_category_nm VARCHAR(50),
    plan_tier_nm VARCHAR(50),
    is_active_ind CHAR(1) DEFAULT 'Y',
    is_trial_plan_ind CHAR(1) DEFAULT 'N',
    is_enterprise_ind CHAR(1) DEFAULT 'N',
    max_users_cnt INTEGER,
    billing_cycle_mth INTEGER,
    setup_fee_cents INTEGER DEFAULT 0,
    base_price_cents INTEGER NOT NULL,
    currency_cd VARCHAR(3) DEFAULT 'USD',
    plan_sort_order INTEGER,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

COMMENT ON TABLE cmn.tb_cmd_prdct_plan IS 'Master product plan catalog. Defines all subscription plans available for purchase.';

CREATE TABLE cmn.tb_cmd_plan_feature (
    plan_feature_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prdct_plan_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_prdct_plan(prdct_plan_cd),
    feature_nm VARCHAR(100) NOT NULL,
    feature_desc VARCHAR(500),
    feature_category_nm VARCHAR(50),
    included_qty INTEGER,
    unlimited_ind CHAR(1) DEFAULT 'N',
    usage_based_ind CHAR(1) DEFAULT 'N',
    overage_price_cents INTEGER,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(prdct_plan_cd, feature_nm)
);

CREATE TABLE cmn.tb_cmd_addon_prdct (
    addon_prdct_cd INTEGER PRIMARY KEY,
    addon_nm VARCHAR(100) NOT NULL,
    addon_desc VARCHAR(500),
    addon_category_nm VARCHAR(50),
    price_cents INTEGER NOT NULL,
    billing_frequency_cd INTEGER REFERENCES cmn.tb_cmd_pymt_pln(pymt_pln_cd),
    is_active_ind CHAR(1) DEFAULT 'Y',
    requires_base_plan_ind CHAR(1) DEFAULT 'Y',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

-- =====================================================
-- 8. SUBSCRIPTION MANAGEMENT
-- =====================================================

CREATE TABLE cmn.tb_cmd_sbscrptn_sts (
    sbscrptn_sts_cd INTEGER PRIMARY KEY,
    sbscrptn_sts_nm VARCHAR(50) NOT NULL,
    sbscrptn_sts_desc VARCHAR(255),
    is_active_ind CHAR(1) DEFAULT 'N',
    is_trial_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_sbscrptn_sts VALUES 
(1, 'ACTIVE', 'Active paid subscription', 'Y', 'N'),
(2, 'TRIAL', 'Free trial period', 'Y', 'Y'),
(3, 'CANCELLED', 'Cancelled subscription', 'N', 'N'),
(4, 'PAUSED', 'Temporarily paused subscription', 'N', 'N'),
(5, 'PAST_DUE', 'Payment past due', 'Y', 'N'),
(6, 'EXPIRED', 'Subscription expired', 'N', 'N');

-- Can represent B2C subscriptions OR B2B license blocks
CREATE TABLE sas.tb_sas_subscription (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    
    -- Universal subscription fields
    subscription_sts_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_sbscrptn_sts(sbscrptn_sts_cd),
    prdct_plan_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_prdct_plan(prdct_plan_cd),
    pymt_pln_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_pymt_pln(pymt_pln_cd),
    
    -- Pricing (flexible for both models)
    base_price_cents INTEGER NOT NULL,
    total_price_cents INTEGER NOT NULL,
    currency_cd VARCHAR(3) DEFAULT 'USD',
    
    -- B2C: Individual subscription (qty = 1)
    -- B2B: License block (qty = seats purchased)
    subscription_qty INTEGER DEFAULT 1,
    
    -- B2B specific fields (NULL for B2C)
    total_seats_qty INTEGER,  -- For B2B seat licensing
    allocated_seats_qty INTEGER DEFAULT 0,
    active_seats_qty INTEGER DEFAULT 0,
    
    -- Contract terms
    start_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    trial_end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    renewal_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

COMMENT ON TABLE sas.tb_sas_subscription IS 'Universal subscription model. B2C: individual subscriptions (qty=1). B2B: license blocks with seat management.';

-- =====================================================
-- 9. USER ASSIGNMENT & SEAT MANAGEMENT
-- =====================================================

CREATE TABLE cmn.tb_cmd_assignment_sts (
    assignment_sts_cd INTEGER PRIMARY KEY,
    assignment_sts_nm VARCHAR(50) NOT NULL,
    assignment_sts_desc VARCHAR(255),
    is_active_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

-- For B2B: tracks seat assignments. For B2C: tracks family members/additional users
CREATE TABLE sas.tb_sas_user_assignment (
    user_assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    subscription_id UUID NOT NULL REFERENCES sas.tb_sas_subscription(subscription_id),
    contact_id UUID NOT NULL REFERENCES sas.tb_sas_contact(contact_id),
    
    -- Assignment details
    assigned_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    activated_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    last_login_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    assignment_sts_cd INTEGER REFERENCES cmn.tb_cmd_assignment_sts(assignment_sts_cd),
    
    -- B2C: Role within family/household
    -- B2B: Role within organization
    user_role_nm VARCHAR(100),
    
    -- Usage tracking (both B2B and B2C)
    total_logins_cnt INTEGER DEFAULT 0,
    last_30_day_logins_cnt INTEGER DEFAULT 0,
    features_used_cnt INTEGER DEFAULT 0,
    
    -- B2B specific (NULL for B2C)
    department_id UUID REFERENCES sas.tb_sas_account_dept(account_dept_id),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(subscription_id, contact_id)
);

COMMENT ON TABLE sas.tb_sas_user_assignment IS 'Flexible user assignment model. B2C: family members on shared plans. B2B: seat assignments to employees.';

-- =====================================================
-- 10. BILLING & FINANCIAL OPERATIONS
-- =====================================================

CREATE TABLE cmn.tb_cmd_invc_sts (
    invc_sts_cd INTEGER PRIMARY KEY,
    invc_sts_nm VARCHAR(50) NOT NULL,
    invc_sts_desc VARCHAR(255),
    is_paid_ind CHAR(1) DEFAULT 'N',
    is_overdue_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_invc_sts VALUES 
(1, 'DRAFT', 'Invoice created but not sent', 'N', 'N'),
(2, 'SENT', 'Invoice sent to customer', 'N', 'N'),
(3, 'PAID', 'Invoice fully paid', 'Y', 'N'),
(4, 'PARTIAL', 'Invoice partially paid', 'N', 'N'),
(5, 'OVERDUE', 'Invoice past due date', 'N', 'Y'),
(6, 'CANCELLED', 'Invoice cancelled', 'N', 'N'),
(7, 'REFUNDED', 'Invoice refunded', 'N', 'N');

CREATE TABLE cmn.tb_cmf_invc (
    invc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    invc_nbr VARCHAR(50) NOT NULL,
    invc_sts_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_invc_sts(invc_sts_cd),
    
    invc_dt DATE NOT NULL,
    due_dt DATE NOT NULL,
    invc_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    due_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    subtotal_amt_cents INTEGER NOT NULL,
    tax_amt_cents INTEGER DEFAULT 0,
    discount_amt_cents INTEGER DEFAULT 0,
    total_amt_cents INTEGER NOT NULL,
    paid_amt_cents INTEGER DEFAULT 0,
    currency_cd VARCHAR(3) DEFAULT 'USD',
    
    billing_period_start_dt DATE,
    billing_period_end_dt DATE,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, invc_nbr)
);

CREATE TABLE cmn.tb_cmf_invc_line_item (
    invc_line_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invc_id UUID NOT NULL REFERENCES cmn.tb_cmf_invc(invc_id),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    sbscrptn_id UUID REFERENCES sas.tb_sas_subscription(subscription_id),
    
    line_item_type VARCHAR(50) NOT NULL,
    line_item_desc VARCHAR(500) NOT NULL,
    prdct_plan_cd INTEGER REFERENCES cmn.tb_cmd_prdct_plan(prdct_plan_cd),
    addon_prdct_cd INTEGER REFERENCES cmn.tb_cmd_addon_prdct(addon_prdct_cd),
    
    qty INTEGER NOT NULL DEFAULT 1,
    unit_price_cents INTEGER NOT NULL,
    line_total_cents INTEGER NOT NULL,
    discount_amt_cents INTEGER DEFAULT 0,
    
    service_period_start_dt DATE,
    service_period_end_dt DATE,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 11. PAYMENT PROCESSING
-- =====================================================

CREATE TABLE cmn.tb_cmd_pymt_method (
    pymt_method_cd INTEGER PRIMARY KEY,
    pymt_method_nm VARCHAR(50) NOT NULL,
    pymt_method_desc VARCHAR(255),
    is_automatic_ind CHAR(1) DEFAULT 'Y',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_pymt_method VALUES 
(1, 'CREDIT_CARD', 'Credit card payment', 'Y'),
(2, 'BANK_TRANSFER', 'Bank wire transfer', 'N'),
(3, 'ACH', 'Automated clearing house', 'Y'),
(4, 'PAYPAL', 'PayPal payment', 'Y'),
(5, 'CHECK', 'Paper check payment', 'N'),
(6, 'CRYPTO', 'Cryptocurrency payment', 'N');

CREATE TABLE cmn.tb_cmd_txn_sts (
    txn_sts_cd INTEGER PRIMARY KEY,
    txn_sts_nm VARCHAR(50) NOT NULL,
    txn_sts_desc VARCHAR(255),
    is_success_ind CHAR(1) DEFAULT 'N',
    is_failure_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_txn_sts VALUES 
(1, 'PENDING', 'Transaction initiated', 'N', 'N'),
(2, 'SUCCESS', 'Transaction completed successfully', 'Y', 'N'),
(3, 'FAILED', 'Transaction failed', 'N', 'Y'),
(4, 'CANCELLED', 'Transaction cancelled', 'N', 'N'),
(5, 'REFUNDED', 'Transaction refunded', 'N', 'N'),
(6, 'CHARGEBACK', 'Chargeback initiated', 'N', 'Y');

CREATE TABLE cmn.tb_cmf_pymt_txn (
    pymt_txn_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    invc_id UUID REFERENCES cmn.tb_cmf_invc(invc_id),
    
    txn_sts_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_txn_sts(txn_sts_cd),
    pymt_method_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_pymt_method(pymt_method_cd),
    
    txn_dt DATE NOT NULL,
    txn_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    txn_amt_cents INTEGER NOT NULL,
    fee_amt_cents INTEGER DEFAULT 0,
    net_amt_cents INTEGER NOT NULL,
    currency_cd VARCHAR(3) DEFAULT 'USD',
    
    gateway_txn_id VARCHAR(255),
    gateway_nm VARCHAR(50),
    failure_reason VARCHAR(500),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 12. USAGE & METERING
-- =====================================================

CREATE TABLE cmn.tb_cmf_usage_evnt (
    usage_evnt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    user_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    evnt_dt DATE NOT NULL,
    evnt_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    evnt_timestamp TIMESTAMP NOT NULL,
    
    feature_nm VARCHAR(100) NOT NULL,
    usage_metric_nm VARCHAR(100) NOT NULL,
    usage_qty DECIMAL(12,4) NOT NULL,
    usage_unit VARCHAR(20) NOT NULL,
    
    billable_ind CHAR(1) DEFAULT 'Y',
    rate_cents DECIMAL(10,4),
    charge_amt_cents INTEGER DEFAULT 0,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

CREATE TABLE cmn.tb_cmf_usage_mthly_summary (
    usage_summary_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    
    billing_mth_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    feature_nm VARCHAR(100) NOT NULL,
    usage_metric_nm VARCHAR(100) NOT NULL,
    
    total_usage_qty DECIMAL(12,4) NOT NULL,
    included_qty DECIMAL(12,4) DEFAULT 0,
    overage_qty DECIMAL(12,4) DEFAULT 0,
    billable_overage_qty DECIMAL(12,4) DEFAULT 0,
    
    total_charge_amt_cents INTEGER DEFAULT 0,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, account_id, billing_mth_clndr_id, feature_nm, usage_metric_nm)
);

-- =====================================================
-- 13. CUSTOMER HEALTH & LIFECYCLE
-- =====================================================

CREATE TABLE cmn.tb_cmd_lifecycle_stage (
    lifecycle_stage_cd INTEGER PRIMARY KEY,
    stage_nm VARCHAR(50) NOT NULL,
    stage_desc VARCHAR(255),
    stage_order INTEGER,
    is_active_revenue_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_lifecycle_stage VALUES 
(1, 'LEAD', 'Sales qualified lead', 1, 'N'),
(2, 'TRIAL', 'Free trial user', 2, 'N'),
(3, 'ONBOARDING', 'New customer onboarding', 3, 'Y'),
(4, 'ACTIVE', 'Healthy active customer', 4, 'Y'),
(5, 'AT_RISK', 'Customer at risk of churning', 5, 'Y'),
(6, 'CHURNED', 'Cancelled customer', 6, 'N'),
(7, 'REACTIVATED', 'Previously churned, now active', 7, 'Y');

CREATE TABLE cmn.tb_cmf_cstmr_health_score (
    cstmr_health_score_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    cstmr_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    
    score_dt DATE NOT NULL,
    score_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    overall_health_score INTEGER CHECK (overall_health_score BETWEEN 0 AND 100),
    usage_score INTEGER CHECK (usage_score BETWEEN 0 AND 100),
    engagement_score INTEGER CHECK (engagement_score BETWEEN 0 AND 100),
    support_score INTEGER CHECK (support_score BETWEEN 0 AND 100),
    payment_score INTEGER CHECK (payment_score BETWEEN 0 AND 100),
    
    health_trend VARCHAR(20),
    risk_level VARCHAR(20),
    churn_probability DECIMAL(5,4),
    expansion_probability DECIMAL(5,4),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, cstmr_id, score_clndr_id)
);

CREATE TABLE cmn.tb_cmf_cstmr_lifecycle (
    cstmr_lifecycle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    cstmr_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    
    stage_start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    stage_end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    lifecycle_stage_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_lifecycle_stage(lifecycle_stage_cd),
    prev_stage_cd INTEGER REFERENCES cmn.tb_cmd_lifecycle_stage(lifecycle_stage_cd),
    
    stage_duration_days INTEGER,
    stage_success_ind CHAR(1),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

CREATE TABLE cmn.tb_cmf_churn_evnt (
    churn_evnt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    cstmr_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    sbscrptn_id UUID NOT NULL REFERENCES sas.tb_sas_subscription(subscription_id),
    
    churn_dt DATE NOT NULL,
    churn_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    churn_type VARCHAR(20) NOT NULL,  -- 'voluntary', 'involuntary'
    churn_reason VARCHAR(100),
    churn_category VARCHAR(50),
    
    prior_plan_nm VARCHAR(100),
    prior_mrr_amt_cents INTEGER,
    tenure_days INTEGER,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 14. SUPPORT & CUSTOMER SUCCESS
-- =====================================================

CREATE TABLE cmn.tb_cmd_ticket_sts (
    ticket_sts_cd INTEGER PRIMARY KEY,
    ticket_sts_nm VARCHAR(50) NOT NULL,
    ticket_sts_desc VARCHAR(255),
    is_open_ind CHAR(1) DEFAULT 'Y',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_ticket_sts VALUES 
(1, 'OPEN', 'New ticket awaiting response', 'Y'),
(2, 'IN_PROGRESS', 'Ticket being worked on', 'Y'),
(3, 'WAITING_CUSTOMER', 'Waiting for customer response', 'Y'),
(4, 'RESOLVED', 'Ticket resolved', 'N'),
(5, 'CLOSED', 'Ticket closed', 'N'),
(6, 'CANCELLED', 'Ticket cancelled', 'N');

CREATE TABLE cmn.tb_cmd_ticket_priority (
    priority_cd INTEGER PRIMARY KEY,
    priority_nm VARCHAR(50) NOT NULL,
    priority_desc VARCHAR(255),
    sla_response_hrs INTEGER,
    sla_resolution_hrs INTEGER,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_ticket_priority VALUES 
(1, 'LOW', 'Low priority issue', 48, 120),
(2, 'MEDIUM', 'Standard priority issue', 24, 72),
(3, 'HIGH', 'High priority issue', 8, 24),
(4, 'CRITICAL', 'Critical system issue', 2, 8),
(5, 'EMERGENCY', 'Emergency response required', 1, 4);

CREATE TABLE cmn.tb_cmd_ticket_category (
    category_cd INTEGER PRIMARY KEY,
    category_nm VARCHAR(50) NOT NULL,
    category_desc VARCHAR(255),
    default_priority_cd INTEGER REFERENCES cmn.tb_cmd_ticket_priority(priority_cd),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_ticket_category VALUES 
(1, 'TECHNICAL', 'Technical support issue', 2),
(2, 'BILLING', 'Billing and payment issue', 2),
(3, 'FEATURE_REQUEST', 'New feature request', 1),
(4, 'BUG_REPORT', 'Software bug report', 3),
(5, 'ACCOUNT', 'Account management issue', 2),
(6, 'INTEGRATION', 'API and integration support', 3);

CREATE TABLE cmn.tb_cmf_support_ticket (
    support_ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    cstmr_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    user_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    ticket_nbr VARCHAR(50) NOT NULL,
    ticket_sts_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_ticket_sts(ticket_sts_cd),
    priority_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_ticket_priority(priority_cd),
    category_cd INTEGER REFERENCES cmn.tb_cmd_ticket_category(category_cd),
    
    created_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    resolved_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    subject_txt VARCHAR(500) NOT NULL,
    description_txt TEXT,
    resolution_txt TEXT,
    
    first_response_hrs DECIMAL(8,2),
    resolution_hrs DECIMAL(8,2),
    
    satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 5),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, ticket_nbr)
);

-- =====================================================
-- 15. MARKETING & ATTRIBUTION
-- =====================================================

CREATE TABLE cmn.tb_cmd_mktg_campaign (
    mktg_campaign_cd INTEGER PRIMARY KEY,
    campaign_nm VARCHAR(100) NOT NULL,
    campaign_desc VARCHAR(500),
    campaign_type VARCHAR(50),
    channel_nm VARCHAR(50),
    
    start_dt DATE,
    end_dt DATE,
    budget_amt_cents INTEGER,
    target_audience VARCHAR(100),
    
    is_active_ind CHAR(1) DEFAULT 'Y',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmf_cstmr_attribution (
    cstmr_attribution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    cstmr_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    
    first_touch_campaign_cd INTEGER REFERENCES cmn.tb_cmd_mktg_campaign(mktg_campaign_cd),
    last_touch_campaign_cd INTEGER REFERENCES cmn.tb_cmd_mktg_campaign(mktg_campaign_cd),
    
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    
    referrer_domain VARCHAR(255),
    landing_page_url VARCHAR(500),
    
    attribution_model VARCHAR(50),
    attribution_weight DECIMAL(5,4),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, cstmr_id)
);

-- =====================================================
-- 16. FEATURE FLAGS & ENTITLEMENTS
-- =====================================================

CREATE TABLE cmn.tb_cmd_feature_flag (
    feature_flag_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature_nm VARCHAR(100) NOT NULL,
    feature_category VARCHAR(50),
    feature_desc VARCHAR(500),
    
    is_enabled_ind CHAR(1) DEFAULT 'N',
    is_beta_ind CHAR(1) DEFAULT 'N',
    rollout_percentage INTEGER DEFAULT 0,
    
    -- Plan-based access control
    min_plan_tier INTEGER,
    max_plan_tier INTEGER,
    requires_addon_ind CHAR(1) DEFAULT 'N',
    required_addon_cd INTEGER REFERENCES cmn.tb_cmd_addon_prdct(addon_prdct_cd),
    
    -- Usage limits
    usage_limit_qty INTEGER,
    usage_period VARCHAR(20),
    overage_allowed_ind CHAR(1) DEFAULT 'N',
    
    effective_start_dt DATE,
    effective_end_dt DATE,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmf_feature_usage (
    feature_usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    feature_nm VARCHAR(100) NOT NULL,
    usage_dt DATE NOT NULL,
    usage_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    usage_count INTEGER DEFAULT 1,
    allowed_count INTEGER,
    exceeded_limit_ind CHAR(1) DEFAULT 'N',
    
    session_id VARCHAR(100),
    user_agent VARCHAR(500),
    ip_address INET,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, account_id, feature_nm, usage_dt)
);

-- =====================================================
-- 17. API USAGE & RATE LIMITING
-- =====================================================

CREATE TABLE cmn.tb_cmd_api_endpoint (
    api_endpoint_cd INTEGER PRIMARY KEY,
    endpoint_path VARCHAR(500) NOT NULL,
    endpoint_desc VARCHAR(500),
    http_method VARCHAR(10) NOT NULL,
    rate_limit_per_hour INTEGER,
    requires_auth_ind CHAR(1) DEFAULT 'Y',
    is_billable_ind CHAR(1) DEFAULT 'Y',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmf_api_usage (
    api_usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    api_endpoint_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_api_endpoint(api_endpoint_cd),
    
    request_timestamp TIMESTAMP NOT NULL,
    request_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    response_status INTEGER NOT NULL,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    
    rate_limit_hit_ind CHAR(1) DEFAULT 'N',
    quota_consumed DECIMAL(10,4) DEFAULT 1,
    
    client_ip INET,
    user_agent VARCHAR(1000),
    api_key_hash VARCHAR(64),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 18. REVENUE RECOGNITION & COMPLIANCE
-- =====================================================

CREATE TABLE cmn.tb_cmf_revenue_schedule (
    revenue_schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    subscription_id UUID NOT NULL REFERENCES sas.tb_sas_subscription(subscription_id),
    
    recognition_start_dt DATE NOT NULL,
    recognition_end_dt DATE NOT NULL,
    recognition_start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    recognition_end_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    deferred_revenue_cents INTEGER NOT NULL,
    recognized_revenue_cents INTEGER DEFAULT 0,
    remaining_revenue_cents INTEGER NOT NULL,
    
    recognition_rule VARCHAR(50) NOT NULL DEFAULT 'STRAIGHT_LINE',
    recognition_frequency VARCHAR(20) DEFAULT 'MONTHLY',
    
    -- ASC 606 compliance fields
    performance_obligation_id UUID,
    contract_modification_ind CHAR(1) DEFAULT 'N',
    modification_reason VARCHAR(500),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 19. DAILY SNAPSHOTS & AGGREGATES
-- =====================================================

CREATE TABLE cmn.tb_cmf_sbscrptn_daily (
    sbscrptn_daily_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    cstmr_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    sbscrptn_id UUID NOT NULL REFERENCES sas.tb_sas_subscription(subscription_id),
    
    clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    mrr_amt_cents INTEGER NOT NULL,  -- Daily MRR allocation
    arr_amt_cents INTEGER NOT NULL,  -- Daily ARR allocation
    
    quantity INTEGER NOT NULL,
    effective_rate_cents INTEGER NOT NULL,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, sbscrptn_id, clndr_id)
);

CREATE TABLE cmn.tb_cmf_nrr_snapshot (
    nrr_snapshot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    snapshot_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),

    starting_mrr_cents INTEGER NOT NULL,
    expansion_mrr_cents INTEGER DEFAULT 0,
    contraction_mrr_cents INTEGER DEFAULT 0,
    churned_mrr_cents INTEGER DEFAULT 0,
    reactivation_mrr_cents INTEGER DEFAULT 0,

    ending_mrr_cents INTEGER NOT NULL,
    nrr_pct DECIMAL(6,2) NOT NULL, -- Ending vs Starting %

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    UNIQUE(org_id, snapshot_clndr_id)
);

-- =====================================================
-- 20. FINANCIAL OPERATIONS
-- =====================================================

CREATE TABLE cmn.tb_cmd_exchange_rate (
    exchange_rate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_currency_cd VARCHAR(3) NOT NULL,
    to_currency_cd VARCHAR(3) NOT NULL,
    rate_dt DATE NOT NULL,
    rate_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    exchange_rate DECIMAL(12,8) NOT NULL,
    inverse_rate DECIMAL(12,8),
    
    source_provider VARCHAR(50) NOT NULL,
    rate_type VARCHAR(20) DEFAULT 'SPOT',
    
    is_primary_rate_ind CHAR(1) DEFAULT 'Y',
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(from_currency_cd, to_currency_cd, rate_dt, source_provider)
);

CREATE TABLE cmn.tb_cmd_tax_rule (
    tax_rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_cd VARCHAR(3) NOT NULL,
    state_cd VARCHAR(5),
    postal_code_pattern VARCHAR(20),
    
    tax_type VARCHAR(50) NOT NULL,
    tax_name VARCHAR(100) NOT NULL,
    tax_authority VARCHAR(100),
    
    tax_rate DECIMAL(8,6) NOT NULL,
    min_taxable_amount_cents INTEGER DEFAULT 0,
    max_taxable_amount_cents INTEGER,
    
    effective_start_dt DATE NOT NULL,
    effective_end_dt DATE,
    effective_start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    effective_end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    applies_to_product_type VARCHAR(50),
    applies_to_customer_type VARCHAR(50),
    
    reverse_charge_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmf_discount (
    discount_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),

    discount_cd VARCHAR(50) NOT NULL,
    discount_nm VARCHAR(100) NOT NULL,
    discount_desc VARCHAR(500),

    discount_type VARCHAR(20) NOT NULL, -- PERCENT, FIXED, TRIAL_EXTENSION
    discount_value DECIMAL(12,4) NOT NULL,
    max_redemptions_cnt INTEGER,
    redemptions_used_cnt INTEGER DEFAULT 0,

    effective_start_dt DATE NOT NULL,
    effective_end_dt DATE,
    effective_start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    effective_end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    applicable_plan_cd INTEGER REFERENCES cmn.tb_cmd_prdct_plan(prdct_plan_cd),
    applicable_addon_cd INTEGER REFERENCES cmn.tb_cmd_addon_prdct(addon_prdct_cd),

    is_active_ind CHAR(1) DEFAULT 'Y',

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    UNIQUE(org_id, discount_cd)
);

CREATE TABLE cmn.tb_cmf_refund (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    invc_id UUID NOT NULL REFERENCES cmn.tb_cmf_invc(invc_id),

    refund_dt DATE NOT NULL,
    refund_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),

    refund_amt_cents INTEGER NOT NULL,
    refund_reason VARCHAR(255),
    refund_type VARCHAR(50), -- FULL, PARTIAL, CREDIT_NOTE
    refund_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PROCESSED, FAILED

    payment_txn_id UUID REFERENCES cmn.tb_cmf_pymt_txn(pymt_txn_id),

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 21. DUNNING MANAGEMENT
-- =====================================================

CREATE TABLE cmn.tb_cmd_dunning_stage (
    dunning_stage_cd INTEGER PRIMARY KEY,
    stage_nm VARCHAR(50) NOT NULL,
    stage_desc VARCHAR(255),
    stage_order INTEGER NOT NULL,
    days_after_due INTEGER NOT NULL,
    
    email_template_nm VARCHAR(100),
    escalation_type VARCHAR(50),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_dunning_stage VALUES 
(1, 'FIRST_NOTICE', 'Initial payment reminder', 1, 3, 'payment_reminder_1', 'EMAIL'),
(2, 'SECOND_NOTICE', 'Second payment notice', 2, 7, 'payment_reminder_2', 'EMAIL'),
(3, 'FINAL_NOTICE', 'Final notice before suspension', 3, 14, 'payment_final_notice', 'EMAIL_PHONE'),
(4, 'SUSPENSION', 'Account suspension', 4, 21, 'account_suspended', 'SUSPENSION'),
(5, 'COLLECTION', 'External collection agency', 5, 60, 'collection_referral', 'COLLECTION');

CREATE TABLE cmn.tb_cmf_dunning_cycle (
    dunning_cycle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    invc_id UUID NOT NULL REFERENCES cmn.tb_cmf_invc(invc_id),
    
    cycle_start_dt DATE NOT NULL,
    cycle_end_dt DATE,
    cycle_start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    cycle_end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    current_stage_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_dunning_stage(dunning_stage_cd),
    max_stages INTEGER DEFAULT 5,
    
    next_action_dt DATE,
    next_action_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    collection_status VARCHAR(20) DEFAULT 'ACTIVE',
    total_fees_cents INTEGER DEFAULT 0,
    recovery_probability DECIMAL(5,4),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 22. SECURITY & AUDIT
-- =====================================================

CREATE TABLE cmn.tb_cmd_security_event_type (
    security_event_type_cd INTEGER PRIMARY KEY,
    event_type_nm VARCHAR(50) NOT NULL,
    event_type_desc VARCHAR(255),
    risk_level VARCHAR(20),
    requires_alert_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_security_event_type VALUES 
(1, 'LOGIN_SUCCESS', 'Successful user login', 'LOW', 'N'),
(2, 'LOGIN_FAILED', 'Failed login attempt', 'MEDIUM', 'N'),
(3, 'PASSWORD_CHANGE', 'Password changed', 'MEDIUM', 'Y'),
(4, 'ACCOUNT_LOCKED', 'Account locked due to failed attempts', 'HIGH', 'Y'),
(5, 'SUSPICIOUS_IP', 'Login from suspicious IP address', 'HIGH', 'Y'),
(6, 'DATA_EXPORT', 'Large data export performed', 'MEDIUM', 'Y'),
(7, 'PRIVILEGE_ESCALATION', 'User permissions elevated', 'HIGH', 'Y'),
(8, 'API_ABUSE', 'API rate limits exceeded', 'HIGH', 'Y');

CREATE TABLE cmn.tb_cmf_security_event (
    security_event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES sas.tb_sas_org(org_id),
    account_id UUID REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    security_event_type_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_security_event_type(security_event_type_cd),
    
    event_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    event_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    ip_address INET,
    user_agent VARCHAR(1000),
    session_id VARCHAR(100),
    device_fingerprint VARCHAR(100),
    
    risk_score INTEGER CHECK (risk_score BETWEEN 0 AND 100),
    blocked_ind CHAR(1) DEFAULT 'N',
    alert_sent_ind CHAR(1) DEFAULT 'N',
    
    event_details JSONB,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 23. A/B TESTING FRAMEWORK
-- =====================================================

CREATE TABLE cmn.tb_cmd_experiment_status (
    experiment_status_cd INTEGER PRIMARY KEY,
    status_nm VARCHAR(50) NOT NULL,
    status_desc VARCHAR(255),
    is_active_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_experiment_status VALUES 
(1, 'DRAFT', 'Experiment in draft state', 'N'),
(2, 'RUNNING', 'Experiment actively running', 'Y'),
(3, 'PAUSED', 'Experiment temporarily paused', 'N'),
(4, 'COMPLETED', 'Experiment completed successfully', 'N'),
(5, 'CANCELLED', 'Experiment cancelled before completion', 'N');

CREATE TABLE cmn.tb_cmd_experiment (
    experiment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    
    experiment_nm VARCHAR(100) NOT NULL,
    experiment_desc VARCHAR(500),
    hypothesis TEXT,
    
    start_dt DATE NOT NULL,
    end_dt DATE,
    start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    experiment_status_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_experiment_status(experiment_status_cd),
    
    control_variant_nm VARCHAR(50) DEFAULT 'control',
    target_metric VARCHAR(100),
    minimum_sample_size INTEGER,
    
    confidence_level DECIMAL(5,4) DEFAULT 0.95,
    statistical_significance_threshold DECIMAL(5,4) DEFAULT 0.05,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

CREATE TABLE cmn.tb_cmf_experiment_assignment (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES cmn.tb_cmd_experiment(experiment_id),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    variant_nm VARCHAR(50) NOT NULL,
    assigned_dt DATE NOT NULL,
    assigned_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    exposure_count INTEGER DEFAULT 0,
    conversion_ind CHAR(1) DEFAULT 'N',
    conversion_dt DATE,
    conversion_value_cents INTEGER DEFAULT 0,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(experiment_id, account_id, contact_id)
);

-- =====================================================
-- 24. CUSTOMER JOURNEY MAPPING
-- =====================================================

CREATE TABLE cmn.tb_cmd_touchpoint_type (
    touchpoint_type_cd INTEGER PRIMARY KEY,
    touchpoint_type_nm VARCHAR(50) NOT NULL,
    touchpoint_type_desc VARCHAR(255),
    touchpoint_category VARCHAR(50),
    conversion_weight DECIMAL(5,4) DEFAULT 1.0,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_touchpoint_type VALUES 
(1, 'EMAIL_OPEN', 'Email marketing opened', 'COMMUNICATION', 0.1),
(2, 'EMAIL_CLICK', 'Email link clicked', 'COMMUNICATION', 0.3),
(3, 'PAGE_VIEW', 'Website page viewed', 'WEB_ENGAGEMENT', 0.2),
(4, 'FEATURE_USE', 'Product feature used', 'PRODUCT_ENGAGEMENT', 0.7),
(5, 'SUPPORT_TICKET', 'Support ticket created', 'SUPPORT', 0.5),
(6, 'TRIAL_START', 'Free trial initiated', 'CONVERSION', 0.8),
(7, 'PURCHASE', 'Subscription purchased', 'CONVERSION', 1.0),
(8, 'UPGRADE', 'Plan upgraded', 'EXPANSION', 0.9);

CREATE TABLE cmn.tb_cmd_journey_stage (
    journey_stage_cd INTEGER PRIMARY KEY,
    stage_nm VARCHAR(50) NOT NULL,
    stage_desc VARCHAR(255),
    stage_order INTEGER,
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_journey_stage VALUES 
(1, 'AWARENESS', 'Initial brand/product awareness', 1),
(2, 'CONSIDERATION', 'Evaluating solution options', 2),
(3, 'TRIAL', 'Free trial or proof of concept', 3),
(4, 'PURCHASE', 'Initial subscription purchase', 4),
(5, 'ONBOARDING', 'Product setup and training', 5),
(6, 'ADOPTION', 'Regular product usage', 6),
(7, 'EXPANSION', 'Additional purchases or upgrades', 7),
(8, 'ADVOCACY', 'Referrals and recommendations', 8);

CREATE TABLE cmn.tb_cmf_customer_touchpoint (
    touchpoint_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    touchpoint_type_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_touchpoint_type(touchpoint_type_cd),
    journey_stage_cd INTEGER REFERENCES cmn.tb_cmd_journey_stage(journey_stage_cd),
    
    touchpoint_timestamp TIMESTAMP NOT NULL,
    touchpoint_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    channel VARCHAR(50),
    campaign_id INTEGER REFERENCES cmn.tb_cmd_mktg_campaign(mktg_campaign_cd),
    
    conversion_ind CHAR(1) DEFAULT 'N',
    conversion_value_cents INTEGER DEFAULT 0,
    
    session_id VARCHAR(100),
    page_url VARCHAR(1000),
    referrer_url VARCHAR(1000),
    
    touchpoint_details JSONB,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 25. FORECASTING & PREDICTION
-- =====================================================

CREATE TABLE cmn.tb_cmd_forecast_type (
    forecast_type_cd INTEGER PRIMARY KEY,
    forecast_type_nm VARCHAR(50) NOT NULL,
    forecast_type_desc VARCHAR(255),
    forecast_category VARCHAR(50),
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER
);

INSERT INTO cmn.tb_cmd_forecast_type VALUES 
(1, 'MRR', 'Monthly Recurring Revenue', 'REVENUE'),
(2, 'ARR', 'Annual Recurring Revenue', 'REVENUE'),
(3, 'CHURN_RATE', 'Customer churn rate percentage', 'RETENTION'),
(4, 'NEW_CUSTOMERS', 'New customer acquisitions', 'GROWTH'),
(5, 'EXPANSION_REVENUE', 'Revenue from existing customers', 'EXPANSION'),
(6, 'CLV', 'Customer Lifetime Value', 'VALUE');

CREATE TABLE cmn.tb_cmf_forecast (
    forecast_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    
    forecast_period_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    forecast_type_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_forecast_type(forecast_type_cd),
    
    forecasted_value DECIMAL(15,2) NOT NULL,
    actual_value DECIMAL(15,2),
    
    forecast_model VARCHAR(50),
    confidence_interval_low DECIMAL(15,2),
    confidence_interval_high DECIMAL(15,2),
    
    created_dt DATE NOT NULL,
    created_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    model_accuracy_pct DECIMAL(5,2),
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    UNIQUE(org_id, forecast_period_clndr_id, forecast_type_cd, created_dt)
);

CREATE TABLE cmn.tb_cmf_clv_prediction (
    clv_prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID NOT NULL REFERENCES sas.tb_sas_account(account_id),

    prediction_dt DATE NOT NULL,
    prediction_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),

    predicted_clv_cents INTEGER NOT NULL,
    prediction_horizon_mths INTEGER DEFAULT 12,
    model_version VARCHAR(50),

    churn_probability DECIMAL(5,4),
    expansion_probability DECIMAL(5,4),
    downgrade_probability DECIMAL(5,4),

    confidence_interval_low_cents INTEGER,
    confidence_interval_high_cents INTEGER,

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    UNIQUE(org_id, account_id, prediction_dt, prediction_horizon_mths)
);

-- =====================================================
-- 26. DATA QUALITY & OBSERVABILITY
-- =====================================================

CREATE TABLE cmn.tb_cmd_data_quality_check (
    check_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES sas.tb_sas_org(org_id),
    table_nm VARCHAR(100) NOT NULL,
    check_type VARCHAR(50) NOT NULL,
    check_category VARCHAR(50),
    
    check_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    check_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    expected_value DECIMAL(12,4),
    actual_value DECIMAL(12,4),
    threshold_value DECIMAL(12,4),
    
    status VARCHAR(20) NOT NULL,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    error_message TEXT,
    
    alert_sent_ind CHAR(1) DEFAULT 'N',
    alert_sent_dt TIMESTAMP,
    resolved_ind CHAR(1) DEFAULT 'N',
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

CREATE TABLE cmn.tb_cmd_etl_job_run (
    job_run_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name VARCHAR(100) NOT NULL,
    job_category VARCHAR(50),
    org_id UUID REFERENCES sas.tb_sas_org(org_id),
    
    start_timestamp TIMESTAMP NOT NULL,
    end_timestamp TIMESTAMP,
    start_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    end_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    status VARCHAR(20) NOT NULL,
    records_processed INTEGER DEFAULT 0,
    records_inserted INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_deleted INTEGER DEFAULT 0,
    
    source_system VARCHAR(50),
    target_tables TEXT[],
    error_message TEXT,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 27. PRIVACY & COMPLIANCE (GDPR)
-- =====================================================

CREATE TABLE cmn.tb_cmd_pii_registry (
    pii_registry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_nm VARCHAR(100) NOT NULL,
    column_nm VARCHAR(100) NOT NULL,
    pii_type VARCHAR(50) NOT NULL,
    pii_category VARCHAR(50),
    
    encryption_required_ind CHAR(1) DEFAULT 'N',
    pseudonymization_ind CHAR(1) DEFAULT 'N',
    retention_period_days INTEGER,
    
    gdpr_lawful_basis VARCHAR(100),
    data_subject_rights TEXT[],
    
    -- Required DW audit columns
    dw_curr_row_ind CHAR(1) DEFAULT '1',
    dw_deleted_ind CHAR(1) DEFAULT '0',
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_load_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_job_id INTEGER,
    
    UNIQUE(table_nm, column_nm)
);

CREATE TABLE cmn.tb_cmd_data_deletion_log (
    deletion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES sas.tb_sas_org(org_id),
    account_id UUID REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    
    deletion_request_dt TIMESTAMP NOT NULL,
    deletion_completed_dt TIMESTAMP,
    deletion_request_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),
    deletion_completed_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    
    deletion_reason VARCHAR(100) NOT NULL,
    deletion_type VARCHAR(50),
    
    tables_affected TEXT[],
    records_deleted INTEGER DEFAULT 0,
    
    requested_by_contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),
    approved_by_user_id UUID,
    
    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

CREATE TABLE cmn.tb_cmf_consent_log (
    consent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID REFERENCES sas.tb_sas_account(account_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),

    consent_type VARCHAR(100) NOT NULL, -- MARKETING_EMAIL, DATA_PROCESSING, TERMS_ACCEPTED, etc.
    consent_status CHAR(1) NOT NULL, -- Y = given, N = withdrawn
    consent_source VARCHAR(100), -- UI, API, IMPORT
    consent_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    consent_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),

    lawful_basis VARCHAR(100), -- GDPR lawful basis: CONSENT, CONTRACT, LEGAL_OBLIGATION
    notes TEXT,

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    UNIQUE(org_id, account_id, contact_id, consent_type)
);

-- =====================================================
-- 28. TENANT MANAGEMENT & QUOTAS
-- =====================================================

CREATE TABLE cmn.tb_cmf_tenant_quota (
    quota_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),

    quota_type VARCHAR(50) NOT NULL, -- STORAGE, API_CALLS, USERS, SEATS
    quota_limit DECIMAL(18,4) NOT NULL,
    usage_current DECIMAL(18,4) DEFAULT 0,
    usage_period VARCHAR(20) DEFAULT 'MONTHLY', -- DAILY, MONTHLY, YEARLY

    last_reset_dt DATE,
    next_reset_dt DATE,

    alert_threshold_pct DECIMAL(5,2) DEFAULT 80.0,
    alert_sent_ind CHAR(1) DEFAULT 'N',

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    UNIQUE(org_id, quota_type, usage_period)
);

CREATE TABLE cmn.tb_cmf_integration_registry (
    integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),

    integration_type VARCHAR(100) NOT NULL, -- STRIPE, SALESFORCE, HUBSPOT, SLACK
    integration_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, DISABLED, ERROR

    auth_method VARCHAR(50), -- API_KEY, OAUTH2
    auth_credentials JSONB, -- encrypted storage reference
    last_sync_ts TIMESTAMP,
    next_sync_ts TIMESTAMP,
    sync_frequency VARCHAR(20) DEFAULT 'DAILY',

    error_message TEXT,

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),

    UNIQUE(org_id, integration_type)
);

-- =====================================================
-- 29. EVENT BUS & WEBHOOKS
-- =====================================================

CREATE TABLE cmn.tb_cmf_event_bus (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    account_id UUID REFERENCES sas.tb_sas_account(account_id),
    subscription_id UUID REFERENCES sas.tb_sas_subscription(subscription_id),
    contact_id UUID REFERENCES sas.tb_sas_contact(contact_id),

    event_type VARCHAR(100) NOT NULL, -- SIGNUP, UPGRADE, DOWNGRADE, CANCELLATION, PAYMENT_FAILED, etc.
    event_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    event_clndr_id INTEGER NOT NULL REFERENCES cmn.tb_cmd_clndr(clndr_id),

    event_payload JSONB, -- Raw event metadata (flexible schema)

    -- Delivery / replay info
    source_system VARCHAR(100),
    correlation_id VARCHAR(100),
    processed_ind CHAR(1) DEFAULT 'N',

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

CREATE TABLE cmn.tb_cmf_webhook_delivery (
    webhook_delivery_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),

    target_url VARCHAR(500) NOT NULL,
    event_id UUID NOT NULL REFERENCES cmn.tb_cmf_event_bus(event_id),

    delivery_attempt_nbr INTEGER DEFAULT 1,
    delivery_status VARCHAR(20) NOT NULL, -- PENDING, SUCCESS, FAILED, RETRYING
    response_code INTEGER,
    response_body TEXT,

    first_attempt_ts TIMESTAMP NOT NULL DEFAULT NOW(),
    last_attempt_ts TIMESTAMP,
    next_retry_ts TIMESTAMP,

    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,

    -- Required DW audit columns
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_update_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id),
    dw_update_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 30. BUSINESS MODEL TRANSITION TRACKING
-- =====================================================

CREATE TABLE sas.tb_sas_business_model_transition (
    transition_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES sas.tb_sas_org(org_id),
    
    from_model_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_business_model(business_model_cd),
    to_model_cd INTEGER NOT NULL REFERENCES cmn.tb_cmd_business_model(business_model_cd),
    
    transition_dt DATE NOT NULL,
    transition_reason VARCHAR(500),
    
    -- Migration metrics
    accounts_migrated_cnt INTEGER,
    revenue_impact_cents INTEGER,
    
    dw_create_dt TIMESTAMP NOT NULL DEFAULT NOW(),
    dw_create_clndr_id INTEGER REFERENCES cmn.tb_cmd_clndr(clndr_id)
);

-- =====================================================
-- 31. UNIVERSAL ANALYTICS VIEWS
-- =====================================================

-- Business Model-Aware Customer 360 View
CREATE VIEW sas.vw_account_360 AS
SELECT 
    a.account_id,
    a.org_id,
    o.business_model_cd,
    bm.model_nm as business_model,
    
    -- Universal fields
    a.account_nm,
    a.primary_email,
    at.type_nm as account_type,
    tier.tier_nm as account_tier,
    
    -- B2C specific fields (NULL for B2B)
    CASE WHEN o.business_model_cd = 1 THEN a.individual_first_nm END as individual_first_name,
    CASE WHEN o.business_model_cd = 1 THEN a.individual_last_nm END as individual_last_name,
    
    -- B2B specific fields (NULL for B2C)
    CASE WHEN o.business_model_cd IN (2,3) THEN a.company_legal_nm END as company_name,
    CASE WHEN o.business_model_cd IN (2,3) THEN i.industry_nm END as industry,
    CASE WHEN o.business_model_cd IN (2,3) THEN cs.size_category_nm END as company_size,
    
    -- Current subscription info
    s.total_price_cents / 100.0 as current_revenue,
    p.prdct_plan_nm as current_plan,
    sts.sbscrptn_sts_nm as subscription_status,
    
    -- B2B seat metrics (NULL for B2C)
    CASE WHEN o.business_model_cd IN (2,3) THEN s.total_seats_qty END as total_seats,
    CASE WHEN o.business_model_cd IN (2,3) THEN s.active_seats_qty END as active_seats,
    CASE WHEN o.business_model_cd IN (2,3) AND s.total_seats_qty > 0 
         THEN (s.active_seats_qty * 100.0 / s.total_seats_qty) END as seat_utilization_pct,
    
    -- B2C user metrics (NULL for B2B)
    CASE WHEN o.business_model_cd = 1 THEN uc.total_users END as family_users_cnt,
    
    -- Universal engagement metrics
    h.overall_health_score,
    h.churn_probability,
    
    -- Key dates
    first_cal.cal_dt as first_seen_date,
    start_cal.cal_dt as subscription_start_date

FROM sas.tb_sas_account a
JOIN sas.tb_sas_org o ON a.org_id = o.org_id
JOIN cmn.tb_cmd_business_model bm ON o.business_model_cd = bm.business_model_cd
LEFT JOIN cmn.tb_cmd_account_type at ON a.account_type_cd = at.account_type_cd
LEFT JOIN cmn.tb_cmd_account_tier tier ON a.tier_cd = tier.account_tier_cd
LEFT JOIN cmn.tb_cmd_industry i ON a.industry_cd = i.industry_cd
LEFT JOIN cmn.tb_cmd_company_size cs ON a.company_size_cd = cs.company_size_cd
LEFT JOIN sas.tb_sas_subscription s ON s.account_id = a.account_id AND s.end_clndr_id IS NULL
LEFT JOIN cmn.tb_cmd_prdct_plan p ON s.prdct_plan_cd = p.prdct_plan_cd
LEFT JOIN cmn.tb_cmd_sbscrptn_sts sts ON s.subscription_sts_cd = sts.sbscrptn_sts_cd
LEFT JOIN cmn.tb_cmf_cstmr_health_score h ON h.cstmr_id = a.account_id 
    AND h.score_clndr_id = (SELECT MAX(score_clndr_id) FROM cmn.tb_cmf_cstmr_health_score WHERE cstmr_id = a.account_id)
LEFT JOIN (
    SELECT account_id, COUNT(*) as total_users 
    FROM sas.tb_sas_contact 
    GROUP BY account_id
) uc ON a.account_id = uc.account_id
LEFT JOIN cmn.tb_cmd_clndr first_cal ON first_cal.clndr_id = a.first_engagement_clndr_id
LEFT JOIN cmn.tb_cmd_clndr start_cal ON start_cal.clndr_id = s.start_clndr_id;

COMMENT ON VIEW sas.vw_account_360 IS 'Universal customer 360 view that adapts based on organization business model. B2C shows individual/family data, B2B shows company/seat data.';

-- Universal Cohort Analysis View
CREATE VIEW sas.vw_universal_cohort_analysis AS
SELECT
    o.business_model_cd,
    DATE_TRUNC('month', c.cal_dt) AS cohort_month,
    
    -- B2C cohorts
    COUNT(DISTINCT CASE WHEN o.business_model_cd = 1 THEN a.account_id END) AS b2c_cohort_size,
    
    -- B2B cohorts  
    COUNT(DISTINCT CASE WHEN o.business_model_cd IN (2,3) THEN a.account_id END) AS b2b_cohort_size,
    
    -- Universal retention metrics would be calculated here with additional joins
    COUNT(DISTINCT a.account_id) AS total_cohort_size
    
FROM cmn.tb_cmd_clndr c
JOIN sas.tb_sas_account a ON a.first_engagement_clndr_id = c.clndr_id
JOIN sas.tb_sas_org o ON a.org_id = o.org_id
GROUP BY 1, 2;

-- =====================================================
-- 32. UNIVERSAL BUSINESS FUNCTIONS
-- =====================================================

-- Universal ARR calculation that understands both models
CREATE OR REPLACE FUNCTION calculate_arr(p_org_id UUID)
RETURNS TABLE (
    total_arr DECIMAL(12,2),
    b2c_arr DECIMAL(12,2),
    b2b_arr DECIMAL(12,2),
    avg_account_size_arr DECIMAL(12,2)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_model INTEGER;
BEGIN
    SELECT business_model_cd INTO v_model 
    FROM sas.tb_sas_org 
    WHERE org_id = p_org_id;
    
    IF v_model = 1 THEN  -- Pure B2C
        SELECT 
            SUM(total_price_cents)/100.0,
            SUM(total_price_cents)/100.0,
            0,
            AVG(total_price_cents)/100.0
        INTO total_arr, b2c_arr, b2b_arr, avg_account_size_arr
        FROM sas.tb_sas_subscription s
        WHERE org_id = p_org_id AND subscription_sts_cd IN (1,2);  -- Active statuses
        
    ELSIF v_model = 2 THEN  -- Pure B2B
        SELECT 
            SUM(total_price_cents)/100.0,
            0,
            SUM(total_price_cents)/100.0,
            AVG(total_price_cents)/100.0
        INTO total_arr, b2c_arr, b2b_arr, avg_account_size_arr
        FROM sas.tb_sas_subscription s
        WHERE org_id = p_org_id AND subscription_sts_cd IN (1,2);
        
    ELSE  -- Hybrid (model 3)
        SELECT 
            SUM(s.total_price_cents)/100.0,
            SUM(CASE WHEN a.account_type_cd = 1 THEN s.total_price_cents ELSE 0 END)/100.0,
            SUM(CASE WHEN a.account_type_cd IN (2,3) THEN s.total_price_cents ELSE 0 END)/100.0,
            AVG(s.total_price_cents)/100.0
        INTO total_arr, b2c_arr, b2b_arr, avg_account_size_arr
        FROM sas.tb_sas_subscription s
        JOIN sas.tb_sas_account a ON s.account_id = a.account_id
        WHERE s.org_id = p_org_id AND s.subscription_sts_cd IN (1,2);
    END IF;
    
    RETURN QUERY SELECT total_arr, b2c_arr, b2b_arr, avg_account_size_arr;
END;
$$;


-- =====================================================
-- 33. ROW LEVEL SECURITY (RLS) SETUP
-- =====================================================

-- Enable RLS on all tenant tables
ALTER TABLE sas.tb_sas_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE sas.tb_sas_subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE sas.tb_sas_contact ENABLE ROW LEVEL SECURITY;
ALTER TABLE sas.tb_sas_user_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_invc ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_invc_line_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_pymt_txn ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_usage_evnt ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_usage_mthly_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_cstmr_health_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_cstmr_lifecycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_support_ticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_cstmr_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_dunning_cycle ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_security_event ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmd_experiment ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_experiment_assignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_forecast ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmn.tb_cmf_customer_touchpoint ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
CREATE POLICY tenant_isolation_accounts ON sas.tb_sas_account
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_subscriptions ON sas.tb_sas_subscription  
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_contacts ON sas.tb_sas_contact
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_user_assignments ON sas.tb_sas_user_assignment
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_invoices ON cmn.tb_cmf_invc
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_invoice_line_items ON cmn.tb_cmf_invc_line_item
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_payments ON cmn.tb_cmf_pymt_txn
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_usage_events ON cmn.tb_cmf_usage_evnt
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_usage_summary ON cmn.tb_cmf_usage_mthly_summary
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_health_scores ON cmn.tb_cmf_cstmr_health_score
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_lifecycle ON cmn.tb_cmf_cstmr_lifecycle
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_support_tickets ON cmn.tb_cmf_support_ticket
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_attribution ON cmn.tb_cmf_cstmr_attribution
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_feature_usage ON cmn.tb_cmf_feature_usage
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_api_usage ON cmn.tb_cmf_api_usage
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_dunning_cycle ON cmn.tb_cmf_dunning_cycle
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_security_event ON cmn.tb_cmf_security_event
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_experiment ON cmn.tb_cmd_experiment
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_experiment_assignment ON cmn.tb_cmf_experiment_assignment
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_forecast ON cmn.tb_cmf_forecast
    USING (org_id = current_setting('app.current_org_id')::uuid);

CREATE POLICY tenant_isolation_customer_touchpoint ON cmn.tb_cmf_customer_touchpoint
    USING (org_id = current_setting('app.current_org_id')::uuid);

-- =====================================================
-- 34. SECURE TENANT CONTEXT FUNCTION
-- =====================================================

-- Create a secure function for tenant context

CREATE OR REPLACE FUNCTION app.set_tenant_context(org_uuid UUID)
RETURNS VOID
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('app.current_org_id', org_uuid::text, FALSE);
END;
$$;


COMMENT ON FUNCTION app.set_tenant_context IS 'Sets the current organization context for row-level security. Must be called by application middleware before database queries.';

-- =====================================================
-- 35. PERFORMANCE INDEXES
-- =====================================================

-- Critical multi-tenant indexes
CREATE INDEX  idx_subscription_org_status_dates 
ON sas.tb_sas_subscription (org_id, subscription_sts_cd, start_clndr_id, end_clndr_id);

CREATE INDEX  idx_usage_org_account_date
ON cmn.tb_cmf_usage_evnt (org_id, account_id, evnt_clndr_id);

CREATE INDEX  idx_subscription_active 
ON sas.tb_sas_subscription (org_id, account_id) 
WHERE subscription_sts_cd IN (1,2);

CREATE INDEX  idx_health_score_org_date
ON cmn.tb_cmf_cstmr_health_score (org_id, score_clndr_id, overall_health_score);

CREATE INDEX  idx_support_ticket_org_status
ON cmn.tb_cmf_support_ticket (org_id, ticket_sts_cd, created_clndr_id);

CREATE INDEX  idx_contact_org_activity
ON sas.tb_sas_contact (org_id, last_activity_clndr_id);

CREATE INDEX  idx_api_usage_org_endpoint_date
ON cmn.tb_cmf_api_usage (org_id, api_endpoint_cd, request_clndr_id);

CREATE INDEX  idx_dunning_cycle_org_status
ON cmn.tb_cmf_dunning_cycle (org_id, collection_status, next_action_dt);

CREATE INDEX  idx_security_event_org_type_date
ON cmn.tb_cmf_security_event (org_id, security_event_type_cd, event_clndr_id);

CREATE INDEX  idx_experiment_assignment_org_experiment
ON cmn.tb_cmf_experiment_assignment (org_id, experiment_id, assigned_clndr_id);

CREATE INDEX  idx_forecast_org_type_period
ON cmn.tb_cmf_forecast (org_id, forecast_type_cd, forecast_period_clndr_id);

CREATE INDEX  idx_touchpoint_org_account_date
ON cmn.tb_cmf_customer_touchpoint (org_id, account_id, touchpoint_clndr_id);

-- B2C vs B2B optimized indexes
CREATE INDEX  idx_account_b2c_individual ON sas.tb_sas_account 
(org_id, individual_last_nm, individual_first_nm) 
WHERE account_type_cd = 1;

CREATE INDEX  idx_account_b2b_company ON sas.tb_sas_account
(org_id, company_legal_nm, industry_cd)
WHERE account_type_cd IN (2, 3);

-- BRIN indexes for time-series data
CREATE INDEX  idx_usage_evnt_time_brin ON cmn.tb_cmf_usage_evnt USING BRIN (evnt_timestamp);
CREATE INDEX  idx_pymt_txn_time_brin ON cmn.tb_cmf_pymt_txn USING BRIN (txn_dt);

-- =====================================================
-- 36. REAL-TIME CAPABILITIES
-- =====================================================

-- Enable real-time for critical business events
ALTER PUBLICATION supabase_realtime ADD TABLE cmn.tb_cmf_churn_evnt;
ALTER PUBLICATION supabase_realtime ADD TABLE cmn.tb_cmf_cstmr_health_score;
ALTER PUBLICATION supabase_realtime ADD TABLE cmn.tb_cmf_support_ticket;
ALTER PUBLICATION supabase_realtime ADD TABLE sas.tb_sas_subscription;
ALTER PUBLICATION supabase_realtime ADD TABLE cmn.tb_cmf_feature_usage;

-- Real-time subscription changes
CREATE OR REPLACE FUNCTION notify_subscription_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    PERFORM pg_notify(
        'subscription_change',
        json_build_object(
            'org_id', NEW.org_id,
            'account_id', NEW.account_id,
            'event_type', TG_OP,
            'subscription_id', NEW.subscription_id,
            'timestamp', NOW()
        )::text
    );
    RETURN NEW;
END;
$$;


CREATE TRIGGER subscription_change_notify
    AFTER INSERT OR UPDATE OR DELETE
    ON sas.tb_sas_subscription
    FOR EACH ROW
    EXECUTE FUNCTION notify_subscription_change();

CREATE OR REPLACE FUNCTION notify_health_score_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only notify on significant health score changes
    IF ABS(COALESCE(NEW.overall_health_score, 0) - COALESCE(OLD.overall_health_score, 0)) >= 10 THEN
        PERFORM pg_notify(
            'health_score_change',
            json_build_object(
                'org_id', NEW.org_id,
                'account_id', NEW.cstmr_id,
                'old_score', OLD.overall_health_score,
                'new_score', NEW.overall_health_score,
                'churn_probability', NEW.churn_probability,
                'timestamp', NOW()
            )::text
        );
    END IF;
    RETURN NEW;
END;
$$;


CREATE TRIGGER health_score_change_notify
    AFTER UPDATE
    ON cmn.tb_cmf_cstmr_health_score
    FOR EACH ROW
    EXECUTE FUNCTION notify_health_score_change();

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================

COMMENT ON SCHEMA sas IS 'SaaS Analytics Schema - Core business entities and subscription management';
COMMENT ON SCHEMA cmn IS 'Common Schema - Shared dimensions, reference data, and fact tables';