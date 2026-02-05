FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY playwright.config.ts ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Set environment variables
ENV ENV=prod
ENV HEADLESS=true
ENV BASE_URL=https://superbet.ro

# Run tests
CMD ["npm", "run", "test"]
