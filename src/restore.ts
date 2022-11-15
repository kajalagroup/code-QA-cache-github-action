import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as github from "@actions/github";
import { Inputs, State } from "./constants";
import * as utils from "./utils";

async function run(): Promise<void> {
  try {
    core.debug("Checking for cached code QA cache...");

    const cachePaths = utils.getInputAsArray(Inputs.Path, {
        required: true
    });
    const primaryKey = core.getInput(Inputs.Key, { required: true });
    const key = primaryKey + github.context.sha;

    const restoreKeys = utils.getInputAsArray(Inputs.RestoreKeys);

    core.debug("Cache paths: " + cachePaths);
    core.debug("Cache key: " +  key);
    core.debug("Cache restore keys: " + restoreKeys);

    const cacheKey = await cache.restoreCache(cachePaths, key, restoreKeys);

    const exactMatch = cacheKey === key;
    core.saveState(State.exactMatch, exactMatch);
  } catch (error: unknown) {
    core.setFailed((error as Error).message);
  }
}


run();

export default run;