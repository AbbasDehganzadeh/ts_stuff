
function checkMode(args) {
  const argv = [args.write,args.read,args.append]
  
  const found = argv.reduce((p, v) => p + Number(v))
  let arg = undefined
  if (found > 1) {
	  console.error("You must choose only one mode [-w,-r,-a];")
	  process.exit(3)
  }

  if (args.write){arg = 'w'}
  if (args.read){arg = 'r'}
  if (args.append){arg = 'a'}
  // default from .env
  if (found == 0) {
    arg = process.env.NOTE_MODE;
    if (typeof arg !== 'string') {console.error("The mode is not specified!");process.exit(3)}
  }

  return arg
}

async function curryFunc(func) {
	while (true) {
       		const completed = await func()
		console.info(completed)
		if (completed) break;
	}
}
module.exports = { checkMode, curryFunc }
