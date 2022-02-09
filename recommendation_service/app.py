import pandas as pd
import numpy as np
import pymongo
import itertools
import csv
import json
import os
from bson import json_util
from flask import Flask,request, url_for, redirect, render_template,jsonify,Response
from flask_cors import CORS, cross_origin
from elasticsearch import Elasticsearch

mongo_client = pymongo.MongoClient(os.environ.get("MONGOURL"))
mydb = mongo_client["flick"]
es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200}])
app=Flask(__name__)
cors = CORS(app)


@app.route('/')
@cross_origin()
def hello_world():
    return 'Hello World!'    
    
@app.route('/movies')
@cross_origin()
def get_movies():
    body = {
        "query": {
            "match_all": {}
        }
    }

    res = es.search(index="flick", doc_type="movies", body=body)

    return jsonify(res['hits']['hits'])

@app.route('/initialize')
@cross_origin()
def initialize():  
    mongo_client.drop_database("flick")
    mydb = mongo_client["flick"]      
    mycol = mydb["genres_datas"]
    # mycol.drop()
    genres_df=pd.read_csv('genres.csv')
    genre_json=genres_df.to_json(orient='records')
    genre_json=eval(genre_json)
    genre_data=genre_json
    x = mycol.insert_many(genre_data)
    print("Genres data synchronized "+str(mycol.count()))

    mycol=mydb["movies_datas"]
    # mycol.drop()
    csvfile = open('movies.csv', 'r',encoding='utf-8')
    reader = csv.DictReader( csvfile )
    header=["movieId","imdb_link","poster","title","imdb_score","genres"]
    es.indices.delete(index='flick', ignore=[400, 404])
    es.indices.create(index='flick')    
    for each in reader:
        mongodb_row = {}
        es_row = {}
        for field in header:
            if (field == "genres"):
                es_row[field] = each[field].split("|")
                mongodb_row[field] = each[field].split("|")
            elif (field == "imdb_score"):
                es_row[field] = round(float(each[field]),2)
                mongodb_row[field] = round(float(each[field]),2)
            else:
                es_row[field] = each[field]           
                mongodb_row[field] = each[field]       
                     
        print("Inserting a movie"+str(mycol.count()))            
        mongodb_row  = mycol.insert_one(mongodb_row)               
        es.index(index='flick', doc_type='movies', id=mongodb_row.inserted_id, document=es_row)
    print("movies data synchronized "+str(mycol.count()))    
    return "Initialized"

@app.route('/newReview/<uid>')
@cross_origin()
def newReview(uid):
    print("Entered")
    mycol = mydb["reviews"]
    print(uid)
    #record={ "uid": uid, "movieId": movieId,"rating":rating }
    #mycol.insert_one(record)
    #generating userInput table
    userInput=[]
    for x in mycol.find({"userId":uid},{ "_id": 0}):
      userInput.append(x)
    userInput=pd.DataFrame(userInput)
    userInput=userInput.drop(['userId','comment'], axis = 1) 
    #fetching genres data from database
    mycol = mydb["genres_datas"]
    data=[]
    for x in mycol.find({},{"_id":0}):
        data.append(x)
    genres_df=pd.DataFrame(data)
    #generating userProfile
    userGenre=genres_df[genres_df['movieId'].isin(userInput['movieId'].tolist())]
    userGenre.drop('movieId',1,inplace=True)
    userGenre.reset_index(drop=True)
    userProfile = userGenre.transpose().dot(userInput.rating.values)
    #getting new recommendations
    genreTable=genres_df.copy()
    genreTable.set_index('movieId',inplace=True)
    recommend_df=((genreTable*userProfile).sum(axis=1))/(userProfile.sum())
    recommend_df.sort_values(ascending=False,inplace=True)
    mycol = mydb["user_recommendation_datas"]
    recommendation_json=eval(recommend_df.to_json())
    recommendation_data={"uid":uid,"recommendation_data":recommendation_json}
    mycol.delete_one({"uid":uid})
    x = mycol.insert_one(recommendation_data)
    print("Review added")
    return jsonify("Review added")

@app.route('/recommendation/<uid>')
@cross_origin()
def recommendation(uid):
    #uid=int(uid)
    print(uid)
    mycol = mydb["user_recommendation_datas"]
    x=mycol.find_one({"uid":uid},{"_id":0})
    data=x['recommendation_data']
    # recommend_df=pd.Series(data)
    # recommend_df.head()
    data=dict(itertools.islice(data.items(),10))
    movies_id=list(data.keys())

    mycol=mydb['movies_datas']
    movies_data=[]
    for i in mycol.find({}):
        if(str(i["movieId"]) in movies_id):
            movies_data.append(i)
    print("Returened data")
    #return json_response(movies_data)
    
    return Response(
        json_util.dumps(movies_data),
        mimetype='application/json'
    )
    


def json_response(payload, status=200):
    return (json.dumps(payload), status, {'content-type': 'application/json'})
if __name__=='__main__':
    #app.run()
    app.run(host="0.0.0.0", debug=True, port = 5001)
