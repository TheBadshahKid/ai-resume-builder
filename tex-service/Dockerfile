FROM node:18-bullseye-slim

# Install TeX Live full (Warning: Large image size ~5GB)
# For MVP, we use texlive-latex-base and texlive-fonts-recommended
RUN apt-get update && apt-get install -y --no-install-recommends \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5004
CMD ["node", "compiler.js"]
