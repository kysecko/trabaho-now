FROM composer:2 AS vendor

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --no-scripts

COPY . .

RUN composer dump-autoload --no-dev --optimize


FROM serversideup/php:8.4-fpm-nginx

WORKDIR /var/www/html

COPY --from=vendor /app /var/www/html

USER root

# Create necessary directories
RUN mkdir -p /var/www/html/storage/logs \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/bootstrap/cache \
    /var/www/html/resources/views \
    && touch /var/www/html/storage/logs/laravel.log

RUN chown -R www-data:www-data /var/www/html

# 1. Fix Nginx upload temp path
RUN mkdir -p /tmp/nginx_client_body \
    && chmod 777 /tmp/nginx_client_body \
    && echo "client_body_temp_path /tmp/nginx_client_body;" > /etc/nginx/conf.d/client_body_temp.conf

# 2. CORS Bypass (Safe in conf.d because it only uses add_header and if)
# Note: We use $http_origin to dynamically match the request origin.
RUN echo 'add_header "Access-Control-Allow-Origin" "$http_origin" always; \
add_header "Access-Control-Allow-Methods" "GET, POST, PUT, DELETE, OPTIONS" always; \
add_header "Access-Control-Allow-Headers" "Content-Type, Authorization, X-Requested-With, Accept" always; \
if ($request_method = OPTIONS) { return 204; }' > /etc/nginx/conf.d/cors.conf

# 3. WebSocket Proxy (MUST be in server-opts.d, NOT conf.d)
# This tells Nginx to forward /app requests to Reverb on port 8081
RUN mkdir -p /etc/nginx/server-opts.d && printf '%s\n' \
  'location /app {' \
  '    proxy_pass http://127.0.0.1:8081;' \
  '    proxy_http_version 1.1;' \
  '    proxy_set_header Upgrade $http_upgrade;' \
  '    proxy_set_header Connection "Upgrade";' \
  '    proxy_set_header Host $host;' \
  '}' > /etc/nginx/server-opts.d/reverb.conf

# 4. Start Reverb via S6 Overlay
RUN mkdir -p /etc/s6-overlay/s6-rc.d/reverb && \
    echo "longrun" > /etc/s6-overlay/s6-rc.d/reverb/type && \
    echo "#!/command/with-contenv sh" > /etc/s6-overlay/s6-rc.d/reverb/run && \
    echo "exec php /var/www/html/artisan reverb:start --host=0.0.0.0 --port=8081" >> /etc/s6-overlay/s6-rc.d/reverb/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/reverb/run && \
    mkdir -p /etc/s6-overlay/s6-rc.d/user/contents.d && \
    touch /etc/s6-overlay/s6-rc.d/user/contents.d/reverb

# Disable NPM build
ENV NPM_BUILD=false

# Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

EXPOSE 8080
