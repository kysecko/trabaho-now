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


# Use a combined Nginx + PHP-FPM image
FROM serversideup/php:8.4-fpm-nginx

WORKDIR /app

COPY --from=vendor /app /app

# Switch to root to fix permissions
USER root

# Create necessary directories
RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    /app/resources/views \
    && touch /app/storage/logs/laravel.log

# Give ownership of the app to www-data
RUN chown -R www-data:www-data /app

# Fix Nginx upload temp path permission issue (fixes file upload 500 error)
RUN mkdir -p /tmp/nginx_client_body \
    && chmod 777 /tmp/nginx_client_body \
    && echo "client_body_temp_path /tmp/nginx_client_body;" > /etc/nginx/conf.d/client_body_temp.conf

# Disable NPM build
ENV NPM_BUILD=false

# Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
