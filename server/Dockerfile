# Use the official Node.js image as the base image
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./


# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your server is running on

ENV PORT=8000
ENV MONGODB_URI=mongodb+srv://Rohit:Rohit2580@cluster0.u3efc4t.mongodb.net
ENV CORS_ORIGIN=https://main--fomofeed.netlify.app
ENV ACCESS_TOKEN_SECRET_KEY=dsjfhajkewuiyuiewrhj32ho78ejrkhw87298edkhkhs7wo3jkh2890hjk3h728yuha7wo3jlh832jk 
ENV ACCESS_TOKEN_EXPIRY=1d 
ENV REFRESH_TOKEN_SECRET_KEY=sjahjkahjbnwmbeywjkrwhjgkrywkernmbaya3782634873jkhkjhsdjkfhsdkhjksh 
ENV REFRESH_TOKEN_EXPIRY=10d 
ENV CLOUDINARY_CLOUD_NAME=dnyboplz0
ENV CLOUDINARY_API_KEY=953974564634149
ENV CLOUDINARY_API_SECRET=yg5BzdQrma75f6tRVv8v_3s85CU

# There should be no space between the = and the value
# Command to run the server
EXPOSE 8000
# CMD ["node", "-r", "dotenv/config", "--experimental-json-modules", "src/index.js"]
CMD ["npm","run","dev"]
