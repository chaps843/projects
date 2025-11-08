# Basic Usage Examples

## Example 1: Preview Organization (Dry Run)

Always start with a dry run to see what will happen:

```bash
python src/organizer.py ~/Downloads --dry-run
```

**Output:**
```
DRY RUN - Organizing 42 files in /home/user/Downloads
======================================================================
[WOULD MOVE] vacation.jpg → Images/vacation.jpg
[WOULD MOVE] resume.pdf → Documents/resume.pdf
[WOULD MOVE] song.mp3 → Audio/song.mp3
...

======================================================================
SUMMARY
======================================================================
Total files that would be organized: 42

Images               15 files ███████████████ 35.7%
Documents            12 files ████████████ 28.6%
Videos                8 files ████████ 19.0%
Audio                 5 files █████ 11.9%
Archives              2 files ██ 4.8%
```

## Example 2: Organize Files by Type

Once you're happy with the preview, organize for real:

```bash
python src/organizer.py ~/Downloads
```

This will:
- Create folders for each file type (Images, Documents, Videos, etc.)
- Move files into their respective folders
- Handle duplicates by adding numbers (_1, _2, etc.)
- Create an undo log file

## Example 3: Organize by Date

Organize files into year/month folders:

```bash
python src/organizer.py ~/Downloads --by-date
```

**Result structure:**
```
Downloads/
├── 2024/
│   ├── 01/
│   │   ├── file1.pdf
│   │   └── file2.jpg
│   ├── 10/
│   │   └── file3.mp4
│   └── 11/
│       └── file4.docx
└── 2023/
    └── 12/
        └── old_file.txt
```

## Example 4: Custom Date Format

Organize by year only:

```bash
python src/organizer.py ~/Downloads --by-date --date-format "%Y"
```

Or by day:

```bash
python src/organizer.py ~/Downloads --by-date --date-format "%Y-%m-%d"
```

## Example 5: Use Custom Categories

Create your own categorization rules:

```bash
python src/organizer.py ~/Downloads --config config/custom-rules.json
```

## Example 6: Undo Organization

Made a mistake? Undo the last organization:

```bash
python src/undo.py organize_undo.log --dry-run  # Preview undo
python src/undo.py organize_undo.log            # Actually undo
```

## Example 7: Ignore Uncategorized Files

Don't create an "Others" folder for unknown file types:

```bash
python src/organizer.py ~/Downloads --no-others
```

## Real-World Scenarios

### Scenario 1: Clean Up Downloads Weekly

Add to crontab for weekly organization:

```bash
# Run every Sunday at 2 AM
0 2 * * 0 /usr/bin/python3 /home/user/projects/file-organizer/src/organizer.py /home/user/Downloads
```

### Scenario 2: Organize Photo Library

```bash
# Organize photos by date taken (year/month)
python src/organizer.py ~/Pictures/unsorted --by-date --date-format "%Y/%m"
```

### Scenario 3: Project Cleanup

```bash
# Organize project files, keeping only code/docs/data
python src/organizer.py ~/project/messy --config config/project-rules.json
```

## Tips

1. **Always dry-run first** to preview changes
2. **Check the undo log** location before organizing
3. **Customize rules.json** for your specific needs
4. **Back up important files** before organizing large directories
5. **Use meaningful date formats** that match your workflow
