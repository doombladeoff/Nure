const config = require("../../../config.json");
const client = require('../../index');

client.on("ready", async => {
  console.log(`[ READY ] \n\tВаш токен: ` + config.Token + `\n\t✅ Успешный вход в систему как: ${client.user.username}`);
});
