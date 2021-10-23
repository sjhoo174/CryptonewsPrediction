from prediction.predict import predictor

import pandas as pd
import json
from tqdm import tqdm
import argparse

from scraping.scrape import news_scrape_general

from db.getEntities import toDatabase as toEntitiesTable
from db.getEntityScores import toDatabase as toEntityScoresTable
from db.articles import populate

from datetime import datetime
from datetime import timedelta
import sqlite3
import yaml
import os

# from scraping.scripts.bitnewstoday import bitnewstoday_scrape_general
from scraping.scripts.bitcoin import bitcoin_scrape_general
from scraping.scripts.coindesk import coindesk_scrape_general
from scraping.scripts.cointelegraph import cointelegraph_scrape_general
from scraping.scripts.cryptonews import cryptonews_scrape_general
from scraping.scripts.cryptoslate import cryptoslate_scrape_general

config = yaml.load(open('./cfg.yaml'), Loader=yaml.Loader)["db"]
database_path = config.get("database_path", "")

def preprocess_df(df:pd.DataFrame)->pd.DataFrame:
    df.dropna(subset = ["title"],inplace = True)
    df["excerpt"].fillna("",inplace = True)
    df["text"]  = df["title"] + " " + df["excerpt"]
    return df

def get_dates(source):

    end_date = datetime.today()
    end_date = end_date.strftime("%Y-%m-%d")   

    
    con = sqlite3.connect(database_path)
    cur = con.cursor()
    cur.execute(f"SELECT * FROM latest_date_scraped WHERE source='{source}'")
    entry = cur.fetchall()
    start_date = entry[0][2]
    con.close()

    # start_date = "2021-07-06"
    # end_date = "2021-07-07"
    start_datetime = datetime.strptime(start_date,"%Y-%m-%d")
    end_datetime = datetime.strptime(end_date,"%Y-%m-%d")

    print(end_datetime)
    print(start_datetime)

   
    
    return start_datetime, end_datetime

def scrape_by_source(source):
    return eval(source)

def main(source, start_date, end_date):
    

    df = scrape_by_source(source)(start_date,end_date)
    df = preprocess_df(df)
    docs = df["text"].tolist()
    if len(docs) != 0:

        output = predictor.predict(docs)
        df["risk"] = output["risk"]
        
        df["ner_output"] = output["ner"]
        # ? Might want to save this df somewhere to retrain  
        #TODO: Call Article Function
        no_ent_df = df[df["ner_output"].apply(len)==0]
        
        
        df = df[df["ner_output"].apply(len)>0] 
        
        df = df.explode("ner_output")
        df["entity_name"] = df["ner_output"].apply(lambda x:x["name"])
        df["entity_score"] = df["ner_output"].apply(lambda x:x["confidence"])
        print(df.head(5))
        

        toEntitiesTable(df) #Upload df to entites table
        toEntityScoresTable(df) # Upload df to entity_scores table 
        populate(df)

        
    else:
        print('here')


if __name__ == "__main__":
    parser  = argparse.ArgumentParser(description='Script to Scrape Individual News Sources')
    parser.add_argument("source",type=str,help="News Source to Scrape From",
                        nargs="?")
    
    args = parser.parse_args()
    start_date, end_date = get_dates(args.source)
    main(args.source, start_date, end_date)

    

    
