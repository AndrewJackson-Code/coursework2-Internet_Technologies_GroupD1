FROM node:20-slim

WORKDIR /app

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