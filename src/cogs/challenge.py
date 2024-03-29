import discord
from discord.ext import commands, tasks
from discord import app_commands
from bot_utils import *

from cryptohack import get_user, CATEGORY_LINK, ALL_CHALLENGES
from data.models import *

import logging
log = logging.getLogger("CryptoDrink")

async def challenge_autocomplete(interaction, current):
    choices = []
    for category in ALL_CHALLENGES:
        for value in ALL_CHALLENGES[category]:
            name = f"{category} / {value}"
            if current.lower() in name.lower():
                choices.append(
                    app_commands.Choice(name=name, value=value)
                )
                if len(choices) >= 25:
                    break
    return choices

class Flaggers(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name = "challenge",
        description = tr("challenge description")
    )
    @app_commands.autocomplete(name=challenge_autocomplete)
    async def challenge(self, interaction, name: str):
        challenges = await Challenge.filter(
            name = name,
        )
        if len(challenges) == 0:
            await interaction.response.send_message(
                tr("challenge missing")
            )
            return
        challenge = challenges[0]

        await Flaggers.display_challenge(interaction, challenge)

    @staticmethod
    async def display_challenge(interaction, challenge):
        scoreboards = await Scoreboard.all()
        scoreboard = scoreboards[0]
        users = await scoreboard.users.all()

        embed = discord.Embed(
            #title = "Nouveau flag !",
            colour = discord.Colour.red()
        )

        if challenge.category in CATEGORY_LINK:
            category_link = CATEGORY_LINK[challenge.category]
            category = f"[{challenge.category}]({category_link})"
        else:
            log.error(tr("category missing", name=challenge.category))
            category = f"{challenge.category}"

        flags = 0
        value = ""
        for user in users:
            if user.country == '':
                pays = ":globe_with_meridians:"
            else:
                pays = f":flag_{user.country}:"

            challenges = await user.solved_challenges.filter(
                name = challenge.name,
                category = challenge.category
            )
            if len(challenges) > 0:
                value += (
                    f"{pays} [{user.username}](https://cryptohack.org/user/{user.username})\n"
                )
                flags += 1

        embed.add_field(
            inline = False,
            name = "",
            value = (
                f"**{category}\n**{challenge.name}\n"
                f":star: {challenge.points} ⠀ "
                f":triangular_flag_on_post: {challenge.solves}\n" +
                tr("server flags", count=flags)
            )
        )

        embed.add_field(
            inline = False,
            name = "Flaggers",
            value = value,
        )

        await interaction.response.send_message(
            "",
            embed = embed,
        )

async def setup(bot):
    await bot.add_cog(Flaggers(bot), guilds = [guild_object])
