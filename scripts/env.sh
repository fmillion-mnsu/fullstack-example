#!/bin/bash

# This script creates a JavaScript source file dynamically from environment variables.

echo "Current environment:"
env

echo "Creating environment file..."
# create runtime env JS file
# This will default to /usr/share/nginx/html/env.js, but if a filename is given on the command line it'll be used instead.
envJs="${1:-/usr/share/nginx/html/env.js}"

#Recreate config file
rm -rf ${envJs}
touch ${envJs}

# Add assignment 
echo "window.env = {" >> ${envJs}

# Iterate over all environment variables that start with REACT_APP_
for var in $(env | grep '^REACT_APP_' | cut -d '=' -f 1); do
    # Read value of current variable
    value=$(printf '%s\n' "${!var}")
    # Append configuration property to JS file
    echo "$var:\"$value\"," >> ${envJs}
done

echo "};" >> "${envJs}"

echo "generated environment file ${envJs}"
#cat ${envJs}