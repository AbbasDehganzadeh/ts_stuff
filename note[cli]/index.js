/* The Noter Programme
 * this allows you to insert and read the note
 * It has three mode in case;
 * Case `w`: It truncates a file
    It adds the records in the beginning
    It continues 'till user stops [!q, ?q]
 * Case `r`: It reads a whole file or part of it
    It outputs the notes based on user filters
 * Case `a`: It has a loop until the user want to quit!q ?q
    It appends to file based on daytime and other metadata like: importance
 */





const fs = require("node:fs");
const os = require("node:os");
const {ArgumentParser} = require("argparse");
const { readFile, writeFile, appendFile } = require("./file");
const { checkMode, curryFunc } = require("./helper")

// global vars
global.FILENAME = process.env.NOTE_FILENAME || "note.txt";
global.TODAY = new Date()

console.log("The Noter Programme");
const parser = new ArgumentParser({description:"The Noter Programme"})
parser.add_argument('-w', "--write", {action:"store_true"})
parser.add_argument('-r', "--read", {action:"store_true"})
parser.add_argument('-a', "--append", {action:"store_true"})

const args = parser.parse_args()
console.dir(args)

let mode = checkMode(args)
const fileExists = fs.existsSync("note.txt");
if (!fileExists) process.exit(1); // Beware the user about `note.txt`
console.info("mode", mode);


async function main() {
    mode = mode[0].toLowerCase();
    switch (mode) {
        case "w":
            console.debug("write to file");
		await curryFunc(writeFile)
            console.debug("writing was ok!");
            break;
        case "r":
            console.debug("read to file");
            readFile();
            console.debug("reading was ok!");
            break;
        case "a":
	    console.debug("append to file");
	 	await curryFunc(appendFile)
            console.debug("appending was ok!");
            break;
        default:
            console.error("The option for file mode is invalid");
    }
}

//TODO: loop infinity;
	main()
