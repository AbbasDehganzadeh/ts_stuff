/* Calculation App,

    This file includes the calculation functions
    and the whole functionality is dumped into one file

*/

// an interface for the calculation functions
interface NumOps {
  num1: number;
  oper: string;
  num2: number;
}

function addFunc(req: NumOps): number {
  // a func that takes NumOps interface and returns a sum of them
  return req.num1 + req.num2;
}

function subFunc(req: NumOps): number {
  // a func that takes NumOps interface and returns a subtract of them
  return req.num1 - req.num2;
}
function mulFunc(req: NumOps): number {
  // a func that takes NumOps interface and returns a multiply of them
  return req.num1 * req.num2;
}
function divFunc(req: NumOps): number {
  // a func that takes NumOps interface and returns a devision of them
  return req.num1 / req.num2;
}

/*
    definig main function for principal of app functionality.
    43: It calls the main function
    46-60: It inputs the parameters from the user,
    and corresponding functions returns the result...

*/

main();
function main(): boolean {
  /* The Main Function */
  console.info(`This program is made for purposes of
     calculating numbers 
        `);while(true){
  let num1: unknown = prompt("\tplease enter the first number");
  let oper: string | any = prompt("\tplease enter the operation");
  let num2: unknown = prompt("\tplease enter the second number");
  let n1 = Number(num1);
  let n2 = Number(num2);
  let res: number;

  let nums: NumOps = {
    num1: n1,
    oper,
    num2: n2,
  };

  switch (oper) {
    case "+":
      res = addFunc(nums);
      break;
    case "-"||"_":
      res = subFunc(nums);
      break;
    case "*"||"x"||"X":
      res = mulFunc(nums);
      break;
    case "/"||"\\":
      res = divFunc(nums);
      break;
    default:
      res = addFunc(nums);
      break;
  }

  res.toPrecision(3);
  console.log(`The result: ${res}`);
  console.info('Do you want to continue or not?\n')
  const ans=prompt('\t0:)Y ,\tyes\t\t1:)N ,\tno');
  if (ans&&ans=="yes"||ans=='y') break;

}
  console.info(`Thank you for using this application
        \tsee you at http://github.com/AbbasDehganzadeh/`);

  return true;
}
