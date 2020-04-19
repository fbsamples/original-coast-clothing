[![Build Status](https://travis-ci.com/Cologne-Dog/messenger-commerce-bot.svg?branch=master)](https://travis-ci.com/Cologne-Dog/messenger-commerce-bot)

# Cologne.Dog Messenger Commerce Bot


## ENVIRONMENT

Create your environment with a `.env` file formatted as below:

```
# Environment Config

# store your secrets and config variables in here
# only invited collaborators will be able to see your .env values

# Your App secret can be found in App Dashboard -> Settings -> Basic
APP_ID=
APP_SECRET=

# Page id & token info in App Dashboard -> Messenger -> Settings
PAGE_ID=
PAGE_ACCESS_TOKEN=

# Random string for webhook verification
# ex: COLOGNEDOG
VERIFY_TOKEN=

# URL where you host this code
# You can use NGROK for development (https://ngrok.com/)
APP_URL=

# URL of website "shop now"
# ex: https://cologne.dog/products
SHOP_URL=

# Port
PORT=3000
```

#### Get the App id and App Secret

1. Go to your app Basic Settings, [Find your app here](https://developers.facebook.com/apps)
2. Save the **App ID** number and the **App Secret**

#### Grant  Messenger access to your Facebook App

1. Go to your app Dashboard
2. Under Add Product find Messenger and click Set Up
3. Now you should be in the App Messenger Settings
4. Under Access Tokens, click on Edit Permissions
5. Select the desired page and allow Manage and access Page conversations in Messenger
6. Select the desired page and an access token should appear
7. Get the Page ID from the page access token by using the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
8. In the section Built-In NLP, select your page and enable the toggle

#### Get the App Access Token

1. On the left panel select Messenger > Settings
2. Generate and save the access token


## SETUP

#### 1. Install the dependencies

```bash
$ npm install
```

or

```bash
$ yarn install
```

#### 2. Set `.env` file

 Edit the `.env` file to add all the values for your app and page. Then run your app locally using the built-in web server

#### 3. Run on localhost:$PORT

```bash
npm start
```

You should now be able to access the application in your browser at [http://localhost:3000](http://localhost:3000)

The Facebook servers will need to reach your localhost server. Unless you are running your code in the cloud, use ngrok or similar.

#### 4. Set Messenger profile

Use the `VERIFY_TOKEN` that you created in `.env` file and call the **/profile** endpoint like so:
```
http://localhost:3000/profile?mode=all&verify_token=$VERIFY_TOKEN
```

#### 5. Test that your app setup is successful

Send a message to your Page from Facebook or in Messenger, if your webhook receives an event, you have fully set up your app! Voilà!

## License
Cologne.Dog Messenger Commerce Bot is BSD licensed, as found in the LICENSE file.
