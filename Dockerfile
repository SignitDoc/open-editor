FROM nginx:1.25.5
#进入nginx目录
WORKDIR /usr/share/nginx
#删除原有html文件夹
RUN rm -rf html
#将dist拷贝到nginx静态资源目录下
ADD dist html
#暴露80端口
EXPOSE 80