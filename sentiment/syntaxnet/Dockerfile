FROM brianlow/syntaxnet

MAINTAINER skoppe@xebia.com

RUN pip install cherrypy
RUN pip install vadersentiment

COPY ./demo.sh /root/models/syntaxnet/syntaxnet/demo.sh
COPY ./server.py /root/models/syntaxnet/server.py

RUN chmod +x /root/models/syntaxnet/syntaxnet/demo.sh

EXPOSE 8080

CMD ["python","server.py"]