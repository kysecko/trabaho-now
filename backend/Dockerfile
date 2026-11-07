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


FROM ghcr.io/forlaravel/docker:latest-php8.4-fpm

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

# Fix Nginx temporary directories (this fixes the file upload 500 error)
RUN mkdir -p /var/lib/nginx/tmp/client_body \
             /var/lib/nginx/tmp/proxy \
             /var/lib/nginx/tmp/fastcgi \
             /var/lib/nginx/tmp/uwsgi \
             /var/lib/nginx/tmp/scgi \
    && chown -R www-data:www-data /var/lib/nginx/tmp \
    && chmod -R 755 /var/lib/nginx/tmp

# Disable NPM build
ENV NPM_BUILD=false

# Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
