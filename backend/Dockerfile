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

# 1. Switch to root to fix all permissions
USER root

# 2. Ensure necessary directories exist and are writable
RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    /app/resources/views \
    && touch /app/storage/logs/laravel.log

# 3. THE FIX: Give ownership of the ENTIRE app folder to www-data
RUN chown -R www-data:www-data /app

# 4. Disable NPM build to fix the package.json error
ENV NPM_BUILD=false

# 5. Set production environment variables
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# 6. Do NOT switch to www-data manually. 
# The entrypoint script of the base image handles user switching.
# By leaving this as root, the entrypoint will correctly drop privileges 
# and ensure the Nginx/SSL setup works without permission errors.
