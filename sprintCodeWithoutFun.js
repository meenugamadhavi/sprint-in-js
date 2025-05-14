// function instruction length is 5
// 8 => represents function called
// next one is function start
// next function end
// return value cell location
// args length
// args cell locations

// sample input 8 123 10 16 1 2 1 2 9 123 0 0 1 11 12 3

const add = (number1, number2) => number1 + number2;
const sub = (number1, number2) => number1 - number2;
const equal = (number1, number2) => number1 === number2;
const lessThan = (number1, number2) => number1 < number2;

const jump = function (sprintCode, location) {
  location = sprintCode[location + 1];
  return [sprintCode[location], location];
};

const copy = function (sprintCode, location) {
  const sourceCell = sprintCode[location + 1];
  const destination = sprintCode[location + 2];
  sprintCode[destination] = sprintCode[sourceCell];
  location += 3;

  return [sprintCode[location], location];
};

const getNumber = function (sprintCode, location) {
  return sprintCode[location];
};

const lessThanOrEqual = function (sprintCode, location, operation) {
  const number1 = getNumber(sprintCode, sprintCode[location + 1]);
  const number2 = getNumber(sprintCode, sprintCode[location + 2]);
  const destination = sprintCode[location + 3];
  const res = operation(number1, number2);
  location = res ? sprintCode[destination] : location + 4;

  return [sprintCode[location], location];
};

const addSub = function (sprintCode, location, operation) {
  const number1 = getNumber(sprintCode, sprintCode[location + 1]);
  const number2 = getNumber(sprintCode, sprintCode[location + 2]);
  const result = sprintCode[location + 3];
  sprintCode[result] = operation(number1, number2);

  return [sprintCode[location + 4], location + 4];
};

const addition = (sprintCode, location) => {
  return addSub(sprintCode, location, add);
};

const substraction = (sprintCode, location) => {
  return addSub(sprintCode, location, sub);
};

const jumpIfEqual = (sprintCode, location) => {
  return lessThanOrEqual(sprintCode, location, equal);
};

const jumpIfLessThan = (sprintCode, location) => {
  return lessThanOrEqual(sprintCode, location, lessThan);
};

const getFinalCode = function (sprintCode) {
  return "After Execution " + sprintCode.join(" ");
};

const createStack = (code, instrPointer) => {
  const stack = {
    name: code[instrPointer + 1],
    startPoint: code[instrPointer + 2],
    endPoint: code[instrPointer + 3],
    returnValueLoc: code[instrPointer + 4],
    length: code[instrPointer + 5],
  };
  stack["returnAddr"] = instrPointer + 6 + stack.length;
  const pos = instrPointer + 6;
  const args = [];
  for (let index = 0; index < stack.length; index++) {
    args.push(code[code[index + pos]]);
  }
  return { ...stack, args };
};

const executeFunction = (stack, pointer, code) => {
  let instruction = code[pointer];
  while (pointer < stack.endPoint) {
    if (!(instruction in commands)) return [9];
    [instruction, pointer] = commands[instruction](code, pointer);
  }

  return [code[stack.returnAddr], stack.returnAddr];
};

const functionCalled = (code, instrPointer) => {
  const stack = createStack(code, instrPointer);
  let pointer = stack.startPoint + 1;
  for (let i = 0; i < stack.args.length; i++) {
    code[pointer + i] = stack.args[i];
  }

  return executeFunction(stack, pointer + stack.length, code);
};

const commands = {
  1: addition,
  2: substraction,
  3: jump,
  4: jumpIfEqual,
  5: jumpIfLessThan,
  7: copy,
  8: functionCalled,
  // 10: returnValue,
};

const runInstructions = function (sprintCode, instruction, pos) {
  console.log(instruction);
  while (instruction !== 9) {
    if (!(instruction in commands)) {
      return `${instruction} command not found`;
    }

    [instruction, pos] = commands[instruction](sprintCode, pos);
  }

  return getFinalCode(sprintCode);
};

const getSprintCode = function () {
  const spacesCode = prompt("Enter Sprint Code");
  const sprintCode = spacesCode.split(" ").map((element) => +element);
  sprintCode.unshift(" ");

  return sprintCode;
};

const startSprint = function () {
  const code = getSprintCode();
  return runInstructions(code, code[1], 1);
};

console.log(startSprint());
