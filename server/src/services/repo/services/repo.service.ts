import mongoose, { Types } from "mongoose";
import AppError from "@/shared/utils/app-error";
import {
	RepoRepository,
	type RepoRepositoryContract,
} from "../repositories/repo.repository";
import {
	IndexingStatus,
	type IRepo,
	type RepoDocument,
} from "@/shared/models/repos.model";
import type { auth } from "@/shared/config/auth";
import { Octokit } from "octokit";
import {
	UserRepository,
	type UserRepositoryContract,
} from "../repositories/user.repository";
import type { Inngest } from "inngest";

export class RepoService {
	constructor(
		private readonly repoRepository: RepoRepositoryContract = new RepoRepository(),
		private readonly authRepo: typeof auth,
		private readonly userRepository: UserRepositoryContract = new UserRepository(),
		private readonly inngest: Inngest
	) {}

	async getAllRepos(): Promise<RepoDocument[]> {
		return this.repoRepository.findAll();
	}


	private validateId(id: string): void {
		if (!Types.ObjectId.isValid(id)) {
			throw new AppError("Invalid task id", 400);
		}
	}

	async fetchAllRepo(accessToken: string) {
		const octokit = new Octokit({
			auth: accessToken,
		});

		return octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
			visibility: "public",
			per_page: 100,
		});
	}

	async createAllRepo(
		authUserId: string,
		accountId: string,
	): Promise<RepoDocument[]> {
		const userProfile = await this.userRepository.findByAuthUserId(authUserId);
		if (!userProfile) {
			throw new AppError("User profile not found", 404);
		}

		const { accessToken } = await this.authRepo.api.getAccessToken({
			body: {
				accountId,
				userId: authUserId,
			},
		});

		if (!accessToken) {
			throw new AppError("GitHub access token is unavailable", 401);
		}

		const allFetchRepoData = await this.fetchAllRepo(accessToken);
		const allInsertRepo: IRepo[] = allFetchRepoData.map((data) => ({
			userId: new Types.ObjectId(userProfile._id.toString()),
			githubRepoId: data.id,
			fullName: data.full_name,
			defaultBranch: data.default_branch ?? "main",
			private: data.private,
			language: data.language ?? null,
			stars: data.stargazers_count,
			indexingStatus: IndexingStatus.NotIndexed,
			indexingProgress: {
				filesProcessed: 0,
				totalFiles: 0,
			},
			lastIndexedCommitSha: null,
			lastIndexedAt: null,
			isOutdated: false,
			webhookId: null,
			isActive: true,
			deactivatedAt: null,
		}));

		return this.repoRepository.bulkInsert(allInsertRepo);
	}

	async indexingRepo(fullName:string,repoId:string,userId:string, accountId:string){
		const repoData = await this.repoRepository.findOne({_id:new mongoose.Types.ObjectId(repoId),fullName,userId:new mongoose.Types.ObjectId(userId)});
		if(!repoData || repoData == null){
			throw new Error('Repo not found');
		}
		const { accessToken } = await this.authRepo.api.getAccessToken({
			body: { accountId, userId },
		});

		const repoDetail = fullName.split("/");

		await this.repoRepository.updateById(repoId,{
			$set:{
				indexingStatus:IndexingStatus.Indexing,
			}
		})

		await this.inngest.send({
			name:"repo/rag-indexing",
			data:{
				repo:repoDetail[1],
				token:accessToken, 
				owner:repoDetail[0],
				githubRepoId:repoId
			},
		})

		return true

	}
}
