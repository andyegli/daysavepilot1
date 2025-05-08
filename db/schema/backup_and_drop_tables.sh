#!/bin/bash

# Load .env file
set -o allexport
source .env
set +o allexport

# Configuration
DB_HOST="localhost"
DB_NAME="daysavepilot1"
DB_USER="$MYSQL_USER"
DB_PASS="$MYSQL_PASSWORD"

# Check required variables
if [[ -z "$DB_USER" || -z "$DB_PASS" ]]; then
  echo "❌ Missing MYSQL_USER or MYSQL_PASSWORD in .env"
  exit 1
fi

# Create backup folder
mkdir -p backups

# Timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup each table
for TABLE in comments tags urls users; do
  echo "Backing up $TABLE..."
  mysqldump -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" "$TABLE" > "backups/${TABLE}_backup_${TIMESTAMP}.sql"
done

# Drop tables
mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS urls;
DROP TABLE IF EXISTS users;
EOF

echo "✅ Backup complete and tables dropped."
echo "✅ All tables have been dropped."
echo "✅ Backup files are stored in the backups directory."     
echo "✅ Backup files are named as <table_name>_backup_<timestamp>.sql"
