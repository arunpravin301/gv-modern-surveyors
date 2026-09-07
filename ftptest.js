import * as ftp from "basic-ftp";

async function run() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "217.21.90.96",
            user: "u615813519",
            password: "9:+7Uh1VE8b~=P?r",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });
        console.log("--- ROOT DIRECTORY ---");
        let list = await client.list();
        for (let item of list) {
            console.log(item.name);
        }
        console.log("--- TRYING TO FIND WHERE FILES WENT ---");
        try {
            await client.cd("public_html");
            let list2 = await client.list();
            for (let item of list2) {
                console.log("public_html/" + item.name);
            }
        } catch(e) {}
    }
    catch(err) {
        console.log(err);
    }
    client.close();
}

run();
