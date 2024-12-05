FROM node:20-slim

WORKDIR /app

# Install build essentials needed for bcrypt
# We use apt-get since we're using the slim Debian-based image
# The steps are:
# 1. Update package list
# 2. Install build tools
# 3. Clean up to keep image size down
RUN apt-get update \
    && apt-get install -y python3 make g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose both ports
EXPOSE 3000
EXPOSE 5173

# Start the app with host set to 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]