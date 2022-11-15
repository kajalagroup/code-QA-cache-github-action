import * as core from "@actions/core";
import * as cache from "@actions/cache";
import * as github from "@actions/github";
import { Inputs, State } from "./constants";
import * as utils from "./utils";
import { Octokit, App } from "octokit";

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


    const repoToken = core.getInput(Inputs.RepoToken, { required: false });
    if (repoToken){
        const octokit = new Octokit({
            auth: repoToken
        })
    
        const { data } = await octokit.request('GET /repos/{owner}/{repo}/actions/caches{?per_page,page,ref,key,sort,direction}', {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            key: restoreKeys[0]
        })
    
        core.debug("Rest API: " + data);
    }


  } catch (error: unknown) {
    core.setFailed((error as Error).message);
  }
}


run();

export default run;