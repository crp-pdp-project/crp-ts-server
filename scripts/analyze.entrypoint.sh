#!/bin/bash

set -e

SONAR_TOKEN="$1"

if [ -z "$SONAR_TOKEN" ]; then
  echo "❌ SONAR_TOKEN not provided!"
  exit 1
fi

echo "⏳ Waiting for SonarQube to be ready..."
until curl -s http://172.17.0.1:9000/api/system/status | grep -q '"status":"UP"'; do
  sleep 2
done
echo "✅ SonarQube is up!"

echo "📦 Running sonar-scanner..."
docker run --rm \
  -v "${PWD}:/usr/src" \
  -w /usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey="crp-ts-server" \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://172.17.0.1:9000 \
  -Dsonar.token="${SONAR_TOKEN}" \

echo "✅ Analysis complete! Check http://localhost:9000/dashboard?id=crp-ts-server"
