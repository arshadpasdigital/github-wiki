import asyncHandler from "@/shared/middlewares/async-handler";
import { ApiResponse } from "@/shared/utils/api-response";
import type { ActivityService } from "@/services/activity/services/activity.service";
import { listActivityQuerySchema } from "@/services/activity/validation/activity.validation";

export class ActivityController {
    constructor(private readonly activityService: ActivityService) {}

    readonly getRecent = asyncHandler(async (req, res) => {
        const { limit } = listActivityQuerySchema.parse(req.query);
        const activities = await this.activityService.getRecentActivity(
            req.user.id,
            limit,
        );

        res
            .status(200)
            .json(ApiResponse.success(activities, 200, "get recent activities"));
    });
}
