## CryptoDrink

**CryptoDrink** is a Discord bot which implements a local
scoreboard for [CryptoHack](https://cryptohack.org/).

 - Announces when a server member solves a challenge
 - Displays statistics about a CryptoHack user
 - Local scoreboard for your server
 - List who solved a challenge in your server

<img src="https://i.imgur.com/oHi62uH.png" alt="User Profile" width="200"/> <img src="https://i.imgur.com/n1pjYWs.png" alt="Scoreboard" width="200"/> <img src="https://i.imgur.com/VCkI0YU.png" alt="Flag announcement" width="200"/>



## Installation

First, you need to [create your own Discord bot](https://discordpy.readthedocs.io/en/stable/discord.html).
The bot will need permissions to read messages, send messages and include
embeds.
It will also need the *Message Intent*.


Clone the repository using git
```bash
git clone https://github.com/PoustouFlan/Crypto-Drink.git
cd Crypto-Drink
```

Then, complete the file `configuration.yaml`:
```yaml
token:      "Your.Bot.Token-Here"
guild_id:   123456789012345678
channel_id: 1234567890123456789
locale:     "en"
```
 - `token` should be your Discord Bot token
 - `guild_id` should be [the id of your Discord server](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID)
 - `channel_id` should be [the id of the channel](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID) where the flags are announced
 - `locale` should be your prefered language (currently available are `"en"` and `"fr"`).

### NixOS

You can simply run the bot using:
```bash
nix-shell --run make
```

### Non NixOS

You need to install the necessary Python packages using pip.
Assuming you have `python3` and `pip` installed, you can run
```bash
pip install -r requirements.txt
```
to install the necessary packages, then run
```bash
make
```
to start the bot.
