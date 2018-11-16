FROM nginx:1.15

WORKDIR /usr/share/nginx/html
RUN rm index.html
ADD src/ /usr/share/nginx/html/