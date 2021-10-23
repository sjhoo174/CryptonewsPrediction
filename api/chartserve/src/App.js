import React from 'react';
import { Chart, registerables} from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

// const config = {
//   type: 'line',
//   data: data,
// };

const port = "80";
const url = "http://" + process.env.REACT_APP_SERVER_URL + ":";

class ApiDoc extends React.Component {
  constructor(props) {
    super(props);
    this.buttonName = props.buttonName;
    this.apiLink = props.apiLink;

    this.whichApi = this.whichApi.bind(this);  
    this.decideParams = this.decideParams.bind(this);
    this.onClicked = this.onClicked.bind(this);
    this.getJsonResponse = this.getJsonResponse.bind(this);
    this.onTextChange = this.onTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this);
    this.state = {toggle: false, json: "Sample response:", input: "", fetched: false, loading: false};
  }


  onTextChange(evt) {
    this.state.input = evt.target.value;

  }

  onEnter(evt) {
    if (evt.key == "Enter") {
        this.getJsonResponse();
    }
  }

  onClicked() {
    switch(this.apiLink) {
      case "/risk_sentiment":

        this.form = () => (
          <div class ="api_input">
            <span class="form_input">
              Input : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.apiLink}?
            </span>
            <span class="form_input">
                <input class="form_params" onChange={this.onTextChange} type="text" placeholder='' onKeyPress={this.onEnter}></input>
            </span>
            <span>
              <button class="form_button" onClick={this.getJsonResponse}>
                Click to try
                
              </button>
            </span>
            <span>
              <div class="loader" style={{visibility: this.state.loading ? 'visible' :'hidden'}}></div>
            </span>
          </div>
        );
        
        break;
      
      case "/ner":
        this.form = () => (
          <div class ="api_input">
            <span class="form_input">
              Input : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.apiLink}?
            </span>
            <span class="form_input">
                <input class="form_params" onChange={this.onTextChange} type="text" placeholder='' onKeyPress={this.onEnter}></input>
            </span>
            <span>
              <button class="form_button" onClick={this.getJsonResponse}>
                Click to try
              </button>
            </span>
            <span>
              <div class="loader" style={{visibility: this.state.loading ? 'visible' :'hidden'}}></div>
            </span>
          </div>
        );
        break;
     
        case "/topArticles":
        this.form = () => (
          <div class ="api_input">
            <span class="form_input">
              Input : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.apiLink}?
            </span>
            <span class="form_input">
                <input class="form_params" onChange={this.onTextChange} type="text" placeholder='' onKeyPress={this.onEnter}></input>
            </span>
            <span>
              <button class="form_button" onClick={this.getJsonResponse}>
                Click to try
              </button>
            </span>
            <span>
              <div class="loader" style={{visibility: this.state.loading ? 'visible' :'hidden'}}></div>
            </span>
          </div>
        );
        break;

        case "/getScore":
        this.form = () => (
          <div class ="api_input">
            <span class="form_input">
              Input : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.apiLink}?
            </span>
            <span class="form_input">
                <input class="form_params" onChange={this.onTextChange} type="text" placeholder='' onKeyPress={this.onEnter}></input>
            </span>
            <span>
              <button class="form_button" onClick={this.getJsonResponse}>
                Click to try
              </button>
            </span>
            <span>
              <div class="loader" style={{visibility: this.state.loading ? 'visible' :'hidden'}}></div>
            </span>
          </div>
        );
        break;
      default:
      
    }
    if (this.state.toggle == true) {
      this.state.toggle = false
      this.setState({toggle: false});
      console.log(this.state.toggle);
      
    } else {
      this.state.toggle = true;
      this.setState({toggle:true});
      console.log(this.state.toggle);
    }
    

  }

  async getJsonResponse() {
    this.setState({json: "", loading: true})
    console.log(this.state.input)
    var finalurl = url + port + this.apiLink + "?" + this.state.input
    var resp = "";
    await axios({
      method: 'get',
      url: finalurl,
      
    }).then(function(res) {
      console.log(res);
      resp = res.data;
      return;
    });
    console.log(JSON.stringify(resp));
    this.setState({json: JSON.stringify(resp, undefined, 4), loading:false});
  }

  decideParams() {
    switch(this.apiLink) {
      case "/risk_sentiment":
        this.paramslist = () => (
          <div class="params">
            <span>text [ ]  :  </span><span class ="answer">List of text strings for risk scoring</span>
          </div>
        );
        this.returnlist = () => (
          <div class="params">
            <span>risk_score :  </span><span class ="answer">int</span>
          </div>
        );
        break;
    
      case "/ner":
        this.paramslist = () => (
          <div class="params">
            <span>text [ ]  :  </span><span class ="answer">List of text strings for ner scoring</span>
          </div>
        );
        this.returnlist = () => (
          <div class="params">
            <span>ner_output :  </span><span class ="answer">List [ List [ confidence, name, type ] ]</span>
          </div>
        );
        break;
     

        case "/topArticles":
          this.paramslist = () => (
            <div>
               <div class="params">
                <span>start  :  </span><span class ="answer">date string e.g. 2021-07-05</span>
                </div>
                <div class="params">
                  <span>end  :  </span><span class ="answer">date string e.g. 2021-07-07</span>
                </div>
                <div class="params">
                  <span>limit  :  </span><span class ="answer">no. of articles per source e.g. 5</span>
                </div>
                <div class="params">
                  <span>entity [ ]  :  </span><span class ="answer">desired entity that is to be queried e.g. Binance, Point72, etc.</span>
                </div>
                <div class="params">
                  <span>source [ ]  :  </span><span class ="answer">new source e.g. bitcoin, cryptonews, etc.</span>
                </div>
            </div>
            
          );
          this.returnlist = () => (
            <div class="params">
              <div>
              <span>data :  </span><span class ="answer">List [ List [ article_id, text, date, url, risk_score, source ] ] -- sorted by risk_score</span>
              </div>
            </div>
          );
          break;

          case "/getScore":
            this.paramslist = () => (
              <div>
                <div class="params">
                <span>start  :  </span><span class ="answer">date string e.g. 2021-07-05</span>
                </div>
                <div class="params">
                  <span>end  :  </span><span class ="answer">date string e.g. 2021-07-07</span>
                </div>
                <div class="params">
                  <span>source [ ]  :  </span><span class ="answer">new source e.g. bitcoin, cryptonews, etc.</span>
                </div>
              </div>
              
            );
            this.returnlist = () => (
              <div class="params">
                <div>
                <span>data :  </span><span class ="answer">List [ source, List [ average_risk, no_of_articles ] ]</span>
                </div>
              </div>
            );
            break;
      default:
    }
  }

  whichApi() {
    if (this.state.fetched == false) {
      switch(this.apiLink) {
        case "/risk_sentiment":
  
          this.state.json =JSON.stringify({"risk_score" : 36.584},undefined,4);
          
          break;
        case "/days":
          this.state.json = JSON.stringify({"data":[[628,"Crypto Derivatives Exchange Bybit to Introduce Stringent KYC Policy","\nThe British Virgin Islands-based Bybit Fintech Limited has announced the cryptocurrency derivatives exchange is introducing an updated know-your-customer (KYC) policy on July 12. Bybit... ","2021-07-07","https://news.bitcoin.com/crypto-derivatives-exchange-bybit-to-introduce-stringent-kyc-policy/",0.6850334039824247,"bitcoin"],[629,"Crypto Derivatives Exchange Bybit to Introduce Stringent KYC Policy","\nThe British Virgin Islands-based Bybit Fintech Limited has announced the cryptocurrency derivatives exchange is introducing an updated know-your-customer (KYC) policy on July 12. Bybit... ","2021-07-07","https://news.bitcoin.com/crypto-derivatives-exchange-bybit-to-introduce-stringent-kyc-policy/",0.6850334039824247,"bitcoin"]],"type":"range"},undefined,4);
          break;
        case "/ner":
          this.state.json =  JSON.stringify({"ner_output":[[{"confidence":0.8183349967002869,"name":"altcoins","type":"Entity"}]]},undefined,4);
          break;
       
        case "/topArticles":
          this.state.json = JSON.stringify({"data":[[8690,"'Unprecedented' Alliance Against China, Crypto Investment Flows + More News","Get your daily, bite-sized digest of cryptoasset and blockchain-related news \u2013 investigating the stories flying under the radar of today\u2019s crypto news.\n____Digital asset investment products saw another quiet week with minimal net inflows totaling USD 2.9m last week, per Coinshares data. \"After a few  weeks of inflows into bitcoin (BTC) we have seen outflows for the last two weeks, with outflows last week totaling USD 10.4m,\" they said, adding that \"these outflows are minimal relative to the significant outflows witnessed in May and June this year.\" Meanwhile, ethereum (ETH) saw its third consecutive week of inflows.Major digital currency asset manager Grayscale Investments and CoinDesk Indexes, a subsidiary of the CoinDesk website, announced the launch of investment product Grayscale DeFi Fund and the CoinDesk DeFi Index. Grayscale DeFi Fund provides investors with exposure to a selection of DeFi protocols through a market-capitalization weighted portfolio designed to track the CoinDesk DeFi Index.\nThe index consists of the following assets and weightings:\n- Uniswap (UNI), 49.95%\n- Aave (AAVE), 10.25%\n- Compound (COMP), 8.38%\n- Curve (CRV), 7.44%\n- MakerDAO (MKR), 6.49%\n- SushiSwap (SUSHI), 4.83%\n- Synthetix (SNX), 4.43%\n- Yearn Finance (YFI), 3.31%\n- UMA Protocol (UMA), 2.93%\n- Bancor Network Token (BNT), 2.00%","2021-07-19","https://cryptonews.com/news/unprecedented-alliance-against-china-crypto-investment-flow-11122.htm",0.9497101974534519,"cryptonews"],[8689,"ROSA Finance Builds The First Decentralized Pension Fund","Disclaimer: The text below is a press release that was not written by Cryptonews.com.ROSA FINANCE is making use of public blockchain technologies to build up a retirement and savings solution focused on transparency, security, self-custody, and decentralization.Intermediaries have plagued the existing financial system for years. The processes are inefficient, and customers have little information about their funds\u2019 actual situation and less access than ever before. In fact, in many cases, when you put your money in an average pension fund, it feels a lot like those funds have faded away.","2021-07-20","https://cryptonews.com/news/rosa-finance-builds-the-first-decentralised-pension-fund-11133.htm",0.9497303826985702,"cryptonews"],[8297,"Investors Are Still Free To Use Binance, Says Polish Regulator","After warning local investors about Binance last week, Poland\u2019s Financial Supervision Authority (KNF) reminds that they are still free to decide whether to use this platform. As it does not supervise crypto exchanges in Poland, the authority only reacts to situations in which it believes investors could be harmed.The aim of its latest statement on Binance, in which the regulator advised investors to be careful while using the company\u2019s services, was \u201cto inform investors on the potential risks related to the activities of this entity which have been pointed out by foreign regulators,\u201d a spokesperson for the KNF told Cryptonews.com.\u201cThe decision to use the services of this entity rests entirely on the side of investors. The Financial Supervision Authority does not perform any analyses related to the popularity of particular [cryptocurrency exchange] services, as, in principle, these entities are not regulated by the KNF,\u201d the spokesperson said, adding that the KNF only \u201cresponds on an ongoing basis to situations that may put investors at risk.\"","2021-07-16","https://cryptonews.com/news/investors-are-still-free-to-use-binance-says-polish-regulato-11099.htm",1.0624781250758049,"cryptonews"],[8300,"UK's FCA Targets Young Crypto Investors, DeFi Hacks + More News","Get your daily, bite-sized digest of cryptoasset and blockchain-related news \u2013 investigating the stories flying under the radar of today\u2019s crypto news.\n_______\n(Updated at 17:39 UTC with a paragraph about Binance.)","2021-07-15","https://cryptonews.com/news/uk-s-fca-targets-young-crypto-investors-hacks-more-news-11087.htm",30.45057820961668,"cryptonews"],[7637,"Youtube Superstar KSI \u2018JJ\u2019 Says He Made Then Lost Millions Investing in Bitcoin","\nYoutube superstar and rapper KSI, also known as JJ, has shared that he made millions of pounds investing in bitcoin and \"lost it all\"... ","2021-07-17","https://news.bitcoin.com/youtube-superstar-ksi-jj-says-he-made-then-lost-millions-investing-in-bitcoin/",45.98734689260981,"bitcoin"],[7622,"Malaysia Flattens Seized Bitcoin Mining Rigs With Steamroller \u2014 Over 1,000 Machines Demolished","\nOver 1,000 bitcoin mining machines have been totally destroyed in Malaysia after they were seized for illegally mining the cryptocurrency using stolen electricity. The... ","2021-07-18","https://news.bitcoin.com/malaysia-flattens-seized-bitcoin-mining-rigs-with-steamroller-over-1000-machines-demolished/",94.30510280155777,"bitcoin"],[7628,"Ukraine\u2019s \u2018Largest Illegal\u2019 Mining Facility May Have Been a FIFA Bot Farm","\nA data center busted by Ukrainian law enforcement this month for suspected electricity theft may have had a purpose different from mining cryptocurrencies. Ukraine\u2019s... ","2021-07-18","https://news.bitcoin.com/ukraines-largest-illegal-mining-facility-may-have-been-a-fifa-bot-farm/",98.52282731450838,"bitcoin"],[7654,"Hong Kong Busts Money Laundering Ring Using Tether to Wash Millions","\nAuthorities in Hong Kong have arrested four people suspected of money laundering a total of $155 million through cryptocurrency wallets and bank accounts. The... ","2021-07-16","https://news.bitcoin.com/hong-kong-busts-money-laundering-ring-using-tether-to-wash-millions/",98.79719803283916,"bitcoin"]],"limit":"5"}, undefined, 4);
          break;

        case "/getScore":
          this.state.json = JSON.stringify({"data":[["bitcoin",[[1.039872118907188,17],[0.8086675553207587,13],[19.887075198397913,10],[4.588501346648817,12],[7.438266833439185,15],[0.8274112490592828,17]]],["cryptonews",[[0.808933182696645,2],[0.8850434396507125,2],[0.7859520913338247,1],[0.7505141292052548,1],[0.9658586331902965,2],[6.704226146985256,5]]]]}, undefined, 4);
          break;

        default:
          // code block
      }
    }
    this.state.fetched = true;
    
  }
  render() {
    this.whichApi();
    this.decideParams();
    return (
      <div class= "api_container">
        <div class="apidoc">
          <span class ="api_span">
            <div class="api_div">
              <button class="api_button" onClick={this.onClicked}>
                
                  {this.buttonName}
              </button>
            </div>
          </span>
          <span class="api_span">
            <div class = "api_link">
              {this.apiLink}
            </div>
          </span>
          <span class ="api_arrow">
            <i class="arrow down" onClick={this.onClicked}></i>
          </span>

        </div>
        <div  class="api_description">
            {this.state.toggle ? <this.form/>: null}
            <div>
              Params:
            </div>
            <this.paramslist/>
            <div>
              Returns:
            </div>
            <this.returnlist/>
            
        </div>
        <div class="json_container">
          <div class="sample">
            Sample Response :
          </div>
          <pre class ="json_format">
            {this.state.json}
          </pre>
        </div>
      </div>
      
    )
      
  }
}


const App = () => {
  return (
    <div class="main">
      <span class="left_pane">
        <div class = "page_title">
          Cryptonews Analytics
        </div>
        <Graph/>
      </span>

      <span class="right_pane">
        <div class="right_pane_container">
          <div class="title">
            Api Documentation
          </div>
          <ApiDoc buttonName="GET" apiLink="/risk_sentiment"/>
          <ApiDoc buttonName="GET" apiLink="/ner"/>
          <ApiDoc buttonName="GET" apiLink="/getScore"/>
          <ApiDoc buttonName="GET" apiLink="/topArticles"/>
         
          
        </div>
        

      </span>      
    </div>
  )
}


class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.chartref = React.createRef();
    this.axios = require('axios');
    this.endpoint = "/getScore"
    this.finalurl =url + port + this.endpoint;
    this.labels= [...Array(30).keys()]
    this.chart = null;
    this.state = {
      datasets: []
    }
    // this.datasets = [{
    //   label: 'Cointelegraph',
    //   data: [65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40,65, 59, 80, 81, 56, 55, 40],
    //   fill: true,
    //   borderColor: 'rgb(75, 192, 192)',
    // },
    // {
    //   label: 'Bitcoin',
    //   data: [65, 30, 50, 81, 40, 35, 77,65, 30, 50, 81, 40, 35, 77,65, 30, 50, 81, 40, 35, 77],
    //   fill: true,
    //   borderColor: 'rgb(226, 18, 18)',
    // },
  // ];

  }

  async getDataFromUrl(ctx) {
    
    var currentdate = new Date(); 
    var enddate = new Date()
    currentdate.setDate(currentdate.getDate()+1)
    enddate.setDate(currentdate.getDate() + 30);
    console.log(enddate)
    console.log(currentdate)
    var today = currentdate.getFullYear() + '-' + ('0' + currentdate.getMonth()).slice(-2) + '-' + ('0' + currentdate.getDate()).slice(-2);
    var end = enddate.getFullYear() + '-' + ('0' + enddate.getMonth()).slice(-2) + '-' + ('0' +enddate.getDate()).slice(-2);
    console.log(today)
    console.log(end)
    await axios({
      method: 'get',
      url: this.finalurl,
      params: {
        start : today,
        end :  end ,
        limit: 5,
        source : ['bitcoin', 'cryptonews', 'cryptoslate', 'coindesk', 'cointelegraph']

      }
      
    }).then(function(response) {
      let data_set = [];
      let colors = ['rgb(192, 11, 11)', 'rgb(48, 228, 24)', 'rgb(8, 42, 231)', 'rgb(241, 47, 199)', 'rgb(109, 233, 241)']
      response.data.data.map((item) => {
        let source = item[0];
        let array = item[1];
        let finalArray = [];
        array.map((inner) => {
          finalArray.push(inner[0]);
          return;
        });

        data_set.push({
          label: source,
          data: finalArray,
          fill:true,
          borderColor: colors.pop()
        });

      });
      ctx.setState({
        datasets: data_set
      })
      console.log(data_set)
      ctx.drawChart();
      console.log('here');
      

      return data_set;
    });

  }
  
  drawChart() {
    var ctx = this.chartref.current.getContext('2d');
    if (this.chart != null) {
      this.chart.destroy();
    }
    const data = {
      labels: this.labels,
      datasets: this.state.datasets
    };
    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            suggestedMin: 0,
            suggestedMax: 100
        }
      }
      }
    });

  }

  componentDidMount() {
    this.drawChart();
    this.getDataFromUrl(this);

  }
  render() {
    return(
      <div class="chart_container">
        <canvas class="myChart" ref={this.chartref}></canvas>

      </div>
      
    )
  }
}

export default App;
