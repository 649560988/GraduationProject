FROM registry.cn-hangzhou.aliyuncs.com/choerodon-tools/frontbase:0.5.0

ENV PRO_SERVER gateway.choerodon.com.cn
ENV PRO_CLIENT_ID choerodon
ENV PRO_TITLE_NAME Choerodon

RUN echo "Asia/shanghai" > /etc/timezone;
ADD dist /usr/share/nginx/html
ADD structure /usr/share/nginx/html/structure
RUN chmod 777 /usr/share/nginx/html/structure/enterpoint.sh
ENTRYPOINT ["/usr/share/nginx/html/structure/enterpoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
