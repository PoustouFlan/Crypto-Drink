# CryptoDrink [Work In Progress!]

This is a complete rework of the previous Discord Bot [CryptoDrink](https://github.com/PoustouFlan/Crypto-Drink-Deprecated).
CryptoDrink allows anybody to create a local [CryptoHack](https://cryptohack.org) scoreboard with friends.
The scoreboards then can be linked to some Discord WebHooks, in order to receive automatic announcements when any user in the scoreboard solves a new challenge.
Whereas CryptoDrink was previously a Discord Bot, it will now also be a proxy and a website.

## Proxy
CryptoDrink now features a proxy over CryptoHack's api, featuring many additional endpoints.

- `/api/category` lists all known challenges of a category
- `/api/challenge` lists all known flaggers of a challenge in a scoreboard
- `/api/scoreboard` allows the creation of a scoreboard, the registration of users in a scoreboard and the connection of a scoreboard to a Discord webhook
- `/api/user` lists all known data about a user, as well as his completion progress for each category 

The proxy is entirely coded in Java with Maven + Quarkus in the folder `src`, following the traditional layered architecture.
It uses a postgres database named `cryptodrink` which can be configured in the resources.
The backend should be started with maven.

## Webhook
Flag announcement is now managed thanks to webhooks.
This is directly implemented in the backend: when the data regarding a user is updated, all new solved challenges are announced through all webhooks of all scoreboards the user belongs to.

Preview:

<img src="https://github.com/user-attachments/assets/41415267-5934-4168-a620-ea9048dc1e1d" alt="Flag announcement" width="100"/>

## Website [Work in Progress]
A frontend features a convenient visualization of scoreboards and user data.
The frontend is coded using Vite/React/TypeScript, and should be started with npm.

Preview:

<img src="https://github.com/user-attachments/assets/e91e4822-4022-4526-8b8d-c5c4b50e585a" alt="Scoreboard" width="300"/>
