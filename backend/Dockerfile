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

# 1. Switch to root to create directories and change ownership
USER root

RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    /app/resources/views \
    && touch /app/storage/logs/laravel.log

# 2. Give ownership to the www-data user (the web server user)
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/resources

# 3. Disable the NPM build step to fix the package.json crash
ENV NPM_BUILD=false
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# 4. Switch back to the www-data user for security
USER www-data
