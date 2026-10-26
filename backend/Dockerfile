
FROM ghcr.io/forlaravel/docker:latest-php8.4-fpm

WORKDIR /app

COPY --from=vendor /app /app

USER root

RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    && touch /app/storage/logs/laravel.log \
    && chown -R 1000:1000 /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
