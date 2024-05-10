import express from "express";
import { TwitterApi } from "twitter-api-v2";
import process from "process";
import axios from "axios";

// consumer keys - api key
const appKey = process.env.TWITTER_API_KEY;
// consumer keys - api key secret
const appSecret = process.env.TWITTER_API_SECRET;
const accessToken = process.env.TWITTER_ACCESS_TOKEN;
const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const client = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
});
client.readWrite;
const app = express();

const greet = async () => {
    var args = [
        20,
        30,
        40
    ]
    var age = args[Math.floor(Math.random() * args.length)];
    var random = Math.floor(Math.random() * 34) + 1;
    var requestUrl = "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?applicationId=" + process.env.RAKUTEN_APP_ID
        + "&age=" + age + "&sex=1&carrier=0&page=" + random + "&affiliateId=" + process.env.RAKUTEN_AFFILIATE_ID;
    console.log(requestUrl);
    await axios.get(requestUrl, {
    }).then(async (response) => {
        if (response.status !== 201) {
            var randomNo = Math.floor(Math.random() * (response.data.Items.length));
            var itemName = response.data.Items[randomNo].Item.itemName;
            var catchcopy = response.data.Items[randomNo].Item.catchcopy;
            var affiliateUrl = response.data.Items[randomNo].Item.affiliateUrl;
            console.log(itemName);
            console.log(catchcopy);
            console.log(affiliateUrl);
            var tweetText = itemName + catchcopy
            client.v2.tweet(tweetText.substring(0, 90) + " " + affiliateUrl + " #楽天ROOM #楽天 #楽天市場 #ad #PR");
            console.log("完了");

        }
    }).catch((error) => {
        console.log(error);
        return;
    });


};


app.get("/rakuten", (req, res) => {
    try {
        greet();
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});


const greet2 = async () => {
    https.get(process.env.AMAZON_API_URL, (resp) =>{
        let data = ''; 
        resp.on('data', (chunk) => { 
            data += chunk; 
        }); 
        resp.on('end', () => {
            var body = JSON.parse(data)
            console.log(body); 
            console.log(body.length);
            if(body.length == 0){
                greet();
            }
            var random = Math.floor(Math.random() * (body.length));
            console.log(random);
            var text = "【" + body[random].percentage +"%オフ" + "】"
            var url = body[random].url;
            var title = body[random].title.substring(0,88);
            client.v2.tweet(text + " " + url + " " +title + " #セール #Amazon #ad #PR" );
            return true;
        }); 
    
    }).on("error", (err) => { 
        console.log("Error: " + err.message); 
        return false;
    })

};

app.get("/tweet", (req, res) => {
    try {
        greet2();
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

app.get("/", (req, res) => {
    try {
        console.log("ログ定期実行")
    } catch (err) {
        console.log(err);
    }
    res.send('get');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);