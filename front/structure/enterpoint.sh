#!/bin/bash
set -e

find /usr/share/nginx/html -name '*.js' | xargs sed -i "s#===localhost.clientId===#$PRO_CLIENT_ID#g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s#===localhost.server===#$PRO_SERVER#g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s#===localhost.titlename===#$PRO_TITLE_NAME#g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s#===localhost.companyname===#$PRO_COMPANY_NAME#g"

exec "$@"


