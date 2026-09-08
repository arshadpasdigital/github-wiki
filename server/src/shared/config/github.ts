
import { Octokit } from "octokit";

export interface IFiles{
  path:string,
  content:string
}

const SKIP_DIR: string[] = [];
const SKIP_FILES = new Set<string>();
const SKIP_EXENSION = new Set<string>();

export const shouldSkipFiles = (path:string,size?:number)=>{
  const parts = path.split("/");
  const fileName = parts.at(-1) ?? "";

  if(parts.some((part)=>SKIP_DIR.includes(part))) return true;
  if(SKIP_FILES.has(fileName)) return true;
  if(typeof size ==='number' && size>20_000) return true;
  const ext = fileName?.includes(".") ? fileName.slice(fileName.lastIndexOf(".")+1).toLowerCase():"";

  if(SKIP_EXENSION.has(ext)) return true;
  if(fileName?.endsWith(".min.js")) return true;

  return false;
}

export const parseRepo =(input:string)=>{
  const clean = input.replace("http://github.com","")
            .replace('https://github.com','')
            .replace(/\.git$/,"");

  const [owner,repo] = clean.split("/");
  return {owner, repo, ownerKey:`${owner}:${repo}`}
}

export const fetchRepo = async (token:string, owner:string,repo:string)=>{
  const octokit = new Octokit({auth:token});

  const {data:repoInfo} = await octokit.rest.repos.get({owner,repo}).catch((err)=>{
    if(err.status == 404){
      throw new Error("Github Repo doesn't exist")
    }
    throw err
  })

  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: repoInfo.default_branch,
    recursive:"true"
  });
  
    const files:IFiles[] =[];
    for (const item of treeData.tree) {
        if(item.type !== "blob") continue;
        if(shouldSkipFiles(item.path,item.size)) continue;

        const {data: blob} = await octokit.rest.git.getBlob({
          owner, repo,file_sha:item.sha
        });

        files.push({
          path:item.path,
          content:Buffer.from(blob.content,"base64").toString("utf8"),
        })

      if(files.length >= 200) break;
    }

    const { data: refData } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${repoInfo.default_branch}`,
    });

    return {files, sha: refData.object.sha}
}