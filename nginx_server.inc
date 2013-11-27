#chunkin on;
location / {
        proxy_set_header X-Forwarded-For $http_x_forwarded_for;
        proxy_set_header X-Real-IP $http_x_real_ip;
        proxy_set_header Host $host;
        client_max_body_size    100m;
        client_body_buffer_size 1024k;
        proxy_connect_timeout   30;
        proxy_read_timeout 30;
        proxy_pass    http://10379;
        proxy_redirect off;
}