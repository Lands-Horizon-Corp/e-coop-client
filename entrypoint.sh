#!/bin/sh

# Find all JS files in the assets folder (where Vite puts them)
for file in /usr/share/nginx/html/assets/*.js; do
  echo "Processing $file..."

  # Get all environment variables starting with VITE_
  # We loop through them and use 'sed' to replace the placeholder with the real value
  for var in $(printenv | grep '^VITE_' | cut -d= -f1); do
    value=$(eval echo \$$var)
    echo "Injecting $var..."
    # Replace 'PLACEHOLDER_VITE_NAME' with 'REAL_VALUE'
    sed -i "s|PLACEHOLDER_$var|$value|g" "$file"
  done
done

# This tells Docker to continue and start Nginx
exec "$@"