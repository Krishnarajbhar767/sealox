#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "==> Installing production dependencies..."
pip install -r requirements.txt

echo "==> Applying database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static assets..."
python manage.py collectstatic --noinput

echo "==> Automatically seeding products and admin user..."
python manage.py seed_products || true

echo "==> Build successfully completed!"
