from datetime import timedelta
from textwrap import dedent

# The DAG object; we'll need this to instantiate a DAG
from airflow import DAG

# Operators; we need this to operate!
from airflow.operators.bash import BashOperator
from airflow.operators.python import PythonOperator
from airflow.utils.dates import days_ago

from datetime import datetime 
import sqlite3
import os
# These args will get passed on to each operator
# You can override them on a per-task basis during operator initialization

airflow_home = os.getenv('AIRFLOW_HOME')
work_dir = airflow_home[:airflow_home.find('/airflow')]

bitcoin_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py bitcoin_scrape_general"
bitnewstoday_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py bitnewstoday_scrape_general"
coindesk_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py coindesk_scrape_general"
cointelegraph_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py cointelegraph_scrape_general"
cryptonews_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py cryptonews_scrape_general"
cryptoslate_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py cryptoslate_scrape_general"
google_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py google_scrape_general"
insidebitcoins_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py insidebitcoins_scrape_general"
nulltx_scrape_general = f"cd {work_dir} && sudo python3 dailyscrape.py nulltx_scrape_general"


def update_db(source):
    end_date = datetime.today()
    end_date= end_date - timedelta(1)
    end_date = end_date.strftime("%Y-%m-%d") 

    database_path = f'{work_dir}/db/sqlite.db'
    print(database_path)
    sql_update_latest_date = f"""UPDATE latest_date_scraped SET date='{end_date}' WHERE source='{source}';"""
    print(sql_update_latest_date)
    con = sqlite3.connect(database_path)
    cur = con.cursor()
    cur.execute(sql_update_latest_date)
    con.commit()

    con.close()



default_args = {
    # 'owner': 'dfdf@example.com',
    'depends_on_past': False,
    'email': ['dfdf@example.com'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=3),
}

dag = DAG (
    dag_id='Daily_News_Prediction',
    default_args=default_args,
    description='Daily scraping',
    schedule_interval='30 14 * * *' ,
    start_date=days_ago(2),
) 
    
# t1, t2 and t3 are examples of tasks created by instantiating operators
bitcoin_task = BashOperator(
    task_id='bitcoin_scrape_general',
    bash_command=bitcoin_scrape_general,
    dag = dag
)

update_bitcoin = PythonOperator(
    task_id='update_bitcoin_db',
    python_callable=update_db,
    op_kwargs={'source':'bitcoin_scrape_general'}
)

# bitnewstoday_task = BashOperator(
#     task_id='bitnewstoday_scrape_general',
#     bash_command=bitnewstoday_scrape_general,
#     dag = dag
# )

coindesk_task = BashOperator(
    task_id='coindesk_scrape_general',
    bash_command=coindesk_scrape_general,
    dag = dag
)

update_coindesk = PythonOperator(
    task_id='update_coindesk_db',
    python_callable=update_db,
    op_kwargs={'source':'coindesk_scrape_general'}

)

cointelegraph_task = BashOperator(
    task_id='cointelegraph_scrape_general',
    bash_command=cointelegraph_scrape_general,
    dag = dag
)

update_cointelegraph = PythonOperator(
    task_id='update_cointelegraph_db',
    python_callable=update_db,
    op_kwargs={'source':'cointelegraph_scrape_general'}

)

cryptonews_task = BashOperator(
    task_id='cryptonews_scrape_general',
    bash_command=cryptonews_scrape_general,
    dag = dag
)

update_cryptonews = PythonOperator(
    task_id='update_cryptonews_db',
    python_callable=update_db,
    op_kwargs={'source':'cryptonews_scrape_general'}

)

cryptoslate_task = BashOperator(
    task_id='cryptoslate_scrape_general',
    bash_command=cryptoslate_scrape_general,
    dag = dag
)

update_cryptoslate = PythonOperator(
    task_id='update_cryptoslate_db',
    python_callable=update_db,
    op_kwargs={'source':'cryptoslate_scrape_general'}

)

bitcoin_task >> update_bitcoin
coindesk_task >> update_coindesk
cointelegraph_task >> update_cointelegraph
cryptonews_task >> update_cryptonews
cryptoslate_task >> update_cryptoslate

# google_task = BashOperator(
#     task_id='google_scrape_general',
#     bash_command=google_scrape_general,
#     dag = dag
# )

# insidebitcoins_task = BashOperator(
#     task_id='insidebitcoins_scrape_general',
#     bash_command=insidebitcoins_scrape_general,
#     dag = dag
# )

# nulltx_task  = BashOperator(
#     task_id='nulltx_scrape_general',
#     bash_command=nulltx_scrape_general,
#     dag = dag
# )


