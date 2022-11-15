import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as github from "@actions/github";
import { Inputs, State } from "./constants";
import * as utils from "./utils";

async function run(): Promise<void> {
  try {
    core.debug("Maybe saving code QA cache...");

    const cachePaths = utils.getInputAsArray(Inputs.Path, {
        required: true
    });
    const primaryKey = core.getInput(Inputs.Key, { required: true });
    const key = primaryKey + github.context.sha;

    const exactMatch = core.getState(State.exactMatch);
    if (exactMatch === "false") {
      await cache.saveCache(cachePaths, key);
    } else {
      core.info(
        "Not saving the code QA cache because it was restored exactly for this commit."
      );
    }
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();

export default run;