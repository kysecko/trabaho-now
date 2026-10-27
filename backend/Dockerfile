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

USER root

# 1. Create necessary directories and set permissions
RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    && touch /app/storage/logs/laravel.log \
    && chown -R 1000:1000 /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# 2. Force Laravel to clear config cache during the build
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
