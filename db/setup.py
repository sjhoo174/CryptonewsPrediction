import sqlite3
from sqlite3 import Error
from datetime import datetime

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)


def sql_execute(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def get_today():
    present_date = datetime.today()
    present_date = present_date.strftime("%Y-%m-%d")
    return present_date

if __name__ == '__main__':
    database = "sqlite.db"

    sql_create_latest_date =  f""" CREATE TABLE IF NOT EXISTS latest_date_scraped (
                                        id integer PRIMARY KEY,
                                        source text,
                                        date text
                                    ); """

    sql_insert_latest_date = f"""INSERT INTO latest_date_scraped (source, date) VALUES ('bitcoin_scrape_general','{get_today()}'), 
    ('cointelegraph_scrape_general', '{get_today()}'),
    ('coindesk_scrape_general', '{get_today()}'),
    ('cryptoslate_scrape_general', '{get_today()}'),
    ('cryptonews_scrape_general', '{get_today()}');"""
    print(sql_insert_latest_date)
    
   
    sql_create_sources_table = """ CREATE TABLE IF NOT EXISTS sources (
                                        source_id integer PRIMARY KEY,
                                        name text NOT NULL UNIQUE ,
                                        type integer
                                    ); """

    sql_create_articles_table = """ CREATE TABLE IF NOT EXISTS articles (
                                        article_id integer PRIMARY KEY,
                                        title text NOT NULL,
                                        excerpt text,
                                        date_time text,
                                        article_url text,
                                        risk real,
                                        source text,
                                        FOREIGN KEY (source)
                                            REFERENCES sources (name) 
                                    ); """
                                    
                                    #TODO: Add additional Field isValid boolean NOT NULL
    sql_create_entities_table = """ CREATE TABLE IF NOT EXISTS entities ( 
                                        entity_id integer PRIMARY KEY,
                                        name text NOT NULL
                                    ); """

      
    sql_create_entity_score_table = """ CREATE TABLE IF NOT EXISTS entity_scores (
                                            entity_score_id integer PRIMARY KEY,
                                            entity_score real, 
                                            date_time text, 
                                            entity_id integer, 
                                            FOREIGN KEY (entity_id)
                                                REFERENCES entities (entity_id)
                                        ); """

    sql_create_mapping_table = """ CREATE TABLE IF NOT EXISTS mapping (
                                            mapping_id integer PRIMARY KEY,
                                            entity_id integer, 
                                            article_id integer,
                                            entity_probability real,
                                            FOREIGN KEY (entity_id)
                                                REFERENCES entities (entity_id),
                                            FOREIGN KEY (article_id)
                                                REFERENCES articles (article_id)
                                        ); """

    conn = create_connection("sqlite.db")
    print("connected")
    if conn is not None:
        # create source table
        sql_execute(conn, sql_create_sources_table)

        # create articles table
        sql_execute(conn, sql_create_articles_table)

        # create entities table
        sql_execute(conn, sql_create_entities_table)

        # create entity score table
        sql_execute(conn, sql_create_entity_score_table)

        # create mapping table
        sql_execute(conn, sql_create_mapping_table)

        sql_execute(conn, sql_create_latest_date)

        # updates the date to the latest date
        cur = conn.cursor()
        cur.execute('select * from latest_date_scraped;')
        entry = cur.fetchall()
        
        if (len(entry) == 0):
            sql_execute(conn, sql_insert_latest_date)
        
        conn.commit()
        conn.close()
    else:
        print("Error! cannot create the database connection.")
