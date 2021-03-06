import pandas as pd
from GoogleNews import GoogleNews
from datetime import datetime, date
import regex as re
from dateutil.relativedelta import *
import time

def google_scrape(entity, start_date, end_date, days_per_period=7):
    '''
    Scrape (using GoogleNews API) the top 10 headlines of google news on a particular entity, weekly, over a given time range
    Output : Pandas Dataframe with datetime, title, excerpt, domain (news origin), and article url
    '''
    time.sleep(60) # set timer to wait 60s before scraping (google scraper has limit to scraping)
    
    # calculate the number of weeks between start and end date (inclusive)
    n_periods = (end_date - start_date).days // days_per_period + 2

    # divide the dates into date_periods (query top 10 for each week)
    date_range = pd.date_range(start_date, end_date, periods=n_periods)

    # create result df with columns
    result_df = pd.DataFrame(columns=['date_time', 'title', 'excerpt', 'domain', 'article_url'])

    # go through the date ranges and retrieve top 10
    for i in range(len(date_range)-1):
        start_temp = date_range[i]
        end_temp = date_range[i+1]

        news = GoogleNews(start=start_temp.strftime("%m/%d/%Y"),end=end_temp.strftime("%m/%d/%Y"), lang='en', encode='utf-8')
        news.search(f"{entity}")   # Main bulk of time, taking ~2 seconds to search
    
        if pd.DataFrame(news.result()).empty:
            # No relevant articles 
            continue
    
        # retrieve relevant news results
        temp_df = pd.DataFrame(news.result())[['date', 'title', 'desc', 'media', 'link']]
        
        # rename columns
        temp_df.columns = ['date_time', 'title', 'excerpt', 'domain', 'article_url']
        
        # only get headlines which mention the entity of interest
        temp_df = temp_df[temp_df['title'].str.contains(entity,flags=re.IGNORECASE)].reset_index(drop=True)
        temp_df['date_time'] = temp_df.date_time.apply(date_convert)

        # remove rows without datetime
        temp_df = temp_df.dropna(axis=0, subset=["date_time"])

        # combine result df
        result_df = pd.concat([result_df, temp_df])

    result_df["source_id"] = ""
    result_df["source"] = "google"

    return result_df

def date_convert(day): 
    if day == '1 month ago':
        return datetime.strptime((date.today() - relativedelta(months=+1)).strftime('%Y%m%d'), '%Y%m%d')
    elif day[2:6] == 'week':
        return datetime.strptime((date.today() - relativedelta(weeks=+ int(day[0]))).strftime('%Y%m%d'), '%Y%m%d')
    elif day[2:5] == 'day':
        return datetime.strptime((date.today() - relativedelta(days=+ int(day[0]))).strftime('%Y%m%d'), '%Y%m%d')
    elif (day[2:6] == 'hour') | (day[3:7] == 'hour'):
        return datetime.strptime(date.today().strftime('%Y%m%d'), '%Y%m%d')  
    else:
        try:
            return datetime.strptime(day, '%b %d, %Y')
        except:
            return None

def get_date_string(dt):
    year = str(dt.year)[-2:]
    month = str(dt.month)
    day = str(dt.day)
    if len(day) == 1:
        day = "0" + day
    if len(month) == 1:
        month = "0" + month
    date_string = day + month + year
    return date_string

#Testing
entity="binance"
start_date = datetime(2020, 1, 1, 0, 0, 0)
end_date = datetime(2021, 2, 1, 23, 59, 59)
start = get_date_string(start_date)
end = get_date_string(end_date)
name = start + "_to_" + end + ".csv"
df = google_scrape(entity, start_date, end_date)
df.to_csv("../data/google_feed/" + name)
