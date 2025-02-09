 #!/bin/bash

# Define the source and target files
source_file="./node_vars.env"
target_file="../app/.env"

# Check if the source file exists
if [ ! -f "$source_file" ]; then
  echo ".env file not found!"
  exit 1
fi

# Ensure target file exists to avoid errors
touch "$target_file"

# Read the source file and update target file
while IFS= read -r line
do
  # Skip empty lines or comments
  if [[ -z "$line" || "$line" =~ ^# ]]; then
    continue
  fi

  # Extract key and value
  key=$(echo "$line" | cut -d'=' -f1)
  value=$(echo "$line" | cut -d'=' -f2-)
  prefixed_key="VITE_$key"

  # Delete existing entry if present
  sed -i '' "/^$prefixed_key=/d" "$target_file"


  # Append the updated line
  echo "$prefixed_key=$value" >> "$target_file"

done < "$source_file"

# echo "Updated $target_file successfully."
