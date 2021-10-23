import pandas as pd
from db.setup import create_connection
import sqlite3

def create_article(con, cur, article):
    sql_check = " SELECT * FROM articles where date_time = ? and title = ? and excerpt = ? and source = ?;"
    cur.execute(sql_check, (article[2], article[0], article[1],article[5]))
    response = cur.fetchone()
    if response is None:
        sql = ''' INSERT INTO articles(title, excerpt, date_time, article_url, risk, source)
                VALUES(?, ?, ?, ?, ?, ?) '''
        # cur = conn.cursor()
        cur.execute(sql, article)
        con.commit()
        print('committed')
        return cur.lastrowid
    else:
        print('avoided')
        return -1
    
def populate(df : pd.DataFrame, database : str = 'db/sqlite.db'):
    con = sqlite3.connect(database)
    cur = con.cursor()
    for i in range(len(df)):  # for each article
        row = df.iloc[i]
        article = (row['title'], row['excerpt'], row['date_time'].date().strftime("%Y-%m-%d"),
                   row['article_url'], row['risk'], row['source'])
        date = row['date_time'].date().strftime("%Y-%m-%d")
        
        article_id = create_article(con, cur, article)

    con.close()
