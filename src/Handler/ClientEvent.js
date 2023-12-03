const fs = require("fs");

module.exports = (client) => {
    const eventFolder = fs.readdirSync('./src/Events');
    console.log(`[EVENT] Загрузчик`);
    eventFolder.forEach((dir) => {
        const eventFiles = fs.readdirSync(`./src/Events/${dir}/`).filter((files) => files.endsWith(".js"));

        for (const file of eventFiles) {
            const Event = require(`../Events/${dir}/${file}`)
            console.log(`\t✅ [ Events] События клиента загружено: ${file}`);
        }

    });

    console.log(`  -  Все EVENTS загружены | ✅`)
}