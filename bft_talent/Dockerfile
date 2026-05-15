# ─── Stage 1: Node build ───────────────────────────
FROM node:22-alpine AS node-build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

COPY resources/ resources/
COPY vite.config.ts tsconfig.json tailwind.config.* ./
COPY public/ public/

RUN npm run build

# ─── Stage 2: PHP production ───────────────────────
FROM php:8.5-fpm-alpine AS php-prod

# System deps
RUN apk add --no-cache \
    bash \
    curl \
    git \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libzip-dev \
    libxml2-dev \
    icu-dev \
    oniguruma-dev \
    supervisor \
    nginx \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        bcmath \
        ctype \
        curl \
        gd \
        intl \
        mbstring \
        opcache \
        pdo \
        pdo_mysql \
        xml \
        zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first (cache layer)
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-autoloader \
    --no-scripts \
    --prefer-dist

# Copy application
COPY . .

# Copy built frontend assets
COPY --from=node-build /app/public/build public/build/

# Finish composer setup
RUN composer dump-autoload --optimize --no-dev \
    && composer run-script post-autoload-dump --no-interaction || true

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 storage bootstrap/cache

# PHP opcache config
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# nginx config
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# supervisor config (nginx + php-fpm + queue worker)
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
