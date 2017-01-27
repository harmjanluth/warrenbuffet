import cherrypy
import subprocess
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json
from collections import defaultdict

analyzer = SentimentIntensityAnalyzer()

class HelloWorld(object):
    def index(self, input=None):
        vs = analyzer.polarity_scores(input)
        p = subprocess.Popen(["./syntaxnet/demo.sh | awk '{print $2 \" \" $8}'"], stdin=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
        syntaxnet = p.communicate(input=input)[0]
        res = defaultdict(list)
        cherrypy.response.headers['Content-Type']= 'application/json'
        for line in syntaxnet.splitlines():
            item = line.split(" ")
            if len(item) == 2:
                res[item[1]].append(item[0])
        vs['syntax'] = res
        return json.dumps(vs)
    index.exposed = True

cherrypy.config.update({'server.socket_host': '0.0.0.0'} )
cherrypy.quickstart(HelloWorld())
