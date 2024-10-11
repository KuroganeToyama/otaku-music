# Otaku Music
A Discord music bot for me and my friends to play with in our private server. <br>
Built using discord.js and several useful music player librabries.

# Note
This music bot makes use of `@discordjs/opus`, a package necessary for playing music in voice channels. <br>
Unfortunately, `@discordjs/opus` has to be built, and that involves a whole lot of other tools. <br>
So, there are 2 gimmicks, depending on how you build the bot.

## Local Development
If you're building the bot locally using `yarn local:run`, then make sure you have the following tools
to build `@discordjs/opus`:

- `make`
- `python3`
- `build-essential`
- `libopus-dev`
- `ffmpeg`

When I was working on the bot, my OS was Debian 12, and that was all I need to do.
For other OSes, you may need to do some extra work.

## Docker Development
If you're building the bot using Docker, then all you need to do is `yarn image:build` and wait. <br>
Depending on your system, this may take somewhere from 20 - 30 minutes, due to Docker installing all
the above tools to the base Linux image.

# End
Hopefully, that should be all the hassle you need to be informed of.