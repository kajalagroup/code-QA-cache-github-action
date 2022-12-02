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
    const primaryKey = core.getInput(Inputs.Key, { required: true })  + github.context.sha;
    

    const restoreKeys = utils.getInputAsArray(Inputs.RestoreKeys);

    core.debug("Cache paths: " + cachePaths);
    core.debug("Cache key: " +  primaryKey);
    core.debug("Cache restore keys: " + restoreKeys);

    const cacheKey = await cache.restoreCache(cachePaths, primaryKey, restoreKeys);

    const exactMatch = cacheKey === primaryKey;
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
        if (Array.isArray(data)){
            core.debug("data is an array")
            data.forEach((item) => {
                core.debug(JSON.stringify(item))
             });
        }else{
            const actionCaches = data.actions_caches
            core.debug("Length cache found "+ actionCaches.length)
            actionCaches.forEach( async (item:any) =>  {
                core.debug("Item id " + item.id + "key "+ item.key)
                if (item.key != primaryKey){ 
                    await octokit.request('DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}', { // Remove old caches
                        owner: github.context.repo.owner,
                        repo: github.context.repo.repo,
                        key:item.key
                    })
                }
            })
        }
    }


  } catch (error: unknown) {
    core.setFailed((error as Error).message);
  }
}


run();

export default run;