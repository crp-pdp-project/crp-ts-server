#!/bin/sh

echo "⏳ Waiting for MySQL to be ready..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "⏳ Still waiting for $DB_HOST:$DB_PORT..."
  sleep 2
done

echo "✅ MySQL is ready, running migrations..."
yarn migrate

echo "🚀 Starting server..."
exec yarn dev