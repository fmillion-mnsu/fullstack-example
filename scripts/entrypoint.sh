#!/bin/sh

apk add bash
/env.sh
exec nginx -g "daemon off;"
