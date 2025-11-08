# Smart File Organizer

Automatically organize files in any directory by type, date, or custom rules. Perfect for cleaning up Downloads folders, organizing media libraries, or managing project files.

## Features

- **Smart categorization** by file type (images, documents, videos, etc.)
- **Date-based organization** (year/month folders)
- **Dry-run mode** to preview changes before applying
- **Customizable rules** via configuration file
- **Duplicate detection** to avoid overwriting
- **Undo support** to reverse operations
- **Safe by default** - never deletes files

## Quick Start

```bash
# Dry run (preview what will happen)
python src/organizer.py ~/Downloads --dry-run

# Organize files
python src/organizer.py ~/Downloads

# Organize by date
python src/organizer.py ~/Downloads --by-date

# Use custom config
python src/organizer.py ~/Downloads --config config/custom-rules.json
```

## Installation

```bash
# Clone the repository
git clone https://github.com/chaps843/projects.git
cd projects/file-organizer

# No dependencies needed - uses Python standard library only!
python --version  # Requires Python 3.7+
```

## Usage Examples

See `examples/` directory for detailed scenarios:
- Organizing Downloads folder
- Managing photo collections
- Cleaning up project directories

## Configuration

Edit `config/rules.json` to customize:
- File type categories
- Folder naming patterns
- File extensions mapping
- Exclusion rules

## Safety Features

- **Dry-run mode** shows what would happen without making changes
- **Duplicate handling** adds numbers to avoid overwrites
- **Undo log** keeps track of all moves for reversal
- **Exclusion patterns** to protect important files

## License

MIT License - Feel free to use and modify!
