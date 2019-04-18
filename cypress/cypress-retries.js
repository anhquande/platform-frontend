const cypress = require("cypress");
const _ = require("lodash");

/*
* Add your config args in DEFAULT_CONFIG
* Set number of retries in MAX_NUM_RUNS
*/

// This script was taken from issue 1313 in Cypress
// https://github.com/cypress-io/cypress/issues/1313

const MAX_NUM_RUNS = 3;

const DEFAULT_CONFIG = {
  // you can omit 'spec' if you just want all your tests to run
  spec: process.argv.some(arg => arg == "--chrome")
    ? "**/LightWalletRegister.spec.e2e.ts"
    : "**/LightWalletRegister.spec.e2e.ts",
  browser: process.argv.some(arg => arg == "--chrome") ? "chrome" : "electron",
  record: true,
  taskTimeout: 240000,
  // parallelization options
  group: process.argv.some(arg => arg == "--chrome") ? "chrome-tests" : "main",
  parallel: process.argv.some(arg => arg == "--chrome") ? false : true,

  // only necessary if recording specs from a local machine
  /* ciBuildId: Math.random()
    .toString(16)
    .substr(2, 6), */
};

// id unique to the machine
const uniqueId = Math.random()
  .toString(16)
  .substr(2, 6);

let totalFailuresIncludingRetries = 0;

const run = (num, spec, retryGroup) => {
  num += 1;
  const config = Object.assign(_.cloneDeep(DEFAULT_CONFIG), {
    env: {
      numRuns: num,
    },
  });

  if (spec) config.spec = spec;
  if (retryGroup) config.group = retryGroup;

  return cypress.run(config).then(
    results => {
      if (results.failures > 0) {
        console.log(`Run exited with "${results.message}", \n very naughty?`);
        return process.exit(-1);
      }
      if (results.totalFailed) {
        totalFailuresIncludingRetries += results.totalFailed;

        // rerun again with only the failed tests
        const specs = _(results.runs)
          .filter("stats.failures")
          .map("spec.relative")
          .value();

        console.log(`Run #${num} failed.`);

        // if this is the 3rd total run (2nd retry)
        // and we've still got failures then just exit
        if (num >= MAX_NUM_RUNS) {
          console.log(`Ran a total of '${MAX_NUM_RUNS}' times but still have failures. Exiting...`);
          return process.exit(totalFailuresIncludingRetries);
        }

        console.log(`Retrying '${specs.length}' specs...`);
        console.log(specs);

        // If we're using parallelization, set a new group name
        let retryGroupName;
        if (DEFAULT_CONFIG.group) {
          retryGroupName = `${DEFAULT_CONFIG.group}: retry #${num}  (${specs.length} spec${
            specs.length === 1 ? "" : "s"
          } on ${uniqueId})`;
        }

        // kick off a new suite run
        return run(num, specs, retryGroupName);
      }
    },
    error => {
      console.log(`Run exited with ${error}, bad config?`);
      return process.exit(-1);
    },
  );
};

// kick off the run with the default specs
run(0).catch(error => {
  console.log(`Run exited with ${error}, bad config?`);
  return process.exit(-1);
});
