# Fragruns

A [Mineflayer](https://mineflayer.prismarine.js.org) bot to allow users to fragrun on the [Hypixel](https://hypixel.net/) Skyblock Gamemode

> Hypixel has a history of banning these bots without a reason. As there is no official statement yet this is entirely use at your own risk!

> This is currently a work in progress, there will be bugs (crashes, getting stuck in parties, etc). Please report any you find as issues to help out!

# Installation

## Node.js

### Prerequisites

- [Node.js](https://nodejs.org/) >= 14
- A migrated Minecraft account

### Setup

#### Clone or download the repository

Clone:

```
git clone https://github.com/itsneyoa/fragruns.git
```

Download:
Press the green `code` button in the top right of the files, then press download zip.

#### Navigate into the project directory and install dependencies

```
cd fragruns && yarn
```

#### Run the bot

Public mode:

```
yarn public
```

Private mode (banned and allowed lists are editable):

```
yarn private
```

#### Use the application

Navigate to http://localhost:3000 in your browser to get started

# To do

- If guild or friends are used, add an option to refresh them every x minutes to stay up to date
- Remove public/private modes and have some way of user authentication to only allow certain people to change the lists
- Improve the logs displayed on the website
- Add a bar above the lists as a way of searching through all users or logs
- Setup the bot so it tries to reconnect if it gets kicked for any reason
- Add a way to make the bot automatically slime hat the user (will require an account with high enough levels to access all the game islands)
- Send messages to party chat every time a party is joined
- Dockerise the application to make deployment easier and setup a 1-click deploy button to a cloud provider
- Add instructions on how to set up an nginx/apache2 web server to serve the website over the internet
- Add support for multiple bots running on separate child processes all shown on the same website (I think there's a maximum of 5 concurrent logins from 1 ip address, so support for 1-5)
- Refactor, refactor, refactor. Especially `src/minecraft/bot.ts` and all the css written
