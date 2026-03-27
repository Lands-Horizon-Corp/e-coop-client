#!/bin/sh
set -e

echo "Starting Environment Variable Injection..."

# Find all JS files in the assets folder
# Using a check to ensure files exist before looping
if [ -d "/usr/share/nginx/html/assets" ]; then
  for file in /usr/share/nginx/html/assets/*.js; do
    [ -e "$file" ] || continue
    echo "Processing $file..."

    # Get all environment variables starting with VITE_
    for var in $(printenv | grep '^VITE_' | cut -d= -f1); do
      value=$(eval echo \$$var)
      echo "Injecting $var..."
      # Perform the replacement
      sed -i "s|PLACEHOLDER_$var|$value|g" "$file"
    done
  done
fi

echo "Injection complete. Starting Nginx..."
exec "$@"