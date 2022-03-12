const { program } = require("commander");
const fs = require("fs");
const chalk = require("chalk");
const path = require("path");
const { files, converter, convertTime } = require("../functions");
const { format } = require("prettier");

program.version("1.0.0").description("discord.js v12 to v13 code converter");

program
  .option("-i, --input <dir>", "input for discord.js v12 project folder")
  .option(
    "-o, --output [dir]",
    "output path for discord.js v13 project folder",
    null
  )
  .option(
    "-p, --pretty",
    "pretty your project codes using prettier, optional.",
    null
  )
  .option("-l, --log", "enable|disable send logs to the console", null);

program.parse(process.argv);

let input = program.getOptionValue("input");
let output = program.getOptionValue("output");
let pretty = !!program.getOptionValue("pretty");
let log = !!program.getOptionValue("log");

if (!fs.existsSync(input)) {
  console.error(
    `🔍 ${chalk.bold.red("No such File or Directory With This directory!")}`
  );
  process.exit(1);
}

let inputPath = path.resolve(input);
let outputPath =
  output ??
  `${input.replace(
    inputPath.split(/\\/)[inputPath.split("\\").length - 1],
    "extracted-v13"
  )}`;

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}
outputPath = path.resolve(outputPath);
let FF = files(inputPath, outputPath);

let inputFiles = FF.map((i) => path.resolve(inputPath, i));

let outputFiles = FF.map((f) => {
  return path.resolve(outputPath, f);
});

if (log) {
  console.info(chalk.bold.grey(`ℹ converting ...`));
}

let startTime = Date.now();

let r = inputFiles.reduce((u, file, i) => {
  let outputFile = outputFiles[i];
  if (!outputFile) return;
  let code = fs.readFileSync(file, "utf-8");

  if (log) {
    console.info(
      chalk.bold.grey(`ℹ converting "${file.replace(inputPath, "")}"`)
    );
  }

  let converted = converter(code);

  if (pretty) {
    try {
      converted = format(converted, {
        parser: path.extname(file) === "ts" ? "babel-ts" : "babel",
      });
    } catch (e) {}
  }
  if (log) {
    console.info(
      chalk.bold.grey(
        `ℹ converted "${outputFile.replace(outputPath, "")}", writing`
      )
    );
  }
  fs.writeFileSync(outputFile, converted);
  if (log) {
    console.info(
      chalk.bold.grey(
        `ℹ done from write "${outputFile.replace(outputPath, "")}" code`
      )
    );
  }
  u.push({
    input: file,
    output: outputFile,
    code,
    convertedAt: Date.now(),
  });
  return u;
}, []);

if (log) {
  console.info(chalk.bold.grey(`ℹ done from converting`));
  console.info(
    chalk.bold.green(
      `ℹ ${r.length}/${
        inputFiles.length
      } file has been converted in: ${convertTime(Date.now() - startTime)}`
    )
  );
}
