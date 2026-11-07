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

# The default webroot for this image is /var/www/html
WORKDIR /var/www/html

# Copy the application from the vendor stage into the correct webroot
COPY --from=vendor /app /var/www/html

# Switch to root to fix permissions
USER root

# Create necessary directories
RUN mkdir -p /var/www/html/storage/logs \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/bootstrap/cache \
    /var/www/html/resources/views \
    && touch /var/www/html/storage/logs/laravel.log

# Give ownership of the app to www-data
RUN chown -R www-data:www-data /var/www/html

# Fix Nginx upload temp path permission issue (fixes file upload 500 error)
RUN mkdir -p /tmp/nginx_client_body \
    && chmod 777 /tmp/nginx_client_body \
    && echo "client_body_temp_path /tmp/nginx_client_body;" > /etc/nginx/conf.d/client_body_temp.conf

# Create the Reverb service directory
RUN mkdir -p /etc/s6-overlay/s6-rc.d/reverb

# Service type
RUN echo "longrun" > /etc/s6-overlay/s6-rc.d/reverb/type

# The actual command to start Reverb
RUN echo "#!/command/with-contenv sh" > /etc/s6-overlay/s6-rc.d/reverb/run && \
    echo "exec php /var/www/html/artisan reverb:start --host=0.0.0.0 --port=8080" >> /etc/s6-overlay/s6-rc.d/reverb/run && \
    chmod +x /etc/s6-overlay/s6-rc.d/reverb/run

# Add reverb to the user bundle so it starts automatically
RUN mkdir -p /etc/s6-overlay/s6-rc.d/user/contents.d && \
    touch /etc/s6-overlay/s6-rc.d/user/contents.d/reverb

# Disable NPM build
ENV NPM_BUILD=false

# Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr

# Expose both ports: HTTP (Nginx) and WebSocket (Reverb)
EXPOSE 8080
EXPOSE 80
