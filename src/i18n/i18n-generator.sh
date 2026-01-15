#!/bin/bash

jq_filter='.'

while IFS= read -r key; do
  # Skip empty lines
  [ -z "$key" ] && continue

  # Remove the first element
  stripped_key=$(echo "$key" | cut -d. -f2-)
  [ -z "$stripped_key" ] && continue

  # Convert to path array
  IFS='.' read -ra parts <<< "$key"
  last="${parts[-1]}"

  # Build jq path
  path=$(for part in "${parts[@]}"; do printf '"%s", ' "$part"; done | sed 's/, $//')

  # Determine value
  if [[ "$last" == "description" ]]; then
    value=""
  elif [[ "$last" == "title" ]]; then
    # Remove first and last elements
    len=${#parts[@]}
    # echo "$key len $len"
    if (( len == 4 )); then    
      value_parts=("${parts[@]:1:2}")
      value=$(IFS='.'; echo "${value_parts[*]}")    
    elif (( len == 3 )); then    
      value_parts=("${parts[@]:1:1}")
      value=$(IFS='.'; echo "${value_parts[*]}")    
    else
      value="$stripped_key"
    fi
    # echo "\t $value"
  else
    value="$stripped_key"
  fi

  # Escape value
  escaped_value=$(printf '%s' "$value" | sed 's/"/\\"/g')

  # Add to filter
  jq_filter+=" | setpath([$path]; \"$escaped_value\")"
done

jq -n "$jq_filter"
