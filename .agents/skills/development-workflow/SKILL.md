---
name: development-workflow
description: "Mandatory 7-step development workflow for all tasks: Analyze → Plan → Propose → Implement → Review → Test → Deliver. Prevents incomplete implementations and ensures quality."
risk: low
source: custom
date_added: "2026-05-11"
---

# Development Workflow (MANDATORY)

> **The only acceptable way to develop features, fix bugs, and implement changes.**
> **This workflow MUST be followed for ALL development tasks without exception.**

## When to Use

**Use this skill for EVERY development task:**
- New features and components
- Bug fixes and patches
- Refactoring and optimizations
- UI/UX improvements
- API changes
- Database migrations
- Performance improvements
- Security updates
- Any code changes whatsoever

**⚠️ CRITICAL:** This is not optional. This is the STANDARD workflow.

---

## The 7-Step Process

### Step 1: 🔍 Analyze (วิเคราะห์งาน)

**Objective:** Understand the complete context before starting work.

#### What to Do:
1. **Read the request carefully** - Identify exactly what the user wants
2. **Review existing code** - Read relevant files to understand current implementation
3. **Identify dependencies** - Find related components, functions, or modules
4. **Check for impacts** - Will this change affect other features?
5. **Spot potential issues** - What could go wrong? What edge cases exist?
6. **Clarify ambiguities** - Ask questions if requirements are unclear

#### Tools to Use:
- `read_file` - Read existing implementations
- `grep_search` - Find related code
- `semantic_search` - Understand context
- `file_search` - Locate relevant files
- `vscode_listCodeUsages` - Find where code is used

#### Output:
A clear mental (or written) understanding of:
- What currently exists
- What needs to change
- What dependencies exist
- What risks are present

#### Example:
```
User Request: "Add search functionality to leads table"

Analysis:
- Current table: src/components/admin/LeadsTable.tsx
- Has filters (status, source) but no search
- Leads data comes from getLeads() server action
- Need to add search state + filter logic
- Should search: name, email, company, message
- No breaking changes expected
```

---

### Step 2: 📋 Plan (วางแผน)

**Objective:** Create a detailed, actionable implementation plan.

#### What to Include:
1. **Files to create** - List new files with purpose
2. **Files to modify** - List existing files and what will change
3. **Functions to add/modify** - Specific function names and signatures
4. **Data structures** - New types, interfaces, schemas
5. **API changes** - New endpoints or parameter changes
6. **Testing approach** - How you'll verify it works
7. **Edge cases** - How you'll handle errors and boundaries
8. **Step-by-step sequence** - Order of implementation

#### Plan Format:
```markdown
## Implementation Plan

### Files to Modify:
1. `src/components/admin/LeadsTable.tsx`
   - Add searchQuery state
   - Add search input field
   - Filter leads by search query
   - Update filteredLeads logic

### Changes:
- Add: `const [searchQuery, setSearchQuery] = useState('')`
- Add: Search input in filters section
- Modify: `filteredLeads` to include search filter
- Search fields: name, email, company, message

### Edge Cases:
- Empty search string → show all leads
- No matches → show empty state
- Case-insensitive search

### Testing Plan:
- Search for existing lead name → should filter
- Search for email → should filter
- Empty search → show all
- No matches → show empty state
```

#### Output:
A complete plan that answers:
- WHAT will be changed?
- WHERE will it be changed?
- HOW will it be implemented?
- WHEN will each step happen? (sequence)

---

### Step 3: ✅ Propose & Get Approval (เสนอแผนงานให้อนุมัติ)

**Objective:** Get explicit user approval before writing code.

**⚠️ THIS IS THE MOST CRITICAL STEP ⚠️**

#### What to Do:
1. **Present your analysis** - Show you understand the request
2. **Present your plan** - Clear, organized, specific
3. **List deliverables** - What the user will get
4. **Highlight decisions** - Any choices you made and why
5. **Ask for confirmation** - Explicitly request approval
6. **WAIT for response** - Do NOT proceed without approval

#### Proposal Format:
```markdown
## 📋 Implementation Proposal: [Feature Name]

### Analysis Summary:
- Current state: [what exists now]
- Requested change: [what user wants]
- Impact: [what will be affected]

### Implementation Plan:

**Files to Create:**
- `src/lib/utils/export.ts` - CSV export utility

**Files to Modify:**
- `src/components/admin/LeadsTable.tsx` - Add export button

**What Will Be Added:**
1. Export button in table header
2. Export function that converts leads to CSV
3. Download trigger in browser

**What Will Be Changed:**
1. Table header layout (add export button)

**What Will Be Removed:**
None

### Testing Approach:
- Test with 0 leads
- Test with multiple leads
- Verify CSV format
- Test download in different browsers

### Estimated Complexity:
Low - straightforward implementation

---

**Ready to proceed?** 
Please confirm to start implementation.
```

#### Approval Keywords to Wait For:
- "OK"
- "Yes"
- "Go ahead"
- "Proceed"
- "ดำเนินการต่อ"
- "พร้อม"
- "เริ่มได้"

#### What NOT to Do:
- ❌ Start coding without approval
- ❌ Assume the user agrees
- ❌ Skip this step for "small" changes
- ❌ Proceed with "I think this is what they want"

---

### Step 4: 🔨 Implement (พัฒนาเมื่อได้รับอนุมัติ)

**Objective:** Execute the approved plan with high-quality code.

#### Implementation Guidelines:

**Code Quality:**
- Follow project conventions and style
- Write clean, readable code
- Add comments for complex logic
- Use meaningful variable names
- Keep functions focused and small

**Error Handling:**
- Add try-catch blocks
- Validate inputs
- Handle edge cases
- Provide meaningful error messages
- Log errors appropriately

**Performance:**
- Avoid unnecessary re-renders
- Use memoization when needed
- Optimize database queries
- Don't block the event loop

**Type Safety:**
- Use TypeScript properly
- Define interfaces/types
- Avoid `any` unless necessary
- Type function parameters and returns

**Efficiency Tips:**
- Use `multi_replace_string_in_file` for multiple edits
- Read files once, edit multiple times
- Batch independent operations in parallel

#### During Implementation:
- ✅ Follow the plan step-by-step
- ✅ Stay focused on approved scope
- ✅ Handle edge cases you identified
- ✅ Add error handling
- ❌ Don't add "bonus features" without approval
- ❌ Don't skip steps from the plan

---

### Step 5: 🔎 Review (รีวิวสิ่งที่ทำ)

**Objective:** Verify code quality and correctness before testing.

#### Review Checklist:

**Code Correctness:**
- [ ] All planned changes implemented
- [ ] No syntax errors
- [ ] Logic is correct
- [ ] Edge cases handled
- [ ] Error handling present

**Type Safety:**
- [ ] No TypeScript errors (`get_errors()`)
- [ ] Function signatures match
- [ ] Types are correct
- [ ] No `any` without reason

**Code Quality:**
- [ ] Follows project conventions
- [ ] No unused imports
- [ ] No console.logs left in
- [ ] Comments where needed
- [ ] Clean and readable

**Integration:**
- [ ] API contracts match (client ↔ server)
- [ ] Function calls match signatures
- [ ] Props passed correctly
- [ ] Imports are correct

**Security:**
- [ ] No hardcoded secrets
- [ ] Inputs validated
- [ ] SQL injection prevented
- [ ] XSS prevented

#### Tools to Use:
- `get_errors()` - Check TypeScript/build errors
- `read_file` - Re-read your changes
- Mental code walk-through

#### Example Review Notes:
```
Review of Lead Search Feature:
✅ Added search state
✅ Added search input with proper styling
✅ Filter logic includes case-insensitive search
✅ No TypeScript errors
✅ Handles empty search
✅ Shows empty state when no matches
⚠️ Found issue: Missing debounce on search input
   → Fix: Will add later if performance issue
```

---

### Step 6: 🧪 Test (ทดสอบ)

**Objective:** Verify the implementation works correctly before delivery.

#### Testing Approach:

**1. Static Analysis:**
- Run `get_errors()` - No TypeScript errors
- Check function signatures match
- Verify types are correct
- Review error handling paths

**2. Code Path Analysis:**
- Trace happy path - Does main flow work?
- Trace error paths - Do errors handle gracefully?
- Check edge cases - Empty data, large data, invalid input
- Verify integrations - API calls, database queries

**3. Mental Testing:**
```
Test Case 1: User searches for existing name
- Input: "John"
- Expected: Filtered leads with "John" in name
- Result: ✅ Works (based on code logic)

Test Case 2: Empty search
- Input: ""
- Expected: Show all leads
- Result: ✅ Works (filter returns true)

Test Case 3: No matches
- Input: "xyz123notfound"
- Expected: Empty state shown
- Result: ✅ Works (filteredLeads.length === 0)
```

**4. Integration Testing:**
- Server actions called correctly?
- Database queries valid?
- API responses handled?
- State updates trigger re-renders?

#### Testing Checklist:
- [ ] TypeScript compiles (no errors)
- [ ] Happy path works
- [ ] Error handling works
- [ ] Edge cases covered
- [ ] No console errors expected
- [ ] Integrations work
- [ ] Performance acceptable
- [ ] Accessibility considered

#### When to Flag for Manual Testing:
- Complex UI interactions
- Browser-specific features
- Visual/styling changes
- File uploads/downloads
- Real-time features
- Payment flows
- Authentication flows

---

### Step 7: 📦 Deliver (ส่งงานหากทดสอบผ่าน)

**Objective:** Provide complete, tested, documented deliverable.

#### Delivery Format:

```markdown
## ✅ [Feature Name] Complete

### Summary:
Brief description of what was implemented.

### Files Changed:
- ✅ `src/components/admin/LeadsTable.tsx` - Added search functionality
- ✅ `src/lib/actions/leads.ts` - Updated getLeads filter

### Features Implemented:
- Search by name, email, company, message
- Case-insensitive search
- Empty state when no matches
- Clears filter when search is empty

### Testing Instructions:
1. Navigate to `/dashboard/leads`
2. Type in search box: "John"
   - Expected: Only leads with "John" shown
3. Clear search box
   - Expected: All leads shown
4. Search for "xyz123"
   - Expected: Empty state with "No leads found"

### Known Limitations:
- Search is client-side only (fine for small data)
- No debounce (add if performance issue)

### Manual Testing Needed:
- [ ] Visual check of search input styling
- [ ] Test with large dataset (100+ leads)
- [ ] Mobile responsive check

---

**Ready for use!** 🚀
```

#### What to Include:
1. **Summary** - What was done
2. **Changed files** - List of modifications
3. **Features** - What was added/fixed
4. **Testing instructions** - How to verify
5. **Known issues** - Any caveats
6. **Manual testing** - What user should check

#### What NOT to Do:
- ❌ Deliver without review
- ❌ Deliver without testing
- ❌ Skip documentation
- ❌ Assume user knows how to test
- ❌ Deliver with known bugs

---

## Workflow Variations by Task Size

### Small Tasks (< 30 min)
Can be brief but must include all steps:
```
1. Analyze: "Fix typo in button text"
2. Plan: "Change 'Submitt' to 'Submit' in contact form"
3. Propose: "Will fix typo in src/app/contact/page.tsx line 123. OK?"
4. Implement: [after approval]
5. Review: Check TypeScript errors
6. Test: Verify text is correct
7. Deliver: "Fixed typo. Check /contact button."
```

### Medium Tasks (30 min - 2 hours)
Full workflow with detailed plan:
- Analysis: Review relevant code
- Plan: Step-by-step implementation
- Proposal: Organized plan with files and changes
- Rest of steps as normal

### Large Tasks (EPICs, > 2 hours)
Break into subtasks:
1. Propose high-level plan for entire EPIC
2. Get approval on approach
3. Run full workflow for each subtask
4. Deliver incrementally

---

## Decision Tree: When to Ask vs Decide

### Always Ask User:
- Architecture decisions
- Technology choices
- Breaking changes
- Feature scope changes
- Anything ambiguous

### Can Decide Yourself:
- Implementation details
- Variable names
- Code organization
- Minor styling tweaks
- Error message wording

**Rule of Thumb:** If it affects WHAT is built → Ask. If it affects HOW it's built → Decide.

---

## Common Mistakes to Avoid

### ❌ The "Quick Fix" Trap
```
User: "Fix the button"
You: [immediately starts coding]
Problem: Didn't analyze, didn't propose, might fix wrong thing
```

**✅ Correct:**
```
User: "Fix the button"
You: "Which button? What's wrong with it?"
[Analyze → Plan → Propose → ...]
```

### ❌ The "I Know What They Want" Trap
```
User: "Add export feature"
You: [implements CSV export without asking]
Problem: Maybe they wanted PDF or Excel
```

**✅ Correct:**
```
User: "Add export feature"
You: "What format? CSV, Excel, PDF?"
[Get clarification → Analyze → Plan → Propose → ...]
```

### ❌ The "Small Change" Trap
```
User: "Change button color"
You: [changes it without review/test]
Problem: Might break dark mode or accessibility
```

**✅ Correct:**
```
User: "Change button color"
[Even small changes go through workflow]
- Analyze: Check current color, theme system
- Plan: Update color in theme file
- Propose: "Change primary button from cyan to blue?"
- Implement → Review → Test (check contrast, dark mode)
- Deliver
```

### ❌ The "It Should Work" Trap
```
[Implements feature without testing]
You: "Done! It should work."
Problem: Didn't verify, might have bugs
```

**✅ Correct:**
```
[After implementation]
- Review: Check code quality
- Test: Trace through logic, verify signatures
- Deliver: "Tested X, Y, Z scenarios - ready to use"
```

---

## Integration with Other Skills

This workflow works WITH other skills:

### UI/UX Changes:
1. Analyze: Use `ui-ux-pro-max` skill for best practices
2. Plan: Design system, color palette, animations
3. Propose: Show mockup or description
4. Implement: Follow UI/UX guidelines
5. Review: Check accessibility, contrast, touch targets
6. Test: Verify responsive, animations smooth
7. Deliver: Include screenshots if needed

### API Development:
1. Analyze: Use `nodejs-best-practices` for architecture
2. Plan: Choose framework, validation library
3. Propose: API contract (endpoints, request/response)
4. Implement: Follow security best practices
5. Review: Check error handling, validation
6. Test: Test with invalid data, edge cases
7. Deliver: API documentation

### Database Changes:
1. Analyze: Current schema, migrations
2. Plan: Schema changes, migration strategy
3. Propose: Show before/after schema
4. Implement: Write migration
5. Review: Check reversibility, data safety
6. Test: Test migration up and down
7. Deliver: Migration instructions

---

## Verification Checklist

Before starting ANY task:

- [ ] Have I read the request carefully?
- [ ] Do I understand what the user wants?
- [ ] Have I analyzed existing code?
- [ ] Have I created a detailed plan?
- [ ] Have I presented the plan to the user?
- [ ] Have I received explicit approval?

Before delivering ANY work:

- [ ] Have I reviewed my code?
- [ ] Have I checked for TypeScript errors?
- [ ] Have I tested the implementation?
- [ ] Have I verified edge cases?
- [ ] Have I prepared testing instructions?
- [ ] Is my delivery message clear and complete?

---

## Example: Complete Workflow

**User Request:** "Add pagination to leads table"

### 1. Analyze
```
Current state:
- LeadsTable shows all leads at once
- No pagination implemented
- Uses filteredLeads array
- Could be slow with 1000+ leads

Requirements:
- Add page size selector (10, 25, 50, 100)
- Add page navigation (prev, next, page numbers)
- Maintain filters during pagination
- Show "X-Y of Z leads"

Dependencies:
- LeadsTable component
- Might affect performance
- Need to preserve search/filter state
```

### 2. Plan
```
Implementation:
1. Add state: currentPage, pageSize
2. Add pagination controls component
3. Calculate visible leads (slice array)
4. Add page size selector
5. Add prev/next buttons
6. Add page number buttons (with ellipsis)
7. Show results count

Files to modify:
- src/components/admin/LeadsTable.tsx

New code:
- const [currentPage, setCurrentPage] = useState(1)
- const [pageSize, setPageSize] = useState(25)
- const paginatedLeads = useMemo(...)
- PageControls component

Edge cases:
- Empty results
- Single page
- Current page > total pages after filter
```

### 3. Propose
```markdown
## 📋 Proposal: Add Pagination to Leads Table

### Analysis:
Currently showing all leads at once. With 100+ leads, 
performance degrades and UX suffers.

### Plan:
Add pagination with:
- Page size selector: 10, 25, 50, 100 leads per page
- Navigation: Prev, Next, Page numbers (1, 2, 3 ... 10)
- Results counter: "Showing 1-25 of 143 leads"
- Preserves search and filters

### Files to Modify:
- `src/components/admin/LeadsTable.tsx`
  - Add pagination state (page, pageSize)
  - Add useMemo for paginated data
  - Add pagination UI below table
  - Update results count

### What Will Be Added:
1. Pagination controls (bottom of table)
2. Page size selector (dropdown)
3. Page navigation buttons
4. Results count display

### Edge Cases:
- Reset to page 1 when filter changes
- Handle empty results
- Handle single page (hide controls)

### Testing:
- Test with 5 leads (single page)
- Test with 100 leads (multiple pages)
- Test page size changes
- Test filter + pagination

**Ready to proceed?**
```

### 4. Implement
[After approval, implement according to plan]

### 5. Review
```
Review checklist:
✅ Pagination state added
✅ useMemo for paginatedLeads
✅ Page controls rendered
✅ Results count shown
✅ Edge cases handled (empty, single page)
✅ No TypeScript errors
✅ Filters reset to page 1
✅ Clean code, proper types
```

### 6. Test
```
Test scenarios:
✅ With 5 leads: Single page, controls hidden
✅ With 100 leads: Multiple pages, navigation works
✅ Page size 10: Shows 10 leads, pages calculated
✅ Page size 100: Shows all on one page
✅ Apply filter: Resets to page 1, recalculates
✅ Clear filter: Returns to page 1, shows all
✅ Navigate pages: Previous/Next work
✅ Click page number: Jumps to page
```

### 7. Deliver
```markdown
## ✅ Pagination Added to Leads Table

### Summary:
Added pagination with page size selector and navigation controls.

### Files Changed:
- ✅ `src/components/admin/LeadsTable.tsx`
  - Added pagination state and logic
  - Added pagination controls UI
  - Updated results counter

### Features:
- Page size selector: 10, 25, 50, 100
- Page navigation: Prev, Next, numbered pages
- Results counter: "Showing X-Y of Z leads"
- Auto-reset to page 1 when filters change
- Hide controls when single page

### Testing Instructions:
1. Go to `/dashboard/leads`
2. Default: 25 leads per page
3. Change page size → should update display
4. Click Next → should go to page 2
5. Apply filter → should reset to page 1
6. Test with different lead counts

### Manual Testing:
- [ ] Test with 5 leads (should hide pagination)
- [ ] Test with 100+ leads (should show multiple pages)
- [ ] Verify mobile responsive

**Ready to use!** 🚀
```

---

## Summary: The Non-Negotiable Rules

1. **ALWAYS follow all 7 steps** - No exceptions
2. **NEVER skip the proposal** - Always get approval
3. **WAIT for approval** - Don't implement without it
4. **REVIEW before testing** - Check code quality first
5. **TEST before delivering** - Verify it works
6. **DOCUMENT your delivery** - Clear instructions

---

## Quick Reference Card

```
1. 🔍 Analyze    → Understand context
2. 📋 Plan       → Create detailed plan
3. ✅ Propose    → Get user approval [WAIT HERE]
4. 🔨 Implement  → Write code
5. 🔎 Review     → Check quality
6. 🧪 Test       → Verify it works
7. 📦 Deliver    → Document & hand off
```

**Remember:** Quality over speed. A well-planned, tested feature is better than a quick, broken one.

---

**Last Updated:** May 11, 2026
**Status:** MANDATORY for all development work
