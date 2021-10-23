from flask import Flask, send_from_directory, render_template, abort
from flask import request

from prediction.predict import predictor
from scraping.scrape import get_today

from datetime import datetime
from datetime import timedelta
import sqlite3

import yaml
app = Flask(__name__, static_folder='/usr/src/app/api/chartserve/build/static', template_folder="/usr/src/app/api/chartserve/build/")



@app.route("/risk_sentiment", methods = ['GET'])
def get_risk_score():
    text = request.args.getlist('text[]')
    if text is not None:
        try:
            score = predictor.predict(text)["risk"]
            return {"risk_score": score}
        except:
            return {"ERROR" : "Invalid input!"}
    else: 
        return {"ERROR" : "Invalid input!"}


@app.route("/ner", methods = ['GET'])
def get_ner():
    text = request.args.getlist('text[]')
    if text:
        try:
            ner = predictor.predict(text)["ner"]
            return {"ner_output": ner}
        except:
            return {"ERROR" : "Invalid input!"}

    else: 
        return {"ERROR" : "Invalid input!"}

# @app.route("/days", methods = ['GET'])
# def get_by_days():
#     days = request.args.get('number')
#     if days:
#         end_date = datetime.today()
#         querytype = "range"
#         start_date = end_date - timedelta(int(days))
#         start_date = start_date.strftime("%Y-%m-%d")
#         end_date = end_date.strftime("%Y-%m-%d")

#         if int(days) < 30:
            
#             config = yaml.load(open('./cfg.yaml'), Loader=yaml.Loader)["db"]
#             database_path = config.get("database_path", "")
#             con = sqlite3.connect(database_path)
#             cur = con.cursor()

#             query = f"""SELECT * FROM articles WHERE date_time >= '{start_date}' and date_time <= '{end_date}';"""
#             print(query)
#             cur.execute(query)
#             response = cur.fetchall()
#             print(response)

#             return {"data": response, "type": querytype}
#         else: 
#             return {"ERROR" : "Days cannot exceed 30!"}
#     else:
#         return {"ERROR" : "Invalid input!"}

# @app.route("/date", methods = ['GET'])
# def get_by_date():
#     start_date = request.args.get('start')
#     end_date = request.args.get('end')
#     config = yaml.load(open('./cfg.yaml'), Loader=yaml.Loader)["db"]
#     database_path = config.get("database_path", "")
#     con = sqlite3.connect(database_path)
#     cur = con.cursor()
    
#     if (start_date != end_date):
#         querytype = "range"
#         query = f"""SELECT * from articles WHERE date_time >= {start_date} and date_time <= {end_date};"""
#         cur.execute(query)
#         response = cur.fetchall()
#         con.close()
        
#         return {"data": response, "type": querytype}
#     elif (start_date== end_date):
#         querytype = "specific"
#         query = f"""SELECT * from articles WHERE date_time == '{start_date}';"""
#         cur.execute(query)
#         response = cur.fetchall()
#         con.close()
#         return {"data" : response, "type" :querytype}
#     else:
#         return {"ERROR" : "Invalid input!"}

@app.route("/getScore", methods =['GET'])
def get_score():
    start = request.args.get('start')
    end = request.args.get('end')
    sources = request.args.getlist('source[]')

    try:
        # start_date = end_date - timedelta(30)
        # start_date = start_date.strftime("%Y-%m-%d")
        # end_date = end_date.strftime("%Y-%m-%d")
        config = yaml.load(open('./cfg.yaml'), Loader=yaml.Loader)["db"]
        database_path = config.get("database_path", "")
        con = sqlite3.connect(database_path)
        cur = con.cursor()

        if (sources[0] == 'all'):
            sources = ['bitcoin', 'cointelegraph', 'coindesk', 'cryptonews', 'cryptoslate']

        # if (len(entities) > 1):
        #     cur.execute(f"""SELECT * FROM entities WHERE name IN {tuple(entities)};""")
        #     pre_selection = cur.fetchall()
        # elif (len(entities) == 1):
        #     cur.execute(f"""SELECT * FROM entities WHERE name = '{tuple(entities)[0]}';""")
        #     pre_selection = cur.fetchall()
        # else:
        #     return {"data" : []}

        # print(pre_selection)
        # if (len(pre_selection) > 1):
        #     cur.execute(f"""SELECT article_id FROM mapping where entity_id IN {tuple(pre_selection)}""")
        #     article_id_list = cur.fetchall()
        # elif (len(pre_selection) == 1):
        #     cur.execute(f"""SELECT article_id FROM mapping where entity_id = '{tuple(pre_selection)[0]}';""")
        #     article_id_list = cur.fetchall()
        # else:
        #     return {"data" : []}

        if (len(sources) > 1):
            # try:
            query = f"""SELECT * FROM articles WHERE date_time >= '{start}' and date_time <= '{end}' and source IN {tuple(sources)};"""
            # except:
            #     return {"data" : []}
        elif len(sources) == 1:
            # try:
            query = f"""SELECT * FROM articles WHERE date_time >= '{start}' and date_time <= '{end}' and source = '{sources[0]}';"""
            # except:
            #     return {"data" : []}

        else:
            return {"data" : []}

        # try:
        cur.execute(query)
        response = cur.fetchall()
        # except:
        #     return {"data" : []}

        map = {}
        end_date= datetime.strptime(end, "%Y-%m-%d").date()
        start_date = datetime.strptime(start, "%Y-%m-%d").date()
        days_range = (end_date - start_date).days

        for i in response:
            date = i[3]
            date = datetime.strptime(date, "%Y-%m-%d").date()
            delta = end_date - date
            days = delta.days
        
            source = i[-1]
            risk = i[-2]
        
            if (source in map):
                no_of_articles = map[source][days][1]
            
                map[source][days][0] = (map[source][days][0] * no_of_articles + risk ) / (no_of_articles + 1) 
                map[source][days][1] = no_of_articles+1
            else:
                days_dict = {}
                for i in range(days_range+1):
                    days_dict[i] = [0,0]
                map[source] = days_dict
            
                map[source][days][0] = risk
                map[source][days][1] = 1
        responseList = []
        
        for key,value in map.items():
            li = []
            for i in range(days_range+1):
                li.append(map[key][i])
            responseList.append([key,li])
        
        return {"data": responseList}
    except:
        return {"data" : []}


@app.route("/topArticles", methods =['GET'])
def get_articles():
    start = request.args.get('start')
    end = request.args.get('end')
    limit = request.args.get('limit')
    entities = request.args.getlist('entity[]')
    sources = request.args.getlist('source[]')


    try:
        config = yaml.load(open('./cfg.yaml'), Loader=yaml.Loader)["db"]
        database_path = config.get("database_path", "")
        con = sqlite3.connect(database_path)
        cur = con.cursor()

        if (sources[0] == 'all'):
            sources = ['bitcoin', 'cointelegraph', 'coindesk', 'cryptonews', 'cryptoslate']
        
        # if (len(entities) > 1):
        #     cur.execute(f"""SELECT * FROM entities WHERE name IN {tuple(entities)};""")
        #     pre_selection = cur.fetchall()
        # elif (len(entities) == 1):
        #     print(f"""SELECT * FROM entities WHERE name = '{tuple(entities)[0]}';""")

        #     cur.execute(f"""SELECT * FROM entities WHERE name = '{tuple(entities)[0]}';""")
        #     pre_selection = cur.fetchall()
        # else:
        #     return {"data" : []}

        # print(pre_selection)
        # if (len(pre_selection) > 1):
        #     cur.execute(f"""SELECT article_id FROM mapping where entity_id IN {tuple(pre_selection)}""")
        #     article_id_list = cur.fetchall()
        # elif (len(pre_selection) == 1):
        #     cur.execute(f"""SELECT article_id FROM mapping where entity_id = '{tuple(pre_selection)[0]}';""")
        #     article_id_list = cur.fetchall()
        # else:
        #     return {"data" : []}
        if (len(entities) > 1):
            start_text = "(excerpt LIKE"
            temp = ["'%" + i + "%'" for i in entities]
            entities = start_text + " OR excerpt LIKE ".join(temp)
            entities = entities + ")"
            print(entities)
        elif(len(entities) == 1):
            if entities[0] == 'all':
                print('all')
                entities = "1"
            elif entities[0] == '':
                entities = "0"
            else :
                entities = "(excerpt LIKE '%" + entities[0] + "%')"
        else:
            return {"data" : [], "limit" :limit}

            
        if len(sources) > 1:
            # try:
            query = f"SELECT * \
                        FROM \
                        (SELECT *, rank() over (PARTITION BY source ORDER BY risk DESC) AS rank \
                        FROM \
                        (SELECT * \
                        FROM articles \
                        WHERE date_time >= '{start}' \
                        AND date_time <= '{end}' \
                        AND source \
                        IN {tuple(sources)} \
                        AND {entities})) \
                        WHERE rank < {int(limit)} \
                        ORDER BY source;"
            # except:
            #     return {"data" : [], "limit" :limit}

            print(query)
        elif len(sources) == 1:
            # try:
            query = f"SELECT * from articles WHERE date_time >= '{start}' and date_time <= '{end}' and source = '{sources[0]}' AND {entities} ORDER BY risk DESC LIMIT {int(limit)};"
            # except:
            #     return {"data" : [], "limit" :limit}

            print(query)
        else:
            return {"data" : [], "limit" :limit}

        # try:
        cur.execute(query)
        response = cur.fetchall()
        con.close()
        # except:
        #     return {"data" : [], "limit" :limit}

        if len(response) == 0:
            return {"data" : [], "limit" : limit}

        # Traverse through 1 to len(arr)
        for i in range(len(response)):
    
            # key = response[i][-4]
    
            # # Move elements of arr[0..i-1], that are
            # # greater than key, to one position ahead
            # # of their current position
            # j = i-1
            # while j >= 0 and key < response[j][-4] :
            #     response[j + 1] = response[j]
            #     j -= 1
            # response[j + 1] = response[i]

            response[i] = response[i][:-1]

        # li = []
        # for i in range(len(response)):
        #     li.append(response.pop())
   
        return {"data" : response, "limit" :limit}
    except:
        return {"data" : [], "limit" :limit}

@app.route("/doc", methods=["GET"])
def get_Doc():
    
    print(app.static_folder)
    return render_template('index.html')


# @app.route("/listEntities", methods=["GET"])
# def get_Entities():
#     start = request.args.get('start')
#     end = request.args.get('end')
#     sources = request.args.getlist('source[]')
#     config = yaml.load(open('./cfg.yaml'), Loader=yaml.Loader)["db"]
#     database_path = config.get("database_path", "")
#     con = sqlite3.connect(database_path)
#     cur = con.cursor()

#     if (sources[0] == 'all'):
#         sources = ['bitcoin', 'cointelegraph', 'coindesk', 'cryptonews', 'cryptoslate']

#     if len(sources) > 1:
#         query = f"SELECT name \
#                     FROM entities \
#                     WHERE entity_id \
#                     IN (SELECT entity_id \
#                     FROM entity_scores \
#                     WHERE date_time >= '{start}' and date_time <= '{end}' AND source IN {tuple(sources)};"
#         print(query)
#     elif len(sources) == 1:
#         query = f"SELECT article_id from articles WHERE date_time >= '{start}' and date_time <= '{end}' and source = '{sources[0]}';"
#     else:
#         return {"entities" : []}

    
#     try:
#         cur.execute(query)
#         response = cur.fetchall()
#         print(response)
#     except:
#         print('here')
#         return {"entities" : []}

#     response = [i[0] for i in response]

#     second_query = f"SELECT name FROM entities where entity_id IN (SELECT entity_id FROM mapping WHERE article_id IN {tuple(response)});"
#     cur.execute(second_query)
#     response = cur.fetchall()
#     con.close()

#     return {"entities" : response}

