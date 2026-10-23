#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "==> Deploying Sealox Backend from root..."
cd backend

echo "==> Installing dependencies..."
pip install -r requirements.txt

echo "==> Running database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static assets..."
python manage.py collectstatic --noinput

echo "==> Seeding mechanical seal products and admin user..."
python manage.py seed_products || true

echo "==> Build successfully completed!"
