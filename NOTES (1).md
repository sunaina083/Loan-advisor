# Loan Advisor Project — Notes

This file is our running diary. Every time we build or add something, we write
a short note here: what it is, why we added it, and how to see/run it.
Written in plain English so both teammates can understand it, even without
a strong coding background.

---

## How to use this file
- Add a new dated entry every time we finish a step or feature.
- Keep entries short: What did we build? Why? How do I run/see it?
- If something breaks or you don't understand a past entry, ask Claude to
  re-explain that specific entry — it's more useful than re-reading old chat.

---

## Project Overview (plain English)

We are building an **AI Loan Advisor** — a website where someone enters their
loan application details (income, credit score, loan amount, etc.) and the
app tells them:
1. Whether they'd likely be approved or rejected
2. How much loan they're actually eligible for
3. WHY the model thinks that (which factors helped/hurt)
4. What they could change to improve their chances

It also has an "analyst" side for viewing how the model itself performs, and
extra features like saved history and an admin override panel.

This is being built for our Supervised Learning course project — every part
maps to a specific unit/topic in our syllabus (see PROGRESS.md for the map).

---

## Setup Log

### [Setup] Environment
- Installed Python, VS Code, Python extension, Jupyter extension.
- Created project folder `loan-advisor/`.
- Installed core libraries: pandas, numpy, matplotlib, seaborn, scikit-learn.
- Why: these are the basic tools needed to load data, explore it, draw
  charts, and eventually train ML models.

---

## Entries

(New entries go below this line, most recent at the bottom)

### Day 1 — Environment Setup + Loading the Dataset
- Installed Python, VS Code, Python extension, Jupyter extension (all free).
- Created project folder `loan-advisor/` with a `data/` subfolder.
- Downloaded the dataset "Loan Approval Prediction Dataset" from Kaggle
  (by architsharma01) — saved as `data/loan_approval_dataset.csv`.
  This dataset has applicant details like income, CIBIL score, loan
  amount, employment type, and whether the loan was approved or rejected.
- Created `01_eda.ipynb` — our first notebook, for Exploratory Data
  Analysis (EDA). EDA just means "looking at the data closely before
  doing anything else" — checking what's in it, if anything's missing,
  and spotting patterns.
- Wrote and ran code to:
  1. Load the CSV into a pandas DataFrame (a table-like structure) and
     preview the first 5 rows (`df.head()`)
  2. Check the structure — column names, data types, row count
     (`df.info()`)
  3. Get statistical summaries of numeric columns (`df.describe()`)
  4. Check for missing values (`df.isnull().sum()`)
  5. Check how many loans were Approved vs Rejected
     (`df['loan_status'].value_counts()`) — this matters because if one
     outcome is much more common than the other, the model needs special
     handling (called "class imbalance") so it doesn't just learn to
     always predict the majority outcome.

**Where things live (as of today):**
- Whole project moved from `C:\Users\HP\OneDrive\Documents\Loan-advisor`
  to `D:\Loan-advisor` because the C: drive ran out of storage space.
  Lesson learned: keep an eye on free disk space when working with data
  files and installed libraries.
- Dataset: `data/loan_approval_dataset.csv`
- EDA notebook: `01_eda.ipynb`

### Fixes made along the way
- **Problem:** Column names in the CSV had hidden leading spaces (e.g.
  `' loan_status'` instead of `'loan_status'`), which caused a
  `KeyError` when trying to access columns.
  **Fix:** Ran `df.columns = df.columns.str.strip()` right after loading
  the data — this removes extra spaces from every column name in one
  line. Good habit: always check `df.columns.tolist()` early to catch
  this kind of thing.

### Key finding: class balance
Ran `df['loan_status'].value_counts()`:
- Approved: 2,656 (~62%)
- Rejected: 1,613 (~38%)

This is a **mild class imbalance** — not extreme, but enough that we'll
apply a light correction (SMOTE) during preprocessing so the model
doesn't lean too heavily toward predicting "Approved" just because it's
more common in the data.

**Next up (Day 2):** Start cleaning the data — check for missing values
properly, encode text columns (like education, self_employed,
loan_status) into numbers the model can understand, scale numeric
columns, and apply SMOTE for the class imbalance.

### Fix: code pasting issue in Jupyter
- When pasting multi-line code into a notebook cell, VS Code sometimes
  squished everything onto one line, causing a `SyntaxError`.
  **Fix:** paste code in smaller chunks (one logical step per cell), and
  double check each cell shows code on separate lines before running.
  If a paste looks squished, clear the cell (Ctrl+A, Delete) and paste
  again, or type the lines manually.

### Visualizations (finishing Day 1)
Added 3 charts to `01_eda.ipynb` using matplotlib + seaborn:
1. **Approval vs Rejection count** — simple bar chart confirming the
   2,656 vs 1,613 split we found earlier, but visually.
2. **CIBIL score distribution by loan status** — histogram comparing
   score spread for Approved vs Rejected applicants. This is expected
   to show a clear pattern: higher CIBIL scores lean toward Approved.
3. **Annual income by loan status** — box plot comparing income spread
   between Approved and Rejected groups, useful for spotting outliers.

**Day 1 is now complete:** environment set up, dataset loaded, column
names cleaned, class balance checked, and first visual patterns explored.

**IMPORTANT REMINDER:** Save this NOTES.md file into the project folder
after every session! (We lost yesterday's saved copy because it wasn't
downloaded/replaced in the actual project folder — this version now
includes everything from Day 1, so we're all caught up.)
