/* The Noter Programme
*/



const fs = require("node:fs");
const readline = require("node:readline/promises");


const rl = readline.createInterface(
    (input = process.stdin),
    (output = process.stdout)
);


async function write() {
    const answer = await rl.question("$$: \t")
    console.debug(answer)
    return answer + '\n'
}

function openFile() { }

function readFile() {
    fs.readFile(FILENAME, "utf8", (err, data) => {
        if (err) {
            console.warn("READERROR: ", err);
            process.exit(2);
        }
        console.info(data);
    });
}

async function writeFile() {
    await write().then((data, err) => {
        if (data) {
		//TODO:don't save the changes whether returns false!
		// if (data == '!q\n') {return false}
		if (data == '?q\n') {return true}

            fs.writeFile(FILENAME, data, { encoding: "utf-8" }, (err) => {
                if (err) {
                    console.warn("WRITEERROR: ", err);
                    process.exit(2);
                }
            }
            )
        }
    })
};


async function appendFile() {
    await write().then((data, err) => {
        if (data) {
		//TODO:don't save the changes whether returns false!
		// if (data == '!q\n') {return false}
		if (data == '?q\n') {return true}

            fs.appendFile(FILENAME, data, { encoding: "utf-8" }, (err) => {
                if (err) {
                    console.warn("APPENDERROR: ", err);
                    process.exit(2);
                }
            })
        }
    }
    )
}

module.exports = { readFile, writeFile, appendFile };
