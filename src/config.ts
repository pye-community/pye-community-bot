import dotenv from 'dotenv';
dotenv.config();
const { CLIENT_ID, DISCORD_TOKEN, GUILD_ID } = process.env;

if (!CLIENT_ID || !DISCORD_TOKEN || !GUILD_ID) {
  throw new Error('Missing environment variables');
}

const config = {
  bot: {
    CLIENT_ID,
    DISCORD_TOKEN,
    GUILD_ID,
  },

  /**
   * TODO: change it, since this bot should be agnostic and not have any server configuration
   */

  channels: {
    challenges_channel: ['1141493769699606528'],
    reports_channel: '1145160830741135470',
    errors_channel: '1157031088317800510',
  },
  users: {
    owners: ['341077056026705930', '254720311717658624'],
    developers: ['401845716991082496', '852588734104469535'],
  },
  commands: {
    defaultcooldown: 5,
  },
  nsfw: {
    model: 'Falconsai/nsfw_image_detection',
    target: {
      id: '780597611496865792', // rol novato
    },
    threshold: 0.8,
  },
  shareThreads: {
    forumTargets: [
      '1019686175490986124', // ayuda-general
      '1122376272450945025', // html-css
      '1122388627557732362', // javascript
      '1122390683106414652', // python
      '1122390294973915176', // java-kotlin
      '1122391769775079505', // php
      '1122393447698014271', // c
      '1122396855775539320', // c++
      '1122393447698014271', // c-sharp-dotnet
      '1122400137214427176', // go
      '1122399598107967580', // rust
      '1122399272499941426', // dart
      '1123017116807872552', // pseint
      '1019771485948227614', // base-de-datos
      '1019787424156627044', // devops
      '1019729125310734366', // discord-dev
      '1107163223771324426', // diseño-interfaces
      '1019750681608994825', // electronica
      '867526069875507240', // fisica-quimica
      '1019734514202857592', // game-dev
      '1019727139173576814', // hard-ware
      '1019789271386837102', // linux
      '805086058382491648', // matemáticas
      '1019776581599768719', // seguridad-informatica
      '1019773997296123944', // redes
      '1019719246655258705', // windows
    ],
    outputChannel: {
      chat_programadores: '807385882868580392'
    }
  }
};

export default config;
