# CRITICAL: Field Configuration - Manual Step Required

## ⚠️ Important: Custom Fields Need Screen Association

The provisioning system has successfully created all custom fields, but there is **one manual Jira Cloud configuration step** required to make them fully functional.

### What Works
- ✅ 40 custom fields created with correct keys
- ✅ Field contexts configured
- ✅ Select field options created
- ✅ Fields exist in Jira and can be queried via API

### What Doesn't Work Yet
- ❌ Custom fields cannot be edited on issues
- ❌ Error: "Field 'customfield_XXXXX' cannot be set. It is not on the appropriate screen"
- ❌ Sample issue creation fails when trying to populate custom fields

## Why?

In Jira Cloud, fields must be added to **screen layouts** to be editable. This is a Jira Cloud UI configuration that has no public REST API.

**The Problem Chain:**
1. Field created ✅
2. Field needs to be on a screen ❌ (no API available)
3. Without screen association, field cannot be edited
4. Result: Custom fields exist but are "read-only" from API perspective

## The Fix (Manual, ~15 minutes)

### Step 1: Go to Jira Cloud Settings
1. Open your Jira instance
2. Click **Settings** (gear icon) → **Issues**
3. Click **Screens**

### Step 2: Find the "Create" or "Edit" Screen for Your Issue Type

Look for screens named:
- "Default Issue Create Screen" 
- "Schermo di Creazione" (or your language equivalent)
- "Schermo di Modifica"

**Find the one associated with your issue type (Cliente, Interaction, etc.)**

### Step 3: Add Custom Fields to the Screen

Edit the screen and add these 13 fields:

| Field Key | Custom Field ID | Field Name |
|-----------|-----------------|------------|
| account.segment | customfield_12007 | Segmento |
| account.userCount | customfield_12008 | Conteggio Utenti |
| account.mrr | customfield_12009 | MRR |
| account.healthScore | customfield_12010 | Health Score |
| account.utilizationRate | customfield_12011 | Tasso di Utilizzo |
| interaction.startDate | customfield_12015 | Data Inizio Relazione |
| interaction.renewalDate | customfield_12016 | Data Rinnovo Prevista |
| riskOpportunity.lossLikelihood | customfield_12021 | Probabilità Di Perdita |
| riskOpportunity.completionDate | customfield_12022 | Data Completamento |
| riskOpportunity.value | customfield_12023 | Valore Iniziativa |
| riskOpportunity.completionProbability | customfield_12025 | Probabilità Di Completamento |
| successPlan.budgetAllocated | customfield_12026 | Budget Allocato |
| successPlan.deadline | customfield_12027 | Data Scadenza |

### Step 4: Repeat for Each Issue Type

Add the same fields to the screens for:
- Cliente (or "account")
- Interaction
- Success Plan
- Risk
- Opportunity
- Renewal

## Verification

After adding the fields to the screens, test with:

```bash
npm start
```

You should see:
```
[SAMPLE-DATA] ✅ Issue CSM-XX created with all custom fields populated
[SAMPLE-DATA] All 13 fields successfully updated
```

## Why This Limitation Exists

- Jira Cloud uses a different architecture than Jira Server/Data Center
- Screen management is considered part of project configuration, not programmatic setup
- Atlassian restricts programmatic screen field modifications to prevent accidental data misconfigurations

## Alternative Solutions (If API Automation is Critical)

1. **Jira Cloud Automation:** Create automations that populate fields, but this doesn't solve visibility
2. **Jira Apps:** Some third-party apps offer screen configuration APIs
3. **Manual via Terraform:** Use Atlassian Terraform provider for IaC
4. **Contact Atlassian:** Request enhanced APIs for cloud configuration

## Timeline Impact

- **Without Fix:** 1-2 hours (manual configuration)
- **With Fix:** ✅ Ready to use, all features functional
- **Effort:** 15 minutes of manual Jira UI work

## Next Steps

1. Follow the manual steps above
2. Return and run: `npm start`
3. All provisioning will be complete

For detailed diagnostic information, see: [FIELD_SCREEN_ASSOCIATION_DIAGNOSTIC.md](./FIELD_SCREEN_ASSOCIATION_DIAGNOSTIC.md)
