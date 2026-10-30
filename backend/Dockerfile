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

# Create necessary directories for views and cache
RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    /app/resources/views

# Disable NPM build step (API only)
ENV NPM_BUILD=false

# Set correct permissions for www-data user
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache /app/resources

# Use the default start script from the base image (it handles everything correctly)
# No need for custom start.sh
