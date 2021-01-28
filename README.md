# Original Coast Clothing Messenger Bot

Original Coast Clothing (OC) is a fictional clothing brand created to showcase key features of the Messenger Platform. OC leverages key features to deliver a great customer experience. Using this demo as inspiration, you can create a delightful messaging experience that leverages both automation and live customer support. We are also providing the open source code of the app and a guide to deploy the experience on your local environment or remote server.

[Access the Messenger experience](https://m.me/OriginalCoastClothing?ref=GITHUB)

![Messenger Experience](public/experience.png)

See the [Developer Documentations on this experience](https://developers.facebook.com/docs/messenger-platform/getting-started/sample-apps/original-coast-clothing).

# Setting up your Messenger App

## Requirements

- **Facebook Page:** Will be used as the identity of your messaging experience. When people chat with your page. To create a new Page, visit https://www.facebook.com/pages/create.
- **Facebook Developer Account:** Required to create new apps, which are the core of any Facebook integration. You can create a new developer account by going to the [Facebook Developers website](https://developers.facebook.com/) and clicking the "Get Started" button.
- **Facebook App:** Contains the settings for your Messenger automation, including access tokens. To create a new app, visit your [app dashboard](https://developers.facebook.com/apps).

## Setup Steps

Before you begin, make sure you have completed all of the requirements listed above. At this point you should have a Page and a registered Facebook App.

#### Get the App id and App Secret

1. Go to your app Basic Settings, [Find your app here](https://developers.facebook.com/apps)
2. Save the **App ID** number and the **App Secret**

#### Grant  Messenger access to your Facebook App

1. Go to your app Dashboard
2. Under _Add Product_ find _Messenger_ and click _Set Up_
3. Now you should be in the App Messenger Settings
4. Under Access Tokens, click on _Add or Remove Pages_
5. Select the desired page and allow "Manage and access Page conversations" in Messenger
6. Select the desired page and an access token should appear
7. Get the Page ID from the page access token by using the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
8. In the section Built-In NLP, select your page and enable the toggle

# Installation

Clone this repository on your local machine:

```bash
$ git clone git@github.com:fbsamples/original-coast-clothing.git
$ cd original-coast-clothing
```

You will need:

- [Node](https://nodejs.org/en/) 10.x or higher
- Remote server such as [Heroku](https://www.heroku.com/)

# Usage

## Using Heroku
#### 1. Install the Heroku CLI

Download and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### 2. Create an app from the CLI

```bash
heroku apps:create
# Creating app... done, ⬢ mystic-wind-83
# Created http://mystic-wind-83.herokuapp.com/ | git@heroku.com:mystic-wind-83.git
```

Note the name given to your app. In this example, it was `mystic-wind-83`.

#### 3. Set your environment variables
  On the [Heroku App Dashboard](https://dashboard.heroku.com/), find your app and set up the config vars following the comments in the file ```.sample.env```
  
  Alternatively, you can set env variables from the command line like this:
 ```bash
heroku config:set PAGE_ID=XXXX
```

#### 4. Deploy the code
```bash
git push heroku master
```

#### 5. View log output
```bash
heroku logs --tail
```

#### 6. Configure your webhook subscription and set the Messenger profile
  You should now be able to access the application. Use the ```VERIFY_TOKEN``` that you created as a config var and call the **/profile** endpoint on your app like so:

  ```
  http://<YOUR APP NAME>.herokuapp.com/profile?mode=all&verify_token=<VERIFY_TOKEN>
  ```

#### 6. Test that your app setup is successful

  Send a message to your page from Facebook or in Messenger. If your webhook receives an event, you have fully set up your app! Voilà!

## License
Sample Messenger App Original Coast Clothing is BSD licensed, as found in the LICENSE file.

See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.
