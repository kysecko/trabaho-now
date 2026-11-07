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

# 3. Give ownership of the ENTIRE app folder to www-data
RUN chown -R www-data:www-data /app

# 4. Fix Nginx temporary directories (IMPORTANT for file uploads)
RUN mkdir -p /var/lib/nginx/tmp/client_body \
             /var/lib/nginx/tmp/proxy \
             /var/lib/nginx/tmp/fastcgi \
             /var/lib/nginx/tmp/uwsgi \
             /var/lib/nginx/tmp/scgi \
    && chown -R www-data:www-data /var/lib/nginx/tmp \
    && chmod -R 755 /var/lib/nginx/tmp

# 5. Disable NPM build
ENV NPM_BUILD=false

# 6. Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr# 1. Switch to root to fix all permissions
USER root

# 2. Ensure necessary directories exist and are writable
RUN mkdir -p /app/storage/logs \
    /app/storage/framework/cache \
    /app/storage/framework/sessions \
    /app/storage/framework/views \
    /app/bootstrap/cache \
    /app/resources/views \
    && touch /app/storage/logs/laravel.log

# 3. Give ownership of the ENTIRE app folder to www-data
RUN chown -R www-data:www-data /app

# 4. Fix Nginx temporary directories (IMPORTANT for file uploads)
RUN mkdir -p /var/lib/nginx/tmp/client_body \
             /var/lib/nginx/tmp/proxy \
             /var/lib/nginx/tmp/fastcgi \
             /var/lib/nginx/tmp/uwsgi \
             /var/lib/nginx/tmp/scgi \
    && chown -R www-data:www-data /var/lib/nginx/tmp \
    && chmod -R 755 /var/lib/nginx/tmp

# 5. Disable NPM build
ENV NPM_BUILD=false

# 6. Production environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV LOG_CHANNEL=stderr
