# Full Stack Example with Traefik

This is a full stack example of a Web application along with all of the necessary configuration and example Dockerfiles to use it with Traefik.

## To run the demo

The built in config uses `localtest.me` without SSL. If you want SSL, you can look at some of the other example configuration files in the `docker` directory.

To run the demo, first build the containers:

    docker compose build

Then simply start the stack:

    docker compose up -d

Now open a browser and open `http://shopping.localtest.me`.

You can also look at the Traefik dashboard at `http://traefik.localtest.me`.

## To develop

If you want to play with the code, you should make use of the devcontainer. If you're using VS Code, re-open the folder in a dev container - VS Code will prompt you, or otherwise use Shift+Ctrl+P and enter "Dev container" and look for "Reopen in Container".

Once in the container, open multiple terminals:

* In one, just run `fullstack-demo` to start the backend.
* In another, `cd` into `frontend` and then run `yarn start` to open the frontend.

The backend does *not* autorefresh, so you need to break (Ctrl+C) and restart the backend if you change the code. THe frontend *does* autorefresh in many cases, as provided by `create-react-app`, but odd behavior sometimes occurs on auto-refresh - best to simply hard-refresh the webpage. (You don't have to quit and restart `yarn` because the JavaScript files are regenerated automatically; the live reload is not reliable, but live *retranspile* seems to be.)

## Things to check out

* Look at the `compose.yml` file to see how we can use labels to tell Traefik to only route requests matching a certain prefix to the backend, with others going to the frontend. This lets us host the backend and frontend on the same domain.
* Look at the config files in `traefik` to see how Traefik basic config is done.
* Look at the `env.sh` file in `scripts/` to see one method for allowing dynamic config values to be used in static built React applications. (The other parts of this are in `frontend/src/config.tsx`, and also a script tag added to `frontend/public/index.html` to load the dynamic JavaScript file.)
* Look at the Dockerfile and the `compose.yml` file to see how we can include both build stages (frontend and backend) in a single Dockerfile, and then use the compose file to build and assign stages to different services.

## License

This code is licensed under [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en).
