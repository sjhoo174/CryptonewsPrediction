import requests
from bs4 import BeautifulSoup
from datetime import datetime
import pandas as pd

def bitnewstoday_scrape(entity, start_date, end_date):
    website_url = "https://bitnewstoday.com"
    page_num = 1
    current_date = end_date

    # create output dataframe
    column_names = ["date_time", "title", "excerpt", "article_url", "image_url"]
    df = pd.DataFrame(columns = column_names)
    
    # add + for entity with spaces
    entity = entity.replace(" ", "+")

    prev_results = ''

    while current_date >= start_date: 
        # new page of queries
        search = website_url + "/search/?q=" + entity + "&PAGEN_1=" + str(page_num)
        page = requests.get(search)
        soup = BeautifulSoup(page.content, features="html.parser")

        # retrieve only search items
        results = soup.find_all(class_="search-item")
        
        # no search results
        if len(results) == 0:
            break

        # if next page is the same as this page
        if prev_results == results:
            break

        for i in range(len(results)):
            try: 
                # retrieve date 
                date_string = results[i].find("span").text
            except:
                continue

            date_time = datetime.strptime(date_string, "%d.%m.%y")
            current_date = date_time # update current date 
  
            if date_time > end_date:  # if after cut-off date, skip
                continue
            if date_time < start_date: # if before cut-off date, stop scraping
                break
            
            # retrieve title and article link
            title = results[i].find(class_="title")
            article_url = website_url + title["href"] 
            title_text = title.text

            # retrieve excerpt
            excerpt = results[i].find("p").text.strip()

            # retrieve image link
            image_style = results[i].find(class_="picture")["style"][:-1]
            image_url = website_url + image_style.split("(")[-1]

            # add information to dataframe
            df = df.append({"date_time": date_time, "title": title_text, \
                "excerpt": excerpt, "article_url": article_url, \
                    "image_url": image_url
                }, ignore_index=True)

        prev_results = results
        page_num += 1 # scrape next page
        
    return df

def bitnewstoday_scrape_general(start_date, end_date):
    website_url = "https://bitnewstoday.com"
    page_num = 1
    current_date = end_date

    # create output dataframe
    column_names = ["date_time", "title", "excerpt", "article_url", "image_url","source"]
    df = pd.DataFrame(columns = column_names)

    prev_results = ''

     while current_date >= start_date: 
        # new page of queries
        search = website_url + "/news/cryptocurrencies/?PAGEN_1=" + str(page_num)
        page = requests.get(search)
        soup = BeautifulSoup(page.content, features="html.parser")

        # retrieve only search items
        results = soup.find(class_="newslist").find_all(class_="item")
        
        # no search results
        if len(results) == 0:
            break

        # if next page is the same as this page
        if prev_results == results:
            break

        for i in range(len(results)):
            try: 
                # retrieve date 
                date_string = results[i].find(class_="date").text
                date_string = date_string.replace("\n","")
                date_string = date_string.replace("\xa0","")
                date_string = date_string.strip()
            except:
                continue

            date_time = datetime.strptime(date_string, "%d %B %Y")
            current_date = date_time # update current date 
  
            if date_time > end_date:  # if after cut-off date, skip
                continue
            if date_time < start_date: # if before cut-off date, stop scraping
                break
            
            # retrieve title and article link
            title = results[i].find(class_="title")
            article_url = website_url + title["href"] 
            title_text = title.text

            # retrieve excerpt
            excerpt = results[i].find(class_="text").text.strip()

            # retrieve image link
            image_url = results[i].find(class_="photo")["data-src"]
            image_url = website_url + image_url

            # add information to dataframe
            df = df.append({"date_time": date_time, "title": title_text, \
                "excerpt": excerpt, "article_url": article_url, \
                    "image_url": image_url,"source":"bitnewstoday"
                }, ignore_index=True)

        prev_results = results
        page_num += 1 # scrape next page
        
        # website_url = "https://bitnewstoday.com"
        # page_num = 1
        # current_date = end_date

        # # create output dataframe
        # column_names = ["date_time", "title", "excerpt", "article_url", "image_url","source"]
        # df = pd.DataFrame(columns = column_names)

        # prev_results = ''

    # while current_date >= start_date: 
    #     # new page of queries
    #     search = website_url + "/news/cryptocurrencies/?PAGEN_1=" + str(page_num)
    #     page = requests.get(search)
    #     soup = BeautifulSoup(page.content, features="html.parser")

    #     # retrieve only search items
    #     results = soup.find(class_="newslist").find_all(class_="item")
        
    #     # no search results
    #     if len(results) == 0:
    #         break

    #     # if next page is the same as this page
    #     if prev_results == results:
    #         break

    #     for i in range(len(results)):
    #         try: 
    #             # retrieve date 
    #             date_string = results[i].find(class_="date").text
    #             date_string = date_string.replace("\n","")
    #             date_string = date_string.replace("\xa0","")
    #             date_string = date_string.strip()
    #         except:
    #             continue

    #         date_time = datetime.strptime(date_string, "%d %B %Y")
    #         current_date = date_time # update current date 
  
    #         if date_time > end_date:  # if after cut-off date, skip
    #             continue
    #         if date_time < start_date: # if before cut-off date, stop scraping
    #             break
            
    #         # retrieve title and article link
    #         title = results[i].find(class_="title")
    #         article_url = website_url + title["href"] 
    #         title_text = title.text

    #         # retrieve excerpt
    #         excerpt = results[i].find(class_="text").text.strip()

    #         # retrieve image link
    #         image_url = results[i].find(class_="photo")["data-src"]
    #         image_url = website_url + image_url

    #         # add information to dataframe
    #         df = df.append({"date_time": date_time, "title": title_text, \
    #             "excerpt": excerpt, "article_url": article_url, \
    #                 "image_url": image_url,"source":"bitnewstoday"
    #             }, ignore_index=True)

    #     prev_results = results
    #     page_num += 1 # scrape next page
        
    return df

##test
##entity = "ethereum"
##start_date = datetime(2021, 1, 1)
##end_date = datetime(2021, 1, 31)
##df = bitnewstoday_scrape(entity, start_date, end_date)
##df.to_csv("../data/bitnewstoday_feed/010121_to_310121.csv")

##test general
##start_date = datetime(2020, 1, 1)
##end_date = datetime(2021, 2, 20)
##df = bitnewstoday_scrape_general(start_date, end_date)
##sample = df.sample(n=200, random_state=1)
##sample["text"] = sample["title"] + " " + sample["excerpt"]
##sample.to_csv("./sample.csv")

