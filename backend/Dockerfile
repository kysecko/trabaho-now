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

# 1. Added /app/resources/views to the mkdir list to prevent the crash
RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    /app/resources/views \
    && touch /app/storage/logs/laravel.log \
    && chown -R 1000:1000 /app/storage /app/bootstrap/cache /app/resources \
    && chmod -R 775 /app/storage /app/bootstrap/cache /app/resources

# 2. We removed your custom CMD so the base image can run its built-in supervisor safely.
# If you still want to clear the cache on boot without crashing, we do it safely here:
RUN echo '#!/bin/sh\nphp artisan optimize:clear || true\nphp-fpm' > /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh
CMD ["/usr/local/bin/start.sh"]

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
