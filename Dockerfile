FROM nginx:alpine
LABEL description="My Custom Nginx Web Server"
COPY src/ /usr/share/nginx/html/
EXPOSE 80
