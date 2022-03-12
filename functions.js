const fs = require("fs");
const { resolve } = require("path");

/**
 * @param {string} code
 * @returns {string}
 */
function converter(code) {
  return code
    .replace(/(?<=(.+))\.channelID/g, ".channelId")
    .replace(/(?<=\.(on|once)\()('|"|`)(message)('|"|`)/g, '"messageCreate"')
    .replace(
      /(?<=\.(on|once)\()('|"|`)(interaction)('|"|`)/g,
      '"interactionCreate"'
    )
    .replace(
      /(?<=class(\s+)(\w+)Event(\s+)extends(\s+)BaseEvent(\s+)?\{(\n+)?(\s+)?constructor(\s+|\n+)?\((\s+|\n+)?\)(\s+|\n+)?\{(\s+|\n+)super(\s+|\n+)?\((\s+|\n+)?)('|"|`).+('|"|`)/g,
      (sub) => {
        if (sub.match(/('|"|`)message('|"|`)/)) {
          return '"messageCreate"';
        } else if (sub.match(/('|"|`)interaction('|"|`)/)) {
          return '"interactionCreate"';
        } else return sub;
      }
    )
    .replace(/(?<=(\w+))(\.guild\.owner((\.)?(\w+)?)?)/g, ".guild.ownerId")
    .replace(/(?<=\.(send|reply|edit)\()('|"|`)?(.+)('|"|`)?(?=\))/g, (sub) => {
      if (sub.match(/('|"|`)(.+)('|"|`)/)) {
        return `{ content: ${sub} }`;
      } else {
        return `{ embeds: [${sub}] }`;
      }
    })
    .replace(
      /(?<=\{(\s+|\n+))ws(\s+|\n+)?:(\s+|\n+)?\{(\s+|\n+)?intents(\s+|\n+)?:(\s+|\n+)?\[\d+\](\s+|\n+)?\}/g,
      (s) => {
        let ii = s.match(/\[.+\]/);
        return `intents: ${ii}`;
      }
    )
    .replace(/(?<=((\w+)\.)?createReactionCollector\().+{/g, (sub) => {
      return `{ filter: ${sub.split(",")[0]},`;
    })
    .replace(
      /(?<=\=(\s+|\n+)?new(\s+|\n+)?Permissions)(\()(\d+)(\))/g,
      (sub) => {
        return `(BigInt${sub})`;
      }
    )
    .replace(/((\w+)\.)?(\s+|\n+)?hasPermission.+/g, (sub) => {
      return `${sub.replace("hasPermission", "permissions.has")}`;
    })
    .replace(
      /(?<=((\w+)\.)?type(\s+|\n+)?((\=\=(\=)?)|:)?(\s+|\n+)?)('|"|`)(dm|text|voice|category|news|store|unknown)('|"|`)/g,
      (sub) => {
        var type;
        if (sub === '"dm"') type = "DM";
        else if (sub === '"text"') type = "GUILD_TEXT";
        else if (sub === '"voice"') type = "GUILD_VOICE";
        else if (sub === '"category"') type = "GUILD_CATEGORY";
        else if (sub === '"news"') type = "GUILD_NEWS";
        else if (sub === '"store"') type = "GUILD_STORE";
        else type = "UNKNOWN";
        return `"${type}"`;
      }
    )
    .replace(
      /(?<=((\w+)\.)?(\s+|\n+)?((\w+)\.)?(\s+|\n+)?setPresence(\s+|\n+)?\((\s+|\n+)?){(\s+|\n+)?activity(\s+|\n+)?:(\s+|\n+)?(.+)}/g,
      (sub) => {
        let activity = sub.match(/(?<=:)(\s+|\n+)?{.+/)[0].replace("}", "");
        return `{ activities: [${activity}] }`;
      }
    )
    .replace(
      /(?<=\.?((\w+)\.)?(\s+|\n+)?)(fetchBan|fetchBans)\(((\w+|\.+)+)?\)/g,
      (sub) => {
        if (sub.includes("fetchBans")) {
          return `bans.fetch();`;
        } else {
          return `bans.fetch(${sub.match(/(?<=\()\w+/)});`;
        }
      }
    )
    .replace(/fetchVanityCode\(\)/g, "fetchVanityData()")
    .replace(/(?<=(\.)?(\w)(\s+|\n+)?(\.)?member)\(.+\)/g, (sub) => {
      return `s.cache.get${sub}`;
    })
    .replace(/\w+\.+voice+/g, (sub) => {
      if (sub.startsWith("me.")) {
        return sub;
      } else return sub.replace("voice", "me.voice");
    })
    .replace(
      /(?<=(\.)?(\s+|\n+)?(\w+)?(\.)?(\s+|\n+)?)createOverwrite/g,
      "permissionOverwrites.create"
    )
    .replace(
      /(?<=(\.)?(\s+|\n+)?(\w+)?(\.)?(\s+|\n+)?)overwritePermissions/g,
      "permissionOverwrites.set"
    )
    .replace(
      /(?<=(\.)?(\s+|\n+)?(\w+)?(\.)?(\s+|\n+)?)updateOverwrite/g,
      "permissionOverwrites.edit"
    )
    .replace(
      /(?<=(\.)?(\s+|\n+)?(\w+)?(\s+|\n+)?(\.)?ban\()('|"|`).+('|"|`)/g,
      (sub) => {
        return `{ reason: ${sub} }`;
      }
    )
    .replace(/(\w+\.+)?delete.+\)/g, (sub) => {
      let timeout = sub.match(/(?<=timeout(\s+|\n+)?:).+}/);
      if (!timeout) return sub;

      timeout = timeout[0]
        ?.split("")
        ?.filter((e) => {
          return !isNaN(parseInt(e));
        })
        ?.join("");

      return `setTimeout(() => { ${sub.split(".")[0]}.delete() },${timeout})`;
    });
}

function files(dir, d) {
  const FF = fs.readdirSync(dir, {
    withFileTypes: true,
  });

  let FFF = [];

  for (const file of FF) {
    if (file.isDirectory()) {
      if (!fs.existsSync(resolve(d, file.name))) {
        fs.mkdirSync(resolve(d, file.name));
      }
      files(`${dir}/${file.name}`, `${d}/${file.name}`).forEach((f) => {
        return FFF.push(file.name + "/" + f);
      });
    } else {
      FFF.push(file.name);
    }
  }
  return FFF;
}

function convertTime(ms) {
  let time = ms / 1000;
  let seconds = 0;
  let minutes = 0;
  let hours = 0;

  while (time > 60) {
    minutes = minutes + 1;
    time = time - 60;
  }
  while (minutes > 60) {
    hours = hours + 1;
    minutes = minutes - 60;
  }
  seconds = seconds.toFixed(2);
  if (time != 0) seconds = time;
  return `${hours > 0 ? `${hours < 10 ? `0${hours}` : hours}:` : ""}${
    minutes > 0 ? `${minutes < 10 ? `0${minutes}` : minutes}:` : ""
  }${seconds < 10 ? `0${seconds}` : seconds}`;
}

module.exports = { converter, files, convertTime };
module.exports.default = { converter, files, convertTime };
