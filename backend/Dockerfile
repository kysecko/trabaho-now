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

# Fix Nginx upload temp path
RUN mkdir -p /tmp/nginx_client_body \
    && chmod 777 /tmp/nginx_client_body \
    && echo "client_body_temp_path /tmp/nginx_client_body;" > /etc/nginx/conf.d/client_body_temp.conf

# CORS bypass for OPTIONS preflight requests
RUN echo 'add_header "Access-Control-Allow-Origin" "https://trabaho-now.pages.dev" always; \
add_header "Access-Control-Allow-Methods" "GET, POST, PUT, DELETE, OPTIONS" always; \
add_header "Access-Control-Allow-Headers" "Content-Type, Authorization, X-Requested-With, Accept" always; \
if ($request_method = OPTIONS) { return 204; }' > /etc/nginx/conf.d/cors.conf

# Disable NPM build
ENV NPM_BUILD=false

# Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

EXPOSE 8080
