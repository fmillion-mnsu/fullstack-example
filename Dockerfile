# This is a multistage dockerfile that has builds for both frontend and backend.
# The Compose file references specific stages to build each constituent part.

# Python container that runs the backend.
FROM python:alpine AS backend
COPY backend/ /src/
WORKDIR /src
RUN pip install -e .
# Traefik reads the EXPOSE parameter to determine the port to forward. It uses the first instance of an EXPOSE if multiple are present.
EXPOSE 5000
# The container will startup by running the backend directly.
CMD ["fullstack-demo"]

# Straightforward - copies the frontend and builds it. The frontend stage will pick up the transpiled frontend code.
FROM node AS frontend_build
COPY frontend/ /src/
WORKDIR /src
RUN yarn install
RUN yarn build

# nginx container that runs the frontend, with a slight twist...
FROM nginx:alpine AS frontend
COPY --from=frontend_build /src/build/ /usr/share/nginx/html/
# The env.sh script generates a JavaScript file in realtime consisting of the environment variables starting in REACT_APP_.
# This is a workaround to allow the frontend to access environment variables at runtime.
# The entrypoint.sh script is a simple script that overrides the typical entrypoint for the nginx container, so that the env.sh script runs on startup before nginx runs.
COPY scripts/env.sh scripts/entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]
# Traefik reads the EXPOSE parameter to determine the port to forward. It uses the first instance of an EXPOSE if multiple are present.
EXPOSE 80

# If you build without specifying a target, you get the frontend container simply because it's the last one defined.
# If you wanted an omnibus container that can run everything internally you could add a definition for it here.